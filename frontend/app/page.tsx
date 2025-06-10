"use client";

import { useState } from "react";
import { ChartContainer } from "@/components/chart-container";
import { TimeFilter } from "@/components/time-filter";

/**
 * Página principal de la aplicación
 * @returns {JSX.Element} Componente de página principal
 */
export default function Home() {
  // Estado para el filtro de tiempo seleccionado
  const [timeFrame, setTimeFrame] = useState<'hour' | 'day' | 'week' | 'month' | 'year'>('day');

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Monitorización</h1>
        
        {/* Filtro de tiempo */}
        <TimeFilter timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de temperatura */}
          <ChartContainer 
            title="Temperatura" 
            unit="°C" 
            timeFrame={timeFrame} 
            dataType="temperatura"
            color="rgba(255, 99, 132, 0.8)"
          />
          
          {/* Gráfico de humedad */}
          <ChartContainer 
            title="Humedad" 
            unit="%" 
            timeFrame={timeFrame} 
            dataType="humedad"
            color="rgba(54, 162, 235, 0.8)"
          />

          {/* Gráfico de consumo eléctrico */}
          <ChartContainer 
            title="Consumo Eléctrico" 
            unit="kW/h" 
            timeFrame={timeFrame} 
            dataType="consumoKwh"
            color="rgba(255, 159, 64, 0.8)"
          />

          {/* Gráfico de corriente RMS */}
          <ChartContainer 
            title="Corriente RMS" 
            unit="A" 
            timeFrame={timeFrame} 
            dataType="corrienteRms"
            color="rgba(153, 102, 255, 0.8)"
          />

          {/* Gráfico de calidad del aire */}
          <ChartContainer 
            title="Calidad del Aire" 
            unit="AQI" 
            timeFrame={timeFrame}
            dataType="calidadAire" 
            color="rgba(75, 192, 192, 0.8)"
            className="md:col-span-2"
          />
        </div>
      </div>
    </main>
  );
} 