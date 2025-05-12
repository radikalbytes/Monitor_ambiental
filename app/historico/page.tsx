"use client";

import { useState } from "react";
import { ChartContainer } from "@/components/chart-container";
import { TimeFilter } from "@/components/time-filter";

/**
 * Página de histórico de datos
 * @returns {JSX.Element} Componente de página de histórico
 */
export default function Historico() {
  // Estado para el filtro de tiempo seleccionado
  const [timeFrame, setTimeFrame] = useState<'hour' | 'day' | 'week' | 'month' | 'year'>('week');
  // Estado para el tipo de dato seleccionado
  const [selectedDataType, setSelectedDataType] = useState<string>("temperatura");

  // Opciones de tipos de datos
  const dataTypes = [
    { id: "temperatura", label: "Temperatura", unit: "°C", color: "rgba(255, 99, 132, 0.8)" },
    { id: "humedad", label: "Humedad", unit: "%", color: "rgba(54, 162, 235, 0.8)" },
    { id: "consumoKwh", label: "Consumo Eléctrico", unit: "kW/h", color: "rgba(255, 159, 64, 0.8)" },
    { id: "corrienteRms", label: "Corriente RMS", unit: "A", color: "rgba(153, 102, 255, 0.8)" },
    { id: "calidadAire", label: "Calidad del Aire", unit: "AQI", color: "rgba(75, 192, 192, 0.8)" },
  ];

  // Encontrar el tipo de dato seleccionado
  const selectedData = dataTypes.find(type => type.id === selectedDataType) || dataTypes[0];

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Histórico de Datos</h1>
        
        {/* Selector de tipo de dato */}
        <div className="mb-8">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Seleccionar tipo de dato</span>
            </div>
            <select 
              className="select select-bordered"
              value={selectedDataType}
              onChange={(e) => setSelectedDataType(e.target.value)}
            >
              {dataTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </label>
        </div>
        
        {/* Filtro de tiempo */}
        <TimeFilter timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        
        {/* Gráfico detallado */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">{selectedData.label} - Histórico</h2>
            <div className="h-96">
              <ChartContainer 
                title={selectedData.label}
                unit={selectedData.unit}
                timeFrame={timeFrame}
                dataType={selectedData.id}
                color={selectedData.color}
              />
            </div>
          </div>
        </div>
        
        {/* Estadísticas */}
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Valor Mínimo</div>
            <div className="stat-value">--</div>
            <div className="stat-desc">En el período seleccionado</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Valor Máximo</div>
            <div className="stat-value">--</div>
            <div className="stat-desc">En el período seleccionado</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Promedio</div>
            <div className="stat-value">--</div>
            <div className="stat-desc">En el período seleccionado</div>
          </div>
        </div>
      </div>
    </main>
  );
} 