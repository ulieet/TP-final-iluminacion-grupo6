// app/simulador/SimulatorLoader.tsx
"use client";
import React from 'react';
import { SimulatorForm } from './simulator-form';

// Este componente solo se usa para forzar el client rendering.
export default function SimulatorLoader() {
    return <SimulatorForm />;
}