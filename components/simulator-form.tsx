/**
 * SimuladorIluminacion.tsx (VERSIÓN FINAL Y ESTABLE)
 * * ✅ CORRECCIÓN DEFINITIVA: Se corrige el bug de tecleado rápido en el campo 'Lux Objetivo'.
 * * La validación mínima de 1 lx se aplica solo al salir del campo (onBlur).
 */
"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react"; 
import {
    LineChart, 
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    Scatter, 
} from "recharts";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";

// -------------------- CONSTANTES: COEFICIENTES LS CORRECTOS --------------------
const COEFICIENTES_LS = {
    INTERCEPTO: -3315.10, 
    SUPERFICIE_M2: 689.57, 
    OFICINA_BASE: -762.36, 
    SALA_REUNIONES_BASE: -1236.68,
    FLUORESCENTE: 8603.72, 
    S_X_OFICINA: 323.22,
    S_X_REUNIONES: -155.33,
};

const LUX_PRESETS: Record<Ambiente, number> = {
    aula: 400,          
    oficina: 500,       
    sala_reuniones: 300, 
};

const LUMINAIRE_OPTIONS = [
    { id: 'L1', name: 'LED Premium (4200 lm)', tecnologia: 'LED', lumens: 4200, power: 35 },
    { id: 'L2', name: 'LED Alta Eficiencia (5500 lm)', tecnologia: 'LED', lumens: 5500, power: 45 },
    { id: 'F1', name: 'Fluorescente Estándar (3500 lm)', tecnologia: 'fluorescente', lumens: 3500, power: 50 },
    { id: 'F2', name: 'Fluorescente T5 Alta (4800 lm)', tecnologia: 'fluorescente', lumens: 4800, power: 60 },
];


// -------------------- Tipos de Datos --------------------
type Ambiente = 'aula' | 'oficina' | 'sala_reuniones';
type Tecnologia = 'LED' | 'fluorescente';
type Incertidumbre = 5 | 10; 

interface ProjectionDataPoint {
    superficie: number;
    prediccion: number; 
}

// -------------------- FUNCIÓN DE MODELADO LS --------------------
function predecirLumenesLS(
    superficie: number,
    ambiente: Ambiente,
    tecnologia: Tecnologia
): number {
    const coef = COEFICIENTES_LS;
    
    let prediccion = coef.INTERCEPTO + coef.SUPERFICIE_M2 * superficie;

    if (ambiente === 'oficina') {
        prediccion += coef.OFICINA_BASE + coef.S_X_OFICINA * superficie;
    } else if (ambiente === 'sala_reuniones') {
        prediccion += coef.SALA_REUNIONES_BASE + coef.S_X_REUNIONES * superficie;
    }

    if (tecnologia === 'fluorescente') {
        prediccion += coef.FLUORESCENTE;
    }

    return prediccion; 
}

// -------------------- COMPONENTE PRINCIPAL DEL SIMULADOR --------------------
export function SimulatorForm() {
    
    const MIN_LUX_TARGET = 1; // Mínimo objetivo de Lux permitido
    const MIN_SUPERFICIE_VISUAL = 5; // Límite para la visualización y la entrada de datos
    const MAX_SUPERFICIE_PLOT = 100;

    // ESTADO NUMÉRICO Y STRING PARA SUPERFICIE
    const [superficie, setSuperficie] = useState<number>(35.0); 
    const [inputSuperficie, setInputSuperficie] = useState<string>('35.0'); 

    // ESTADO NUMÉRICO Y STRING PARA LUX OBJETIVO 🚨 NUEVO ESTADO
    const [targetLux, setTargetLux] = useState<number>(LUX_PRESETS.aula); 
    const [inputTargetLux, setInputTargetLux] = useState<string>(String(LUX_PRESETS.aula)); // NUEVO ESTADO STRING

    const [ambiente, setAmbiente] = useState<Ambiente>("aula");
    const [tecnologia, setTecnologia] = useState<Tecnologia>("LED");
    const [banda, setBanda] = useState<Incertidumbre>(5); 
    
    const chartRef = useRef<HTMLDivElement | null>(null);
    const exportContentRef = useRef<HTMLDivElement | null>(null);

    const [chartSize, setChartSize] = useState({ width: 850, height: 450 }); 
    
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Sincronizar Lux Objetivo cuando cambia el ambiente
    useEffect(() => {
        const newLux = LUX_PRESETS[ambiente];
        setTargetLux(newLux);
        setInputTargetLux(String(newLux));
    }, [ambiente]);


    // Funciones de validación
    const handleSuperficieBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (isNaN(newValue) || newValue < MIN_SUPERFICIE_VISUAL) {
            setSuperficie(MIN_SUPERFICIE_VISUAL);
            setInputSuperficie(String(MIN_SUPERFICIE_VISUAL));
        } else {
            setSuperficie(newValue);
            setInputSuperficie(String(newValue));
        }
    }, [MIN_SUPERFICIE_VISUAL]);

    const handleTargetLuxBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        // 🚨 Validación para Lux Objetivo: Mínimo 1 lx
        if (isNaN(newValue) || newValue < MIN_LUX_TARGET) {
            setTargetLux(MIN_LUX_TARGET);
            setInputTargetLux(String(MIN_LUX_TARGET));
        } else {
            setTargetLux(newValue);
            setInputTargetLux(String(newValue));
        }
    }, [MIN_LUX_TARGET]);


    // 1. Predicción y Cálculo de Bandas de Incertidumbre
    const { prediction, bandLow, bandHigh, units, power, luxAchieved, luminaire } = useMemo(() => {
        
        // Bloqueamos la simulación si la superficie no alcanza el mínimo
        if (superficie < MIN_SUPERFICIE_VISUAL) {
            return {
                prediction: 0, bandLow: 0, bandHigh: 0, units: 0, power: 0, luxAchieved: 0,
                luminaire: LUMINAIRE_OPTIONS.find(opt => opt.tecnologia.toLowerCase() === tecnologia.toLowerCase()) || LUMINAIRE_OPTIONS[0],
            };
        }
        
        const safeSuperficie = superficie;
        const yhat = predecirLumenesLS(safeSuperficie, ambiente, tecnologia);
        const factor = banda / 100;
        
        // PREDICCIÓN: Valor redondeado a entero, MÍNIMO 1 lm. 
        const lum = Math.max(1, Math.round(yhat)); 
        
        const bandSuperior = lum * (1 + factor);
        const bandInferior = lum * (1 - factor);

        const selectedLuminaire = LUMINAIRE_OPTIONS.find(
            opt => opt.tecnologia.toLowerCase() === tecnologia.toLowerCase()
        ) || LUMINAIRE_OPTIONS[0]; 
        
        const lumPerUnit = selectedLuminaire.lumens;
        const wPerUnit = selectedLuminaire.power;
        
        const numUnits = Math.max(1, Math.round(lum / lumPerUnit)); 
        const totalPower = numUnits * wPerUnit;
        
        const lumenPerSqM = numUnits * lumPerUnit / safeSuperficie; 
        const achievedLux = lumenPerSqM * 0.8; 

        return {
            prediction: lum,
            bandLow: Math.max(0, Math.round(bandInferior)),
            bandHigh: Math.round(bandSuperior),
            units: numUnits,
            power: totalPower,
            luxAchieved: Math.round(achievedLux),
            luminaire: selectedLuminaire, 
        };
    }, [superficie, ambiente, tecnologia, banda, targetLux, MIN_SUPERFICIE_VISUAL]);

    
    function exportPNG() {
        if (!exportContentRef.current) return;
        
        toPng(exportContentRef.current, { cacheBust: true, backgroundColor: '#ffffff' }) 
            .then((dataUrl) => saveAs(dataUrl, "simulador_ls_resultados.png"))
            .catch((err) => console.error("Error al exportar PNG:", err));
    }

    // Generar data para la Proyección (RECTA)
    const projectionData: ProjectionDataPoint[] = useMemo(() => { 
        if (superficie < MIN_SUPERFICIE_VISUAL) return [];
        
        // 1. Calcular el punto de cruce real (S_cross)
        const coef = COEFICIENTES_LS;
        let effectiveSlope = coef.SUPERFICIE_M2;
        let effectiveIntercept = coef.INTERCEPTO;
        if (ambiente === 'oficina') {
            effectiveSlope += coef.S_X_OFICINA;
            effectiveIntercept += coef.OFICINA_BASE;
        } else if (ambiente === 'sala_reuniones') {
            effectiveSlope += coef.S_X_REUNIONES;
            effectiveIntercept += coef.SALA_REUNIONES_BASE;
        }
        if (tecnologia === 'fluorescente') {
            effectiveIntercept += coef.FLUORESCENTE;
        }
        const S_cross = -effectiveIntercept / effectiveSlope;
        const startX = Math.max(0, S_cross);
        
        // 2. Generar puntos de la línea de regresión para el gráfico
        const numPoints = 80;
        const data = Array.from({ length: numPoints }, (_, i) => {
            const x = MIN_SUPERFICIE_VISUAL + ((MAX_SUPERFICIE_PLOT - MIN_SUPERFICIE_VISUAL) * i) / (numPoints - 1);
            const y = predecirLumenesLS(x, ambiente, tecnologia);
            
            if (!isFinite(y)) return null; 

            return {
                superficie: x, 
                prediccion: Math.max(1, Math.round(y)), 
            };
        }).filter(d => d !== null) as ProjectionDataPoint[];
        
        
        // 3. Asegurar el punto de inicio lógico (S_cross/0) si es >= 5m2
        if (startX >= MIN_SUPERFICIE_VISUAL) {
            const startPointExists = data.some(d => Math.abs(d.superficie - startX) < 0.1); 
            if (!startPointExists) {
                data.unshift({
                    superficie: startX,
                    prediccion: 1, 
                });
            }
        }
        
        // 4. Asegurar que el punto de simulación actual exista exactamente en la data
        if (superficie >= MIN_SUPERFICIE_VISUAL) {
            const currentDataPointExists = data.some(d => d.superficie === superficie);
            if (!currentDataPointExists) {
                 data.push({ 
                     superficie: superficie, 
                     prediccion: prediction,
                 });
            }
        }

        // 5. Ordenar por superficie
        data.sort((a, b) => a.superficie - b.superficie);

        return data;
    }, [ambiente, tecnologia, superficie, prediction, MIN_SUPERFICIE_VISUAL]); 

    // Data de un solo punto (VALOR ACTUAL)
    const currentPointData = useMemo(() => {
        // El punto no se muestra si la superficie no es válida
        if (superficie < MIN_SUPERFICIE_VISUAL) return [];
        
        return [{ 
            superficie: superficie, 
            prediccion: prediction, 
        }];
    }, [superficie, prediction, MIN_SUPERFICIE_VISUAL]);

    // Función para formatear el eje Y
    const formatLumenValue = (value: number): string => { 
        if (value < 1) return '1lm'; 
        
        const absValue = Math.abs(value);

        if (absValue >= 1000) {
            const kValue = (absValue / 1000).toFixed(1); 
            return `${kValue}Klm`; 
        }
        return `${Math.round(absValue)}lm`;
    };


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-indigo-700">
                Simulador Lumínico — Modelo de Mínimos Cuadrados (LS)
            </h1>

            <div ref={exportContentRef} className="space-y-6">
                
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
                                value={inputSuperficie} 
                                onChange={(e) => { setInputSuperficie(e.target.value); }}
                                onBlur={handleSuperficieBlur}
                                className="w-full border p-2 rounded mt-1 focus:ring-indigo-500 focus:border-indigo-500" 
                                min="5" 
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
                                value={inputTargetLux} // 🚨 Bind al estado STRING
                                onChange={(e) => setInputTargetLux(e.target.value)} // Permite tecleado libre
                                onBlur={handleTargetLuxBlur} // 🚨 Validación en onBlur
                                className="w-full border p-2 rounded mt-1 focus:ring-green-500 focus:border-green-500" 
                                min="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">Valor estándar: {LUX_PRESETS[ambiente]} lx</p>
                        </div>

                        {/* Banda de Incertidumbre */}
                        <div className="pt-2 border-t mt-4">
                            <label className="text-sm font-medium block">Banda de Incertidumbre ($\pm${banda}%)</label>
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
                            <p className="text-xs text-gray-500 mt-1">La banda se muestra numéricamente en los resultados.</p>
                        </div>
                    </div>

                    {/* 2. RESULTADOS Y RECOMENDACIONES (Output) - INCLUIDO EN LA EXPORTACIÓN */}
                    <div className="md:col-span-2 p-4 border rounded space-y-4 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">
                            Resultados de la Simulación LS
                        </h2>
                        
                        {/* MENSAJE DE ADVERTENCIA */}
                        {superficie < MIN_SUPERFICIE_VISUAL && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                🛑 **ADVERTENCIA:** Superficie mínima de simulación es **{MIN_SUPERFICIE_VISUAL} m²**. Ingrese un valor válido y salga del campo para calcular.
                            </div>
                        )}
                        
                        {/* Fila de resultados principales */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="text-xs text-indigo-700 font-semibold">Lúmenes Requeridos (LS)</div>
                                <div className="text-2xl font-bold text-indigo-900">{prediction.toLocaleString()} <span className="text-base">lm</span></div>
                                <p className="text-xs text-gray-500 mt-1">
                                    (Punto azul en la gráfica)
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="text-xs text-yellow-700 font-semibold">Intervalo de Incertidumbre ($\pm${banda}%)</div>
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
                                <strong className="text-indigo-600 ml-1">{luminaire.name}</strong> 
                            </h3>
                            <div className="grid grid-cols-2 text-sm">
                                <div className="font-medium text-gray-600">Lúmenes de la Luminaria:</div>
                                <div className="font-bold text-right text-lg text-gray-900">{luminaire.lumens.toLocaleString()} lm</div>
                                
                                <div className="font-medium text-gray-600">Nº Luminarias Requeridas:</div>
                                <div className="font-bold text-right text-lg text-indigo-600">{units}</div>
                                
                                <div className="font-medium text-gray-600">Potencia por Unidad:</div>
                                <div className="font-bold text-right text-lg text-gray-900">{luminaire.power} W</div>
                                
                                <div className="font-medium text-gray-600">Potencia Instalada Total:</div>
                                <div className="font-bold text-right text-lg text-indigo-600">{power.toLocaleString()} W</div>
                            </div>
                        </div>
                        
                        <button onClick={exportPNG} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                            Exportar PNG con Resultados
                        </button>
                    </div>
                </div>

                {/* 3. GRÁFICO (RECTA LS CON PUNTO ÚNICO) - INCLUIDO EN LA EXPORTACIÓN */}
                <div className="p-4 border rounded bg-white shadow-md mt-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Proyección de Lúmenes: **Mejor Estimación LS**
                        </h3>
                    </div>
                    
                    <div ref={chartRef} style={{ minHeight: '450px', background: '#ffffff' }}> 
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
                            <div style={{ width: '100%', height: '100%' }}> 
                                {isMounted ? ( 
                                    <LineChart
                                        width={chartSize.width} 
                                        height={chartSize.height} 
                                        data={projectionData} 
                                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                        
                                        <XAxis 
                                            type="number" 
                                            dataKey="superficie" 
                                            name="Superficie (m²)" 
                                            unit="m²" 
                                            // El dominio del gráfico es fijo de 5 a 100
                                            domain={[MIN_SUPERFICIE_VISUAL, MAX_SUPERFICIE_PLOT]} 
                                            stroke="#333"
                                        />
                                        <YAxis 
                                            type="number" 
                                            dataKey="prediccion" 
                                            name="Lúmenes Requeridos (lm)" 
                                            unit="" 
                                            domain={['auto', 'auto']} 
                                            stroke="#333"
                                            tickFormatter={formatLumenValue}
                                            yAxisId="1" 
                                        />
                                        
                                        <Tooltip 
                                            cursor={{ strokeDasharray: "3 3" }} 
                                            labelFormatter={(value: number) => `Superficie: ${Math.round(value).toLocaleString()} m²`}
                                            formatter={(value: number, name: string) => {
                                                // Muestra el valor exacto de la tabla para el punto azul
                                                if (name === 'Lúmenes Requeridos') {
                                                    return [`${prediction.toLocaleString()} lm`, 'Lúmenes Requeridos (LS)'];
                                                }
                                                const formattedValue = `${value.toLocaleString()} lm`;
                                                return [formattedValue, 'Predicción LS']; 
                                            }}
                                        />
                                        <Legend align="right" verticalAlign="top" height={36}/>
                                        
                                        {/* RECTA LS */}
                                        <Line
                                            type="monotone"
                                            dataKey="prediccion"
                                            stroke="#1d4ed8" // Mantiene el azul oscuro para la línea
                                            strokeWidth={3}
                                            dot={false} 
                                            name="Predicción LS"
                                            isAnimationActive={false}
                                            yAxisId="1" 
                                        />
                                        
                                        {/* PUNTO ÚNICO (Valor Actual) */}
                                        <Scatter 
                                            data={currentPointData} 
                                            dataKey="superficie" 
                                            yAxisId="1" 
                                            name="Lúmenes Requeridos" 
                                            fill="#3b82f6" // Color Azul
                                            r={8} 
                                        />
                                        
                                    </LineChart>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">Cargando gráfico...</div>
                                )}
                            </div>
                        </ResizableBox>
                    </div>
                </div>

            </div>

        </div>
    );
}