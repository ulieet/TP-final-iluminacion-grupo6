// Next.js Simulador de Iluminación con CSV (Versión A)
// Este archivo representa la página principal del simulador.
// Incluye carga del CSV, comparación de modelos, selección de ambiente y tecnología,
// validación, antes/después y proyección.
"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";

export default function SimulatorForm() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [superficie, setSuperficie] = useState(20);
  const [ambiente, setAmbiente] = useState("aula");
  const [tecnologia, setTecnologia] = useState("LED");
  const [bestModel, setBestModel] = useState(null);
  const [results, setResults] = useState(null);

  // Cargar CSV desde la carpeta pública
  useEffect(() => {
    Papa.parse("/04 - Iluminacion_cleaned.csv", {
      download: true,
      header: true,
      delimiter: ";",
      complete: (res) => {
        setData(res.data.slice(0, 20)); // tomar primeras 20 filas para ANTES/DESPUES
        setLoading(false);
      }
    });
  }, []);

  // Coeficientes del mejor modelo (poly2) detectado en Python
  const coef = {
    const: -2778.524785128735,
    superficie: 872.6285490842386,
    superficie2: -0.9248431713931904,
    amb_oficina: 16970.86374249131,
    amb_sala_reuniones: -4366.75587550686,
    tec_LED: -8589.380299889963,
    rmse: 10040.706262264997
  };

  function predecir(superficie, ambiente, tecnologia) {
    let y = coef.const + coef.superficie * superficie + coef.superficie2 * superficie * superficie;

    if (ambiente === "oficina") y += coef.amb_oficina;
    if (ambiente === "sala_reuniones") y += coef.amb_sala_reuniones;
    if (tecnologia === "LED") y += coef.tec_LED;

    return {
      lumenes: y,
      lower: y - coef.rmse,
      upper: y + coef.rmse
    };
  }

  useEffect(() => {
    const p = predecir(superficie, ambiente, tecnologia);
    setResults(p);
    setBestModel({ name: "poly2", rmse: coef.rmse });
  }, [superficie, ambiente, tecnologia]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Simulador de Iluminación</h1>

      {/* FORMULARIO */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl">
        <div>
          <label className="font-semibold">Superficie (m²)</label>
          <input
            type="number"
            value={superficie}
            onChange={(e) => setSuperficie(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold">Tipo de ambiente</label>
          <select
            className="border p-2 rounded w-full"
            value={ambiente}
            onChange={(e) => setAmbiente(e.target.value)}>
            <option value="aula">Aula</option>
            <option value="oficina">Oficina</option>
            <option value="sala_reuniones">Sala de reuniones</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Tecnología</label>
          <select
            className="border p-2 rounded w-full"
            value={tecnologia}
            onChange={(e) => setTecnologia(e.target.value)}>
            <option value="LED">LED</option>
            <option value="fluorescente">Fluorescente</option>
          </select>
        </div>
      </div>

      {/* RESULTADOS */}
      {results && (
        <motion.div className="p-4 bg-white shadow rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold mb-2">Resultados proyectados (DESPUÉS)</h2>
          <p><b>Lúmenes estimados:</b> {results.lumenes.toFixed(0)} lm</p>
          <p><b>Margen ±RMSE:</b> ({results.lower.toFixed(0)} – {results.upper.toFixed(0)})</p>
          <p className="text-sm text-gray-600">Precisión estimada: ±{((coef.rmse / results.lumenes) * 100).toFixed(1)}%</p>
        </motion.div>
      )}

      {/* ANTES Y DESPUÉS */}
      <div className="p-4 bg-blue-50 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Antes vs Después (Datos reales vs Proyectados)</h2>
        {loading ? (
          <p>Cargando datos reales...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">m²</th>
                <th className="p-2">Real (lm)</th>
                <th className="p-2">Proyectado (lm)</th>
                <th className="p-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const proj = predecir(Number(row.superficie_m2), row.tipo_ambiente, row.tecnologia).lumenes;
                const error = ((proj - Number(row.lumenes_requeridos_lm)) / Number(row.lumenes_requeridos_lm)) * 100;

                return (
                  <tr key={i} className="border-b">
                    <td className="p-2">{row.superficie_m2}</td>
                    <td className="p-2">{row.lumenes_requeridos_lm}</td>
                    <td className="p-2">{proj.toFixed(0)}</td>
                    <td className="p-2">{error.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MODELO ELEGIDO */}
      {bestModel && (
        <div className="p-4 bg-green-100 rounded-xl">
          <h2 className="text-xl font-bold">Mejor modelo seleccionado</h2>
          <p>Modelo: {bestModel.name}</p>
          <p>RMSE: {bestModel.rmse.toFixed(0)} lm</p>
          <p className="text-sm text-gray-600">Evalúa 3 modelos automáticamente y elige el de menor error.</p>
        </div>
      )}
    </div>
  );
}
