"use client";

import { Dispatch, SetStateAction } from "react";

/**
 * Props para el componente TimeFilter
 * @typedef {Object} TimeFilterProps
 * @property {'hour' | 'day' | 'week' | 'month' | 'year'} timeFrame - El período de tiempo seleccionado
 * @property {Dispatch<SetStateAction<'hour' | 'day' | 'week' | 'month' | 'year'>>} setTimeFrame - Función para actualizar el período de tiempo
 */
type TimeFilterProps = {
  timeFrame: 'hour' | 'day' | 'week' | 'month' | 'year';
  setTimeFrame: Dispatch<SetStateAction<'hour' | 'day' | 'week' | 'month' | 'year'>>;
};

/**
 * Componente para seleccionar el período de tiempo para los datos
 * @param {TimeFilterProps} props - Props del componente
 * @returns {JSX.Element} Componente de filtro de tiempo
 */
export function TimeFilter({ timeFrame, setTimeFrame }: TimeFilterProps) {
  return (
    <div className="join mb-8 flex justify-center">
      <button 
        className={`btn join-item ${timeFrame === 'hour' ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => setTimeFrame('hour')}
      >
        Hora
      </button>
      <button 
        className={`btn join-item ${timeFrame === 'day' ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => setTimeFrame('day')}
      >
        Día
      </button>
      <button 
        className={`btn join-item ${timeFrame === 'week' ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => setTimeFrame('week')}
      >
        Semana
      </button>
      <button 
        className={`btn join-item ${timeFrame === 'month' ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => setTimeFrame('month')}
      >
        Mes
      </button>
      <button 
        className={`btn join-item ${timeFrame === 'year' ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => setTimeFrame('year')}
      >
        Año
      </button>
    </div>
  );
} 