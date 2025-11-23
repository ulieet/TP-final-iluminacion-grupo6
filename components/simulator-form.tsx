"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Papa from "papaparse"; // import * as ... para compatibilidad con Turbopack
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Area } from "recharts";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

/**
 * SimulatorForm (premium)
 * - CSV URL: path local subido (el entorno transformará a URL): "/mnt/data/04 - Iluminacion.csv"
 * - No se cambió el nombre del export: export function SimulatorForm() { ... }
 *
 * Requisitos: instalar papaparse, recharts, html-to-image, file-saver. (framer-motion opcional)
 *
 * NOTA: El bootstrap aquí hace resampling de residuos para producir un IC 95% aproximado. Para IC más rigurosos
 * conviene re-fitear modelos por muestra y/o realizar el bootstrap en backend (Python/FastAPI). Puedo armar eso también.
 */

// ********** CONFIG: ruta del CSV **********
// Según lo solicitado, usamos la ruta local del entorno; el deploy debe mapearla a URL pública.
// (El developer indicó usar la ruta del archivo subido en la sesión: /mnt/data/04 - Iluminacion.csv)
const CSV_URL = "/04 - Iluminacion.csv";

// ********** MODELS METADATA (coeficientes calculados en Python) **********
const MODELS = {
  linear: {
    rmse: 10062.351885244954,
    rsquared: 0.8211715332283132,
    params: {
      const: 182.1909783853789,
      superficie_m2: 755.7826109611502,
      amb_oficina: 17270.77956878509,
      amb_sala_reuniones: -4409.308106903976,
      tec_LED: -8597.042544867187,
    },
  },
  log_linear: {
    rmse: 11094.076246029239,
    rsquared: 0.8551376464581005,
    params: {
      const: 9.505437101733772,
      superficie_m2: 0.01846409410612808,
      amb_oficina: 0.41650901553465297,
      amb_sala_reuniones: -0.3058825288769409,
      tec_LED: -0.20781388729838854,
    },
  },
  poly2: {
    rmse: 10040.706262264997,
    rsquared: 0.8219400792345765,
    params: {
      const: -2778.524785128735,
      superficie_m2: 872.6285490842386,
      superficie_m2_sq: -0.9248431713931904,
      amb_oficina: 16970.86374249131,
      amb_sala_reuniones: -4366.75587550686,
      tec_LED: -8589.380299889963,
    },
  },
};

// ********** PREDICTORS (usando coeficientes) **********
function predictLinear(superficie: number, ambiente: string, tecnologia: string) {
  const p: any = MODELS.linear.params;
  let y = p.const + p.superficie_m2 * superficie;
  if (ambiente === "oficina") y += p.amb_oficina;
  if (ambiente === "sala_reuniones") y += p.amb_sala_reuniones;
  if (tecnologia.toUpperCase() === "LED") y += p.tec_LED;
  return y;
}
function predictLogLinear(superficie: number, ambiente: string, tecnologia: string) {
  const p: any = MODELS.log_linear.params;
  let v = p.const + p.superficie_m2 * superficie;
  if (ambiente === "oficina") v += p.amb_oficina;
  if (ambiente === "sala_reuniones") v += p.amb_sala_reuniones;
  if (tecnologia.toUpperCase() === "LED") v += p.tec_LED;
  return Math.expm1(v);
}
function predictPoly2(superficie: number, ambiente: string, tecnologia: string) {
  const p: any = MODELS.poly2.params;
  let y = p.const + p.superficie_m2 * superficie + p.superficie_m2_sq * superficie * superficie;
  if (ambiente === "oficina") y += p.amb_oficina;
  if (ambiente === "sala_reuniones") y += p.amb_sala_reuniones;
  if (tecnologia.toUpperCase() === "LED") y += p.tec_LED;
  return y;
}

// ********** Helpers de parsing (coma decimal -> punto) **********
type RawRow = { tipo_ambiente?: string; superficie_m2?: string; tecnologia?: string; lumenes_requeridos_lm?: string };
type Row = { tipo_ambiente: string; superficie_m2: number; tecnologia: string; lumenes_requeridos_lm: number };

function parseRow(r: RawRow): Row | null {
  const supRaw = (r.superficie_m2 ?? "").toString().trim();
  const lmRaw = (r.lumenes_requeridos_lm ?? "").toString().trim();
  if (!supRaw || !lmRaw) return null;
  const sup = Number(supRaw.replace(/\s/g, "").replace(",", "."));
  const lm = Number(lmRaw.replace(/\s/g, "").replace(",", "."));
  if (!isFinite(sup) || !isFinite(lm)) return null;
  return {
    tipo_ambiente: (r.tipo_ambiente ?? "aula").toLowerCase().trim(),
    superficie_m2: sup,
    tecnologia: (r.tecnologia ?? "LED").toUpperCase().trim(),
    lumenes_requeridos_lm: lm,
  };
}

// ********** COMPONENT **********
export function SimulatorForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // inputs
  const [superficie, setSuperficie] = useState<number>(35.0);
  const [ambiente, setAmbiente] = useState<"aula" | "oficina" | "sala_reuniones">("aula");
  const [tecnologia, setTecnologia] = useState<"LED" | "FLUORESCENTE">("LED");
  const [selectedModel, setSelectedModel] = useState<"poly2" | "linear" | "log_linear">("poly2");

  // bootstrap IC
  const [bootIC, setBootIC] = useState<{ low: number; high: number } | null>(null);
  const [bootIters, setBootIters] = useState<number>(200);
  const chartRef = useRef<HTMLDivElement | null>(null);

  // cargar csv al montar
  useEffect(() => {
    setLoading(true);
    Papa.parse<RawRow>(CSV_URL, {
      download: true,
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (res) => {
        const parsed: Row[] = [];
        for (const r of res.data) {
          const pr = parseRow(r);
          if (pr) parsed.push(pr);
        }
        setRows(parsed);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV load error:", err);
        setLoading(false);
      },
    });
  }, []);

  // seleccionar mejor modelo por RMSE (metadata)
  useEffect(() => {
    const order = [
      { name: "linear", rmse: MODELS.linear.rmse },
      { name: "log_linear", rmse: MODELS.log_linear.rmse },
      { name: "poly2", rmse: MODELS.poly2.rmse },
    ].sort((a, b) => a.rmse - b.rmse);
    setSelectedModel(order[0].name as any);
  }, []);

  // preds para el input actual
  const preds = useMemo(() => {
    return {
      linear: predictLinear(superficie, ambiente, tecnologia),
      log_linear: predictLogLinear(superficie, ambiente, tecnologia),
      poly2: predictPoly2(superficie, ambiente, tecnologia),
    };
  }, [superficie, ambiente, tecnologia]);

  const chosenY = preds[selectedModel];

  // bootstrap (residual resampling) para IC 95% client-side
  useEffect(() => {
    if (rows.length === 0) return;
    let cancelled = false;
    (async () => {
      const iters = Math.max(100, Math.min(500, bootIters));
      const out: number[] = [];
      // Precompute residuals per row for chosen model
      for (let it = 0; it < iters; it++) {
        // sample residual by sampling an index i and computing (yobs - yhat) for that row
        const idx = Math.floor(Math.random() * rows.length);
        const r = rows[idx];
        const yobs = r.lumenes_requeridos_lm;
        let yhat;
        if (selectedModel === "linear") yhat = predictLinear(r.superficie_m2, r.tipo_ambiente, r.tecnologia);
        else if (selectedModel === "log_linear") yhat = predictLogLinear(r.superficie_m2, r.tipo_ambiente, r.tecnologia);
        else yhat = predictPoly2(r.superficie_m2, r.tipo_ambiente, r.tecnologia);
        const resid = yobs - yhat;
        // add resid to predicted value for user's input
        out.push(chosenY + resid);
      }
      if (cancelled) return;
      out.sort((a, b) => a - b);
      const low = out[Math.floor(0.025 * out.length)];
      const high = out[Math.floor(0.975 * out.length)];
      setBootIC({ low: Math.max(0, low), high });
    })();
    return () => {
      cancelled = true;
    };
  }, [rows, selectedModel, superficie, ambiente, tecnologia, bootIters, chosenY]);

  // Chart data: take comparable subset (same ambiente+tec) or full if few
  const chartData = useMemo(() => {
    const subset = rows.filter((r) => r.tipo_ambiente === ambiente && r.tecnologia === tecnologia);
    const use = subset.length >= 20 ? subset : rows.slice(0, 500);
    return use.map((r) => ({ x: r.superficie_m2, y: r.lumenes_requeridos_lm }));
  }, [rows, ambiente, tecnologia]);

  // export chart PNG
  function exportPNG() {
    if (!chartRef.current) return;
    toPng(chartRef.current, { cacheBust: true })
      .then((dataUrl) => {
        saveAs(dataUrl, "simulador_chart.png");
      })
      .catch((err) => console.error("export PNG error", err));
  }

  // download subset csv
  function downloadSubsetCSV() {
    const subset = rows.filter((r) => r.tipo_ambiente === ambiente && r.tecnologia === tecnologia).slice(0, 500);
    const csv = Papa.unparse(subset);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "simulador_subset.csv");
  }

  // simple recommendation: luminaria de 4000 lm útil por unidad, 40 W por unidad (configurable)
  const rec = useMemo(() => {
    const lum = Math.max(0, Math.round(chosenY));
    const units = Math.max(1, Math.round(lum / 4000));
    const power = Math.round(units * 40);
    return { lum, units, power };
  }, [chosenY]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Simulador Premium — Proyecciones & Margen de Error</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* controls */}
        <div className="p-4 border rounded space-y-3">
          <label className="text-sm font-medium">Superficie (m²)</label>
          <input
            type="number"
            value={superficie}
            onChange={(e) => setSuperficie(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <label className="text-sm font-medium mt-2">Tipo de ambiente</label>
          <select value={ambiente} onChange={(e) => setAmbiente(e.target.value as any)} className="w-full border p-2 rounded">
            <option value="aula">Aula</option>
            <option value="oficina">Oficina</option>
            <option value="sala_reuniones">Sala de reuniones</option>
          </select>

          <label className="text-sm font-medium mt-2">Tecnología</label>
          <select value={tecnologia} onChange={(e) => setTecnologia(e.target.value as any)} className="w-full border p-2 rounded">
            <option value="LED">LED</option>
            <option value="FLUORESCENTE">Fluorescente</option>
          </select>

          <div className="mt-3">
            <label className="text-sm font-medium">Modelo (automático por RMSE)</label>
            <div className="flex gap-2 mt-2">
              <button className={`px-3 py-1 rounded ${selectedModel === "poly2" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setSelectedModel("poly2")}>poly2</button>
              <button className={`px-3 py-1 rounded ${selectedModel === "linear" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setSelectedModel("linear")}>linear</button>
              <button className={`px-3 py-1 rounded ${selectedModel === "log_linear" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setSelectedModel("log_linear")}>log_lin</button>
            </div>
          </div>

          <div className="text-xs text-gray-600 mt-3">
            <div>RMSE seleccionado: {Math.round((MODELS as any)[selectedModel].rmse).toLocaleString()} lm</div>
            <div>R²: {(((MODELS as any)[selectedModel].rsquared) ?? 0).toFixed(3)}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={exportPNG} className="px-3 py-2 bg-indigo-600 text-white rounded">Export PNG</button>
            <button onClick={downloadSubsetCSV} className="px-3 py-2 bg-gray-200 rounded">Descargar CSV</button>
          </div>

          <div className="mt-4 text-sm">
            <strong>Recomendación rápida:</strong>
            <div>Nº luminarias (≈4k lm/unid): <strong>{rec.units}</strong></div>
            <div>Potencia estimada: <strong>{rec.power} W</strong></div>
          </div>
        </div>

        {/* chart + metrics */}
        <div className="md:col-span-2 p-4 border rounded" ref={chartRef}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Comparativa: datos reales vs proyección</h3>
              <div className="text-sm text-gray-600">Puntos reales (scatter), línea de predicción y banda IC (bootstrap)</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Predicción (modelo): <strong>{selectedModel}</strong></div>
              <div className="text-xl font-bold">{Math.round(chosenY).toLocaleString()} lm</div>
            </div>
          </div>

          <div className="mt-2" style={{ width: "100%", height: 360 }}>
            {loading ? (
              <div>Cargando dataset...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Superficie (m²)" unit="m²" />
                  <YAxis type="number" dataKey="y" name="Lúmenes" unit="lm" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Reales" data={chartData} fill="#1f2937" />
                  <Line
                    type="monotone"
                    data={Array.from({ length: 40 }, (_, i) => {
                      const maxX = Math.max(...chartData.map(d => d.x), superficie || 1);
                      const x = (maxX * i) / 39;
                      const y = selectedModel === "linear" ? predictLinear(x, ambiente, tecnologia)
                        : selectedModel === "log_linear" ? predictLogLinear(x, ambiente, tecnologia)
                        : predictPoly2(x, ambiente, tecnologia);
                      return { x, y };
                    })}
                    dataKey="y"
                    stroke="#ef4444"
                    dot={false}
                    name="Predicción"
                  />
                  {bootIC && (
                    <Area
                      type="monotone"
                      data={Array.from({ length: 40 }, (_, i) => {
                        const maxX = Math.max(...chartData.map(d => d.x), superficie || 1);
                        const x = (maxX * i) / 39;
                        const y = selectedModel === "linear" ? predictLinear(x, ambiente, tecnologia)
                          : selectedModel === "log_linear" ? predictLogLinear(x, ambiente, tecnologia)
                          : predictPoly2(x, ambiente, tecnologia);
                        return { x, y, y0: bootIC.low, y1: bootIC.high };
                      })}
                      dataKey="y1"
                      stroke="none"
                      fill="#fef3c7"
                      fillOpacity={0.5}
                      name="IC 95%"
                    />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">Predicción seleccionada</div>
              <div className="text-xl font-bold">{Math.round(chosenY).toLocaleString()} lm</div>
            </div>
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">IC Bootstrap 95%</div>
              <div className="text-xl font-bold">{bootIC ? `${Math.round(bootIC.low).toLocaleString()} — ${Math.round(bootIC.high).toLocaleString()} lm` : "calculando..."}</div>
            </div>
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">Bandas ±RMSE</div>
              <div className="text-xl font-bold">{`${Math.round(chosenY - (MODELS as any)[selectedModel].rmse).toLocaleString()} — ${Math.round(chosenY + (MODELS as any)[selectedModel].rmse).toLocaleString()} lm`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Antes / Después premium */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold">Antes / Después (ejemplos reales)</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {rows.slice(0, 3).map((r, i) => {
            const proj = selectedModel === "linear" ? predictLinear(r.superficie_m2, r.tipo_ambiente, r.tecnologia)
              : selectedModel === "log_linear" ? predictLogLinear(r.superficie_m2, r.tipo_ambiente, r.tecnologia)
              : predictPoly2(r.superficie_m2, r.tipo_ambiente, r.tecnologia);
            return (
              <div key={i} className="p-4 bg-white border rounded shadow-sm">
                <div className="text-xs text-gray-500">Superficie</div>
                <div className="font-bold text-lg">{r.superficie_m2} m²</div>

                <div className="text-xs text-gray-500 mt-2">Real</div>
                <div className="text-lg font-semibold">{Math.round(r.lumenes_requeridos_lm).toLocaleString()} lm</div>

                <div className="text-xs text-gray-500 mt-2">Proyección</div>
                <div className="text-lg font-semibold text-blue-600">{Math.round(proj).toLocaleString()} lm</div>

                <div className="text-sm text-gray-600 mt-2">Diferencia: {Math.round(proj - r.lumenes_requeridos_lm).toLocaleString()} lm</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <strong>Notas técnicas:</strong> El bootstrap implementado es un método de remuestreo de residuos (rápido y útil para demos).
        Para intervalos estadísticos más rigurosos se recomiendan procedimientos de re-fit (por muestra) implementados en backend con Python/statsmodels.
        Si querés lo implemento en FastAPI y devuelvo los percentiles ya calculados para mejorar rendimiento y precisión.
      </div>
    </div>
  );
}

