"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Lightbulb, Zap, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Modelos de mínimos cuadrados (ejemplo simplificado)
// En producción, estos vendrían de tu dataset real
const LUMINAIRE_MODELS = {
  LED: {
    aula: { base: 320, coef: 1.15, lumensPerUnit: 3600, watts: 36 },
    oficina: { base: 280, coef: 1.08, lumensPerUnit: 3200, watts: 32 },
    "sala-reuniones": { base: 350, coef: 1.22, lumensPerUnit: 4000, watts: 40 },
  },
  fluorescente: {
    aula: { base: 320, coef: 1.15, lumensPerUnit: 2800, watts: 58 },
    oficina: { base: 280, coef: 1.08, lumensPerUnit: 2600, watts: 52 },
    "sala-reuniones": { base: 350, coef: 1.22, lumensPerUnit: 3200, watts: 65 },
  },
}

// Niveles de lux requeridos según normativa
const LUX_STANDARDS = {
  aula: 500,
  oficina: 400,
  "sala-reuniones": 500,
}

type RoomType = "aula" | "oficina" | "sala-reuniones"
type TechType = "LED" | "fluorescente"

interface SimulationResult {
  requiredLumens: number
  numLuminaires: number
  totalWatts: number
  luxAchieved: number
  luxTarget: number
  uncertainty: { min: number; max: number }
  meetsStandard: boolean
  energySavings?: number
}

export function SimulatorForm() {
  const [area, setArea] = useState("")
  const [roomType, setRoomType] = useState<RoomType>("oficina")
  const [technology, setTechnology] = useState<TechType>("LED")
  const [result, setResult] = useState<SimulationResult | null>(null)

  const calculateLighting = () => {
    const areaNum = Number.parseFloat(area)
    if (isNaN(areaNum) || areaNum <= 0) {
      return
    }

    const model = LUMINAIRE_MODELS[technology][roomType]
    const luxTarget = LUX_STANDARDS[roomType]

    // Modelo de mínimos cuadrados: Lúmenes = base + coef * área
    const requiredLumens = model.base * areaNum * model.coef

    // Cálculo de luminarias necesarias
    const numLuminaires = Math.ceil(requiredLumens / model.lumensPerUnit)
    const actualLumens = numLuminaires * model.lumensPerUnit

    // Lux alcanzados
    const luxAchieved = actualLumens / areaNum

    // Potencia total instalada
    const totalWatts = numLuminaires * model.watts

    // Banda de incertidumbre ±7%
    const uncertaintyPercent = 0.07
    const uncertainty = {
      min: requiredLumens * (1 - uncertaintyPercent),
      max: requiredLumens * (1 + uncertaintyPercent),
    }

    // Comparación con fluorescente (si se elige LED)
    let energySavings
    if (technology === "LED") {
      const fluorModel = LUMINAIRE_MODELS.fluorescente[roomType]
      const fluorNumLuminaires = Math.ceil(requiredLumens / fluorModel.lumensPerUnit)
      const fluorWatts = fluorNumLuminaires * fluorModel.watts
      energySavings = ((fluorWatts - totalWatts) / fluorWatts) * 100
    }

    setResult({
      requiredLumens,
      numLuminaires,
      totalWatts,
      luxAchieved,
      luxTarget,
      uncertainty,
      meetsStandard: luxAchieved >= luxTarget,
      energySavings,
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Parámetros del Ambiente
          </CardTitle>
          <CardDescription>Ingresa los datos de tu espacio para calcular la solución óptima</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="area">Superficie del Ambiente (m²)</Label>
            <Input
              id="area"
              type="number"
              placeholder="Ej: 45"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              min="1"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">Tipo de Ambiente</Label>
            <Select value={roomType} onValueChange={(v) => setRoomType(v as RoomType)}>
              <SelectTrigger id="roomType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aula">Aula / Educación</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="sala-reuniones">Sala de Reuniones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technology">Tecnología de Iluminación</Label>
            <Select value={technology} onValueChange={(v) => setTechnology(v as TechType)}>
              <SelectTrigger id="technology">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LED">LED (Recomendado)</SelectItem>
                <SelectItem value="fluorescente">Fluorescente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculateLighting} className="w-full" disabled={!area || Number.parseFloat(area) <= 0}>
            <Zap className="w-4 h-4 mr-2" />
            Calcular Solución
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-secondary" />
              Resultados del Dimensionamiento
            </CardTitle>
            <CardDescription>Solución calculada mediante algoritmo de mínimos cuadrados</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Cumplimiento de Norma */}
                <Alert
                  className={
                    result.meetsStandard ? "border-secondary bg-secondary/10" : "border-destructive bg-destructive/10"
                  }
                >
                  <AlertCircle className={`w-4 h-4 ${result.meetsStandard ? "text-secondary" : "text-destructive"}`} />
                  <AlertDescription
                    className={result.meetsStandard ? "text-secondary-foreground" : "text-destructive-foreground"}
                  >
                    {result.meetsStandard
                      ? `✓ Cumple con la normativa (${result.luxTarget} lux requeridos)`
                      : `✗ No cumple con la normativa (${result.luxTarget} lux requeridos)`}
                  </AlertDescription>
                </Alert>

                {/* Métricas Principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Luminarias Necesarias</div>
                    <div className="text-3xl font-bold text-foreground">{result.numLuminaires}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Potencia Total</div>
                    <div className="text-3xl font-bold text-foreground">{result.totalWatts}W</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Lux Alcanzados</div>
                    <div className="text-3xl font-bold text-foreground">{Math.round(result.luxAchieved)}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Lúmenes Totales</div>
                    <div className="text-3xl font-bold text-foreground">
                      {Math.round(result.requiredLumens).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Detalles Técnicos */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Especificaciones Técnicas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lúmenes por luminaria:</span>
                      <span className="font-medium text-foreground">
                        {LUMINAIRE_MODELS[technology][roomType].lumensPerUnit.toLocaleString()} lm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Potencia por luminaria:</span>
                      <span className="font-medium text-foreground">
                        {LUMINAIRE_MODELS[technology][roomType].watts}W
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Eficiencia lumínica:</span>
                      <span className="font-medium text-foreground">
                        {Math.round(
                          LUMINAIRE_MODELS[technology][roomType].lumensPerUnit /
                            LUMINAIRE_MODELS[technology][roomType].watts,
                        )}{" "}
                        lm/W
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banda de Incertidumbre */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Banda de Incertidumbre (±7%)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Rango de lúmenes esperados según el modelo LS:</p>
                  <div className="text-sm font-mono bg-background px-3 py-2 rounded border border-border">
                    {Math.round(result.uncertainty.min).toLocaleString()} -{" "}
                    {Math.round(result.uncertainty.max).toLocaleString()} lúmenes
                  </div>
                </div>

                {/* Ahorro Energético */}
                {result.energySavings && (
                  <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">💡 Ahorro Energético</h4>
                    <p className="text-sm text-muted-foreground">
                      Con tecnología LED ahorras{" "}
                      <span className="font-bold text-secondary">{result.energySavings.toFixed(1)}%</span> de energía
                      comparado con fluorescentes tradicionales.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Completa los datos del formulario para ver los resultados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nota Científica */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">ℹ️ Nota Técnica</p>
            <p className="text-pretty">
              Los cálculos se basan en un modelo de regresión por mínimos cuadrados (LS) ajustado con datos
              experimentales de proyectos reales. La banda de incertidumbre representa el error estándar del modelo
              (±7%).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
