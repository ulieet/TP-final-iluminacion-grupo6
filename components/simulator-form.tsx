/**
 * SimuladorIluminacion.tsx (VERSIÓN FINAL Y COMPLETA)
 *
 * * 🛠️ CORRECCIÓN: Se tipa el parámetro ignorado '_' en onResize para eliminar 
 * * el error de TypeScript ts(7006) en modo estricto.
 */
"use client";

import React, { useMemo, useRef, useState, useEffect } from "react"; 
import {
    AreaChart, 
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    Area,
} from "recharts";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";

// -------------------- CONSTANTES: COEFICIENTES OLS, LUX Y LUMINARIAS --------------------
const COEFICIENTES_LS = {
    INTERCEPTO: -8414.85, 
    SUPERFICIE_M2: 755.78,
    OFICINA: 17270.78, 
    SALA_REUNIONES: -4409.31,
    FLUORESCENTE: 8597.04,
};

const LUX_PRESETS: Record<Ambiente, number> = {
    aula: 400,          
    oficina: 500,       
    sala_reuniones: 300, 
};

// ⬅️ LISTA PRECARGADA DE LUMINARIAS (Objetivo: Aconsejar luminarias)
const LUMINAIRE_OPTIONS = [
    // Modelos LED
    { id: 'L1', name: 'LED Premium (4200 lm)', tecnologia: 'LED', lumens: 4200, power: 35 },
    { id: 'L2', name: 'LED Alta Eficiencia (5500 lm)', tecnologia: 'LED', lumens: 5500, power: 45 },
    // Modelos Fluorescentes
    { id: 'F1', name: 'Fluorescente Estándar (3500 lm)', tecnologia: 'fluorescente', lumens: 3500, power: 50 },
    { id: 'F2', name: 'Fluorescente T5 Alta (4800 lm)', tecnologia: 'fluorescente', lumens: 4800, power: 60 },
];


// -------------------- Tipos de Datos --------------------
type Ambiente = 'aula' | 'oficina' | 'sala_reuniones';
type Tecnologia = 'LED' | 'fluorescente';
type Incertidumbre = 5 | 10; 

interface DataRow {
    tipo_ambiente: Ambiente;
    superficie_m2: number;
    tecnologia: Tecnologia;
    lumenes_requeridos_lm: number;
}

interface ProjectionDataPoint {
    superficie: number;
    prediccion: number;
    banda_inferior: number;
    banda_superior: number;
}

// -------------------- FUNCIÓN DE MODELADO LS FIJO --------------------
function predecirLumenesLS(
    superficie: number,
    ambiente: Ambiente,
    tecnologia: Tecnologia
): number {
    const coef = COEFICIENTES_LS;
    let prediccion = coef.INTERCEPTO + coef.SUPERFICIE_M2 * superficie;

    if (ambiente === 'oficina') {
        prediccion += coef.OFICINA;
    } else if (ambiente === 'sala_reuniones') {
        prediccion += coef.SALA_REUNIONES;
    }

    if (tecnologia === 'fluorescente') {
        prediccion += coef.FLUORESCENTE;
    }

    return prediccion;
}

// -------------------- COMPONENTE PRINCIPAL DEL SIMULADOR --------------------
export function SimulatorForm() {
    const [superficie, setSuperficie] = useState<number>(35.0);
    const [ambiente, setAmbiente] = useState<Ambiente>("aula");
    const [tecnologia, setTecnologia] = useState<Tecnologia>("LED");
    const [banda, setBanda] = useState<Incertidumbre>(5); 
    const chartRef = useRef<HTMLDivElement | null>(null);

    const [chartSize, setChartSize] = useState({ width: 850, height: 450 }); 
    const [targetLux, setTargetLux] = useState<number>(LUX_PRESETS.aula); 

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        setTargetLux(LUX_PRESETS[ambiente]);
    }, [ambiente]);


    // Predicción y Cálculo de Bandas de Incertidumbre
    const { prediction, bandLow, bandHigh, units, power, luxAchieved, luminaire } = useMemo(() => {
        const safeSuperficie = Math.max(1, superficie);
        const safeTargetLux = Math.max(1, targetLux); 
        
        const yhat = predecirLumenesLS(safeSuperficie, ambiente, tecnologia);
        const factor = banda / 100;
        const bandSuperior = yhat * (1 + factor);
        const bandInferior = yhat * (1 - factor);

        // Los lúmenes reales nunca pueden ser negativos
        const lum = Math.max(0, Math.round(yhat));
        
        // ⬅️ LÓGICA DE SELECCIÓN DE LUMINARIA
        const selectedLuminaire = LUMINAIRE_OPTIONS.find(
            opt => opt.tecnologia.toLowerCase() === tecnologia.toLowerCase()
        ) || LUMINAIRE_OPTIONS[0]; // Fallback
        
        const lumPerUnit = selectedLuminaire.lumens;
        const wPerUnit = selectedLuminaire.power;
        
        // Se asegura al menos 1 unidad para evitar división por cero o resultados extraños
        const numUnits = Math.max(1, Math.round(lum / lumPerUnit)); 
        const totalPower = numUnits * wPerUnit;
        
        const lumenPerSqM = lum / safeSuperficie; 
        // Factor de mantenimiento/pérdidas (se usa 0.8 como Coeficiente de Utilización/Mantenimiento simple)
        const achievedLux = lumenPerSqM * 0.8; 

        return {
            prediction: lum,
            bandLow: Math.max(0, Math.round(bandInferior)),
            bandHigh: Math.round(bandSuperior),
            units: numUnits,
            power: totalPower,
            luxAchieved: Math.round(achievedLux),
            luminaire: selectedLuminaire, // Retornamos la luminaria seleccionada
        };
    }, [superficie, ambiente, tecnologia, banda, targetLux]);

    // Exportar gráfico PNG
    function exportPNG() {
        if (!chartRef.current) return;
        toPng(chartRef.current, { cacheBust: true })
            .then((dataUrl) => saveAs(dataUrl, "simulador_ls_proyeccion.png"))
            .catch((err) => console.error("Error al exportar PNG:", err));
    }

    // Generar data para la línea de Proyección y el Área de Incertidumbre
    const projectionData: ProjectionDataPoint[] = useMemo(() => { 
        const maxSuperficie = 100; 
        const data = Array.from({ length: 80 }, (_, i) => {
            const x = (maxSuperficie * i) / 79;
            const y = predecirLumenesLS(x, ambiente, tecnologia);
            
            if (!isFinite(y)) return null; 

            const factor = banda / 100;
            
            // ⬅️ FIX (Clamping the data): Asegura que el gráfico no dibuje debajo de 0
            return {
                superficie: x, // Eje X
                prediccion: Math.max(0, y), 
                banda_inferior: Math.max(0, y * (1 - factor)),
                banda_superior: Math.max(0, y * (1 + factor)) 
            };
        }).filter(d => d !== null) as ProjectionDataPoint[];
        
        return data;
    }, [ambiente, tecnologia, banda]);

    // Función para formatear el eje Y (solo número en K o exacto)
    const formatLumenValue = (value: number): string => { 
        // Ignoramos valores negativos
        if (value < 0) return ''; 
        if (value === 0) return '0lm'; 
        
        const absValue = Math.abs(value);

        if (absValue >= 1000) {
            // Asegura que K no tenga decimales y agrega 'Klm'
            const kValue = Math.round(absValue / 1000); 
            return `${kValue}Klm`; 
        }
        return `${Math.round(absValue)}lm`;
    };


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-indigo-700">
                Simulador Lumínico — Modelo de Mínimos Cuadrados (LS)
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* 1. CONTROLES Y RECOMENDACIONES (Inputs) */}
                <div className="p-4 border rounded space-y-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">
                        Parámetros de Simulación
                    </h2>
                    
                    {/* Superficie */}
                    <div>
                        <label className="text-sm font-medium">Superficie (m²)</label>
                        <input 
                            type="number" 
                            value={superficie} 
                            onChange={(e) => setSuperficie(Math.max(1, Number(e.target.value)))} 
                            className="w-full border p-2 rounded mt-1 focus:ring-indigo-500 focus:border-indigo-500" 
                            min="1"
                        />
                    </div>

                    {/* Tipo de ambiente */}
                    <div>
                        <label className="text-sm font-medium">Tipo de ambiente</label>
                        <select 
                            value={ambiente} 
                            onChange={(e) => setAmbiente(e.target.value as Ambiente)} 
                            className="w-full border p-2 rounded mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="aula">Aula (Sugiere {LUX_PRESETS.aula} lx)</option>
                            <option value="oficina">Oficina (Sugiere {LUX_PRESETS.oficina} lx)</option>
                            <option value="sala_reuniones">Sala de reuniones (Sugiere {LUX_PRESETS.sala_reuniones} lx)</option>
                        </select>
                    </div>

                    {/* Tecnología */}
                    <div>
                        <label className="text-sm font-medium">Tecnología</label>
                        <select 
                            value={tecnologia} 
                            onChange={(e) => setTecnologia(e.target.value as Tecnologia)} 
                            className="w-full border p-2 rounded mt-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            {/* Opciones filtradas de la lista de luminarias */}
                            {[...new Set(LUMINAIRE_OPTIONS.map(o => o.tecnologia))].map(tec => (
                                <option key={tec} value={tec}>{tec.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Lux Objetivo Configurable */}
                    <div className="pt-2 border-t mt-4">
                        <label className="text-sm font-medium block">Lux Objetivo ({ambiente})</label>
                        <input 
                            type="number" 
                            value={targetLux} 
                            onChange={(e) => setTargetLux(Math.max(1, Number(e.target.value)))} 
                            className="w-full border p-2 rounded mt-1 focus:ring-green-500 focus:border-green-500" 
                            min="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Valor estándar: {LUX_PRESETS[ambiente]} lx</p>
                    </div>

                    {/* Banda de Incertidumbre */}
                    <div className="pt-2 border-t mt-4">
                        <label className="text-sm font-medium block">Banda de Incertidumbre</label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="banda" value={5} checked={banda === 5} onChange={() => setBanda(5)} className="text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm">±5%</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="banda" value={10} checked={banda === 10} onChange={() => setBanda(10)} className="text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm">±10%</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. RESULTADOS Y RECOMENDACIONES (Output) */}
                <div className="md:col-span-2 p-4 border rounded space-y-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">
                        Resultados de la Simulación LS
                    </h2>

                    {/* Fila de resultados principales */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <div className="text-xs text-indigo-700 font-semibold">Lúmenes Requeridos (LS)</div>
                            <div className="text-2xl font-bold text-indigo-900">{prediction.toLocaleString()} <span className="text-base">lm</span></div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="text-xs text-yellow-700 font-semibold">Intervalo de Incertidumbre ({banda}%)</div>
                            <div className="text-xl font-bold text-yellow-900">{bandLow.toLocaleString()} — {bandHigh.toLocaleString()} <span className="text-sm">lm</span></div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-xs text-green-700 font-semibold">Lux Objetivo (vs {targetLux} lx)</div>
                            <div className="text-2xl font-bold text-green-900">{luxAchieved} <span className="text-base">lx</span></div>
                            <div className={`text-xs mt-1 ${luxAchieved >= targetLux ? 'text-green-600' : 'text-red-600'}`}>
                                {luxAchieved >= targetLux ? 'Cumple Objetivo' : 'No Cumple Objetivo'}
                            </div>
                        </div>
                    </div>
                    
                    {/* Recomendaciones de Dimensionamiento (Objetivo 3) */}
                    <div className="border p-3 rounded-lg bg-gray-50 mt-4">
                        <h3 className="font-semibold text-sm mb-2 text-gray-700">
                            Dimensionamiento de Luminarias: 
                            <strong className="text-red-600 ml-1">{luminaire.name}</strong> 
                        </h3>
                        <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium text-gray-600">Lúmenes de la Luminaria:</div>
                            <div className="font-bold text-right text-lg text-gray-900">{luminaire.lumens.toLocaleString()} lm</div>
                            
                            <div className="font-medium text-gray-600">Nº Luminarias Requeridas:</div>
                            <div className="font-bold text-right text-lg text-red-600">{units}</div>
                            
                            <div className="font-medium text-gray-600">Potencia por Unidad:</div>
                            <div className="font-bold text-right text-lg text-gray-900">{luminaire.power} W</div>
                            
                            <div className="font-medium text-gray-600">Potencia Instalada Total:</div>
                            <div className="font-bold text-right text-lg text-red-600">{power.toLocaleString()} W</div>
                        </div>
                    </div>
                    
                    <button onClick={exportPNG} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                        Exportar Gráfico PNG
                    </button>
                </div>
            </div>

            {/* 3. GRÁFICO (Didáctico, Ordenado y Ajustable) */}
            <div className="p-4 border rounded bg-white shadow-md mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Proyección de Lúmenes: Línea LS con Banda de +/-{banda}%
                </h3>
                <div ref={chartRef} style={{ minHeight: '450px' }}>
                    <ResizableBox 
                        width={chartSize.width} 
                        height={chartSize.height} 
                        minConstraints={[400, 250]} 
                        maxConstraints={[1400, 900]} 
                        resizeHandles={["se", "s", "e"]}
                        onResize={(_: any, data: ResizeCallbackData) => { 
                            setChartSize({ width: data.size.width, height: data.size.height });
                        }}
                    >
                        <div style={{ width: chartSize.width, height: chartSize.height }}> 
                            {isMounted ? ( 
                                <AreaChart
                                    key={`${chartSize.width}-${chartSize.height}`} 
                                    width={chartSize.width} 
                                    height={chartSize.height} 
                                    data={projectionData} 
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                    
                                    <XAxis 
                                        type="number" 
                                        dataKey="superficie" 
                                        name="Superficie (m²)" 
                                        unit="m²" 
                                        domain={[0, 'auto']} 
                                        stroke="#333"
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="prediccion" 
                                        name="Lúmenes Requeridos (lm)" 
                                        unit="" 
                                        domain={[0, 'auto']} 
                                        stroke="#333"
                                        tickFormatter={formatLumenValue}
                                    />
                                    
                                    <Tooltip 
                                        cursor={{ strokeDasharray: "3 3" }} 
                                        labelFormatter={(value: number) => `Superficie: ${Math.round(value)} m²`}
                                        formatter={(value: number, name: string) => {
                                            const formattedValue = `${Math.round(value).toLocaleString()} lm`;
                                            if (name === 'prediccion') return [formattedValue, 'Proyección LS'];
                                            if (name === 'banda_superior') return [formattedValue, `Límite Superior (+${banda}%)`];
                                            if (name === 'banda_inferior') return [formattedValue, `Límite Inferior (-${banda}%)`];
                                            return [formattedValue, name];
                                        }}
                                    />
                                    <Legend align="right" verticalAlign="top" height={36}/>
                                    
                                    {/* AREA: Banda Superior */}
                                    <Area
                                        type="monotone"
                                        dataKey="banda_superior" 
                                        stroke="none"
                                        fill="#93c5fd" 
                                        fillOpacity={0.4}
                                        name={`Banda +/-${banda}%`}
                                        isAnimationActive={false}
                                        stackId="1"
                                    />
                                    {/* AREA BLANCA: Cubre el área inferior */}
                                    <Area
                                        type="monotone"
                                        dataKey="banda_inferior" 
                                        stroke="none"
                                        fill="#fff" 
                                        fillOpacity={1}
                                        name="" 
                                        isAnimationActive={false}
                                        stackId="1"
                                    />

                                    {/* LÍNEA: Predicción LS */}
                                    <Line
                                        type="monotone"
                                        dataKey="prediccion"
                                        stroke="#1d4ed8" 
                                        strokeWidth={3}
                                        dot={false}
                                        name="Proyección LS"
                                        isAnimationActive={false}
                                    />
                                    
                                </AreaChart>
                            ) : (
                                <div className="p-8 text-center text-gray-500">Cargando gráfico...</div>
                            )}
                        </div>
                    </ResizableBox>
                </div>
            </div>
            
            {/* Notas Metodológicas */}
            <div className="text-sm text-gray-500 mt-6">
                <strong>Notas Metodológicas (Conforme a la Consigna):</strong>
                <ul>
                    <li>• El modelo utilizado es una <strong>Regresión Lineal Simple (Mínimos Cuadrados)</strong> ajustada a las variables: Superficie, Tipo de Ambiente y Tecnología.</li>
                    <li>• La banda de incertidumbre es una <strong>banda básica fija</strong> (+/- 5% o +/- 10%), calculada directamente sobre la predicción (Objetivo 4).</li>
                    <li>• El cálculo de Número de Luminarias y Potencia Instalada es una <strong>recomendación</strong> basada en luminarias nominales, seleccionadas de una <strong>lista precargada</strong> según la tecnología ({luminaire.name} en este caso) (Objetivo 3).</li>
                </ul>
            </div>
        </div>
    );
}