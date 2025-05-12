"use client";

import { useState, useEffect, useRef } from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Registrar los componentes básicos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

/**
 * Página para mostrar un gráfico a pantalla completa en una ventana emergente
 * @returns {JSX.Element} Página con el gráfico a pantalla completa
 */
export default function GraficoDetalle() {
  const [chartData, setChartData] = useState<any>(null);
  const [zoomPluginLoaded, setZoomPluginLoaded] = useState(false);
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cargar el plugin de zoom
  useEffect(() => {
    // Solo ejecutar en el navegador
    if (typeof window !== 'undefined') {
      const loadZoomPlugin = async () => {
        try {
          const zoomPlugin = await import('chartjs-plugin-zoom');
          ChartJS.register(zoomPlugin.default);
          setZoomPluginLoaded(true);
        } catch (error) {
          console.error("Error cargando el plugin de zoom:", error);
        }
      };
      
      loadZoomPlugin();
    }
  }, []);
  
  // Cargar los datos del gráfico desde sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = sessionStorage.getItem('chartData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Convertir las cadenas ISO a objetos Date
          parsedData.data = parsedData.data.map((point: any) => ({
            x: new Date(point.x),
            y: point.y
          }));
          setChartData(parsedData);
          
          // Establecer el título de la ventana
          document.title = `${parsedData.title} - Detalle`;
        }
      } catch (error) {
        console.error("Error cargando datos del gráfico:", error);
      }
    }
  }, []);

  // Ajustar el tamaño del contenedor cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Ejecutar una vez al cargar para asegurar el tamaño inicial correcto
    setTimeout(handleResize, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData]);

  // Reset zoom
  const resetZoom = () => {
    if (chartRef.current && zoomPluginLoaded) {
      try {
        // @ts-ignore - El método resetZoom existe pero TypeScript no lo reconoce
        chartRef.current.resetZoom();
      } catch (err) {
        console.error('Error al resetear zoom:', err);
      }
    }
  };

  // Si no hay datos, mostrar un mensaje de carga
  if (!chartData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const { title, unit, data, color, dataType } = chartData;

  // Obtener el umbral correspondiente al tipo de dato actual
  // Intentamos leer primero de localStorage por si se han configurado umbrales personalizados
  const UMBRALES: Record<string, number> = {
    temperatura: 30, // °C
    humedad: 80,     // %
    consumoKwh: 10,  // kW/h
    corrienteRms: 15, // A
    calidadAire: 150  // AQI
  };
  
  // Intentar leer umbrales personalizados
  if (typeof window !== 'undefined') {
    try {
      const umbralTemperatura = localStorage.getItem('umbralTemperatura');
      const umbralHumedad = localStorage.getItem('umbralHumedad');
      const umbralConsumo = localStorage.getItem('umbralConsumo');
      const umbralCorriente = localStorage.getItem('umbralCorriente');
      const umbralCalidadAire = localStorage.getItem('umbralCalidadAire');

      if (umbralTemperatura) UMBRALES.temperatura = Number(umbralTemperatura);
      if (umbralHumedad) UMBRALES.humedad = Number(umbralHumedad);
      if (umbralConsumo) UMBRALES.consumoKwh = Number(umbralConsumo);
      if (umbralCorriente) UMBRALES.corrienteRms = Number(umbralCorriente);
      if (umbralCalidadAire) UMBRALES.calidadAire = Number(umbralCalidadAire);
    } catch (error) {
      console.error("Error leyendo umbrales:", error);
    }
  }
  
  const umbral = UMBRALES[dataType] || 0;

  // Opciones para el gráfico
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${title} (${unit})`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          // Mostrar si supera el umbral en el tooltip
          afterLabel: (context) => {
            const value = context.parsed.y;
            if (value > umbral) {
              return `¡Supera el umbral de ${umbral}!`;
            }
            return '';
          }
        }
      },
      // Solo incluir zoom si está cargado el plugin
      ...(zoomPluginLoaded && {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'xy',
          },
          pan: {
            enabled: true,
            mode: 'xy',
          },
        }
      })
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: chartData.timeFrame === 'hour' ? 'minute' : 
                chartData.timeFrame === 'day' ? 'hour' : 
                chartData.timeFrame === 'week' ? 'day' : 
                chartData.timeFrame === 'month' ? 'day' : 'month',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'dd MMM',
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Tiempo'
        },
      },
      y: {
        title: {
          display: true,
          text: unit
        },
      }
    },
  };

  // Datos para el gráfico
  const chartDataConfig = {
    datasets: [
      {
        label: title,
        data: data,
        borderColor: color,
        backgroundColor: color.replace('0.8', '0.1'),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.4,
      },
      // Línea de umbral
      {
        label: `Umbral de ${title}`,
        data: data.map((point: any) => ({ x: point.x, y: umbral })),
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b bg-base-100">
        <h2 className="text-xl font-bold">{title} ({unit})</h2>
        <div className="flex gap-2">
          <button 
            onClick={resetZoom} 
            className="btn btn-sm"
            title="Restablecer zoom"
          >
            Reset Zoom
          </button>
          <button 
            onClick={() => window.close()} 
            className="btn btn-sm btn-ghost px-2"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="flex-grow bg-base-100"
        style={{ height: 'calc(100vh - 6rem)', width: '100%' }}
      >
        <Line 
          ref={chartRef}
          options={options} 
          data={chartDataConfig}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="p-2 border-t text-center text-sm text-gray-500 bg-base-100">
        Use la rueda del ratón o pellizque para hacer zoom, y arrastre para desplazarse
      </div>
    </div>
  );
} 