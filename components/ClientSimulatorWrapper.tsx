// components/ClientSimulatorWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Importación dinámica: Asegura que SimulatorForm SÓLO se ejecute en el navegador.
// Aquí es donde colocamos ssr: false, dentro de un componente de cliente.
const SimulatorForm = dynamic(
  // Asegúrate de que esta ruta de importación sea correcta en tu proyecto
  () => import("@/components/simulator-form").then((mod) => mod.SimulatorForm),
  { 
    ssr: false, 
    loading: () => (
      <div className="p-8 text-center text-gray-400 border border-dashed rounded-lg bg-gray-50">
        Cargando simulador de gráficos...
      </div>
    ),
  }
);

export function ClientSimulatorWrapper() {
  return <SimulatorForm />;
}