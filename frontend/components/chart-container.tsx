"use client";

import { useEffect, useState, useRef } from "react";
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

// Umbrales predeterminados
const UMBRALES_DEFAULT = {
  temperatura: 30, // °C
  humedad: 80,     // %
  consumoKwh: 10,  // kW/h
  corrienteRms: 15, // A
  calidadAire: 150  // AQI
};

/**
 * Props para el componente ChartContainer
 * @typedef {Object} ChartContainerProps
 * @property {string} title - Título del gráfico
 * @property {string} unit - Unidad de medida para los datos
 * @property {'hour' | 'day' | 'week' | 'month' | 'year'} timeFrame - Período de tiempo para mostrar
 * @property {string} dataType - Tipo de dato a mostrar (temperatura, humedad, etc.)
 * @property {string} color - Color para la línea del gráfico
 * @property {string} [className] - Clases adicionales CSS
 */
type ChartContainerProps = {
  title: string;
  unit: string;
  timeFrame: 'hour' | 'day' | 'week' | 'month' | 'year';
  dataType: string;
  color: string;
  className?: string;
};

/**
 * Componente para mostrar un gráfico de líneas con datos temporales
 * @param {ChartContainerProps} props - Props del componente
 * @returns {JSX.Element} Componente contenedor de gráfico
 */
export function ChartContainer({ title, unit, timeFrame, dataType, color, className = "" }: ChartContainerProps) {
  const [data, setData] = useState<{x: Date, y: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<any>(null);
  const [zoomPluginLoaded, setZoomPluginLoaded] = useState(false);
  const [umbrales, setUmbrales] = useState<Record<string, number>>(UMBRALES_DEFAULT);

  // Cargar el plugin de zoom solo en el cliente
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
  
  // Cargar umbrales personalizados si existen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const newUmbrales = {...UMBRALES_DEFAULT};
        
        const umbralTemperatura = localStorage.getItem('umbralTemperatura');
        const umbralHumedad = localStorage.getItem('umbralHumedad');
        const umbralConsumo = localStorage.getItem('umbralConsumo');
        const umbralCorriente = localStorage.getItem('umbralCorriente');
        const umbralCalidadAire = localStorage.getItem('umbralCalidadAire');

        if (umbralTemperatura) newUmbrales.temperatura = Number(umbralTemperatura);
        if (umbralHumedad) newUmbrales.humedad = Number(umbralHumedad);
        if (umbralConsumo) newUmbrales.consumoKwh = Number(umbralConsumo);
        if (umbralCorriente) newUmbrales.corrienteRms = Number(umbralCorriente);
        if (umbralCalidadAire) newUmbrales.calidadAire = Number(umbralCalidadAire);
        
        setUmbrales(newUmbrales);
      } catch (error) {
        console.error("Error cargando umbrales personalizados:", error);
      }
    }
  }, []);
  
  // Volver a cargar umbrales si cambia el localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('umbral')) {
        // Recargar umbrales
        try {
          const newUmbrales = {...UMBRALES_DEFAULT};
          
          const umbralTemperatura = localStorage.getItem('umbralTemperatura');
          const umbralHumedad = localStorage.getItem('umbralHumedad');
          const umbralConsumo = localStorage.getItem('umbralConsumo');
          const umbralCorriente = localStorage.getItem('umbralCorriente');
          const umbralCalidadAire = localStorage.getItem('umbralCalidadAire');

          if (umbralTemperatura) newUmbrales.temperatura = Number(umbralTemperatura);
          if (umbralHumedad) newUmbrales.humedad = Number(umbralHumedad);
          if (umbralConsumo) newUmbrales.consumoKwh = Number(umbralConsumo);
          if (umbralCorriente) newUmbrales.corrienteRms = Number(umbralCorriente);
          if (umbralCalidadAire) newUmbrales.calidadAire = Number(umbralCalidadAire);
          
          setUmbrales(newUmbrales);
        } catch (error) {
          console.error("Error actualizando umbrales:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  useEffect(() => {
    // Simular carga de datos desde la API
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // En una implementación real, aquí haríamos un fetch a la API
        // const response = await fetch(`/api/data/${dataType}?timeFrame=${timeFrame}`);
        // const result = await response.json();
        
        // Por ahora, generamos datos de muestra
        const sampleData = generateSampleData(timeFrame, dataType);
        setData(sampleData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, dataType]);

  /**
   * Genera datos de muestra para el gráfico
   * @param {string} timeFrame - Período de tiempo
   * @param {string} dataType - Tipo de dato
   * @returns {Array<{x: Date, y: number}>} Datos generados
   */
  const generateSampleData = (timeFrame: string, dataType: string) => {
    const now = new Date();
    const result: {x: Date, y: number}[] = [];
    let points = 0;
    let interval = 0;
    let baseValue = 0;
    
    // Configurar los parámetros según el tipo de dato
    switch (dataType) {
      case 'temperatura':
        baseValue = 22;
        break;
      case 'humedad':
        baseValue = 60;
        break;
      case 'consumoKwh':
        baseValue = 5;
        break;
      case 'corrienteRms':
        baseValue = 10;
        break;
      case 'calidadAire':
        baseValue = 80;
        break;
      default:
        baseValue = 50;
    }
    
    // Configurar los puntos e intervalos según el período de tiempo
    switch (timeFrame) {
      case 'hour':
        points = 60;
        interval = 60 * 1000; // 1 minuto
        break;
      case 'day':
        points = 24;
        interval = 60 * 60 * 1000; // 1 hora
        break;
      case 'week':
        points = 7;
        interval = 24 * 60 * 60 * 1000; // 1 día
        break;
      case 'month':
        points = 30;
        interval = 24 * 60 * 60 * 1000; // 1 día
        break;
      case 'year':
        points = 12;
        interval = 30 * 24 * 60 * 60 * 1000; // 30 días aprox.
        break;
      default:
        points = 24;
        interval = 60 * 60 * 1000;
    }
    
    // Generar puntos de datos
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      
      // Añadir algo de variación aleatoria
      const variation = Math.random() * 20 - 10; // Entre -10 y 10
      let value = baseValue + variation;
      
      // Incorporar algunos valores que superen el umbral para visualización
      const umbralActual = umbrales[dataType as keyof typeof umbrales] || UMBRALES_DEFAULT[dataType as keyof typeof UMBRALES_DEFAULT];
      if (i > points * 0.7 && i < points * 0.8) {
        value = umbralActual * 1.2; // 20% por encima del umbral
      }
      
      // Asegurar que los valores estén en rangos razonables
      if (dataType === 'humedad') {
        value = Math.min(100, Math.max(0, value));
      } else if (dataType === 'calidadAire') {
        value = Math.min(500, Math.max(0, value));
      } else if (dataType === 'temperatura') {
        value = Math.min(50, Math.max(-10, value));
      }
      
      result.push({ x: time, y: Number(value.toFixed(1)) });
    }
    
    return result;
  };

  // Reset zoom al cambiar de gráfica
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

  // Obtener el umbral correspondiente al tipo de dato actual
  const umbral = umbrales[dataType as keyof typeof umbrales] || UMBRALES_DEFAULT[dataType as keyof typeof UMBRALES_DEFAULT];

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
          unit: timeFrame === 'hour' ? 'minute' : 
                timeFrame === 'day' ? 'hour' : 
                timeFrame === 'week' ? 'day' : 
                timeFrame === 'month' ? 'day' : 'month',
          tooltipFormat: timeFrame === 'hour' ? 'HH:mm' : 
                         timeFrame === 'day' ? 'HH:mm' : 
                         timeFrame === 'week' ? 'dd MMM' : 
                         timeFrame === 'month' ? 'dd MMM' : 'MMM yyyy',
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
  const chartData = {
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
        data: data.map(point => ({ x: point.x, y: umbral })),
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  // Manejador para abrir una nueva ventana con el gráfico
  const handleFullscreen = () => {
    // Usamos una solución con ventana emergente en lugar del modal que no funciona
    const width = Math.min(window.screen.width * 0.8, 1200);
    const height = Math.min(window.screen.height * 0.8, 800);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Almacenar datos temporalmente en sessionStorage para usar en la ventana emergente
    sessionStorage.setItem('chartData', JSON.stringify({
      title,
      unit,
      dataType,
      timeFrame,
      color,
      data: data.map(point => ({ x: point.x.toISOString(), y: point.y }))
    }));
    
    // Abrir nueva ventana con el gráfico
    window.open(
      `/grafico-detalle`,
      'GraficoDetalle', 
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-1">
            <div className="text-xs flex items-center">
              <span className="inline-block w-3 h-1 bg-red-500 mr-1"></span>
              <span>Umbral: {umbral} {unit}</span>
            </div>
            <button 
              onClick={handleFullscreen}
              className="btn btn-xs btn-ghost px-1"
              title="Ver en pantalla completa"
            >
              ⤢
            </button>
          </div>
        </div>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <Line 
              ref={chartRef}
              options={options} 
              data={chartData} 
            />
          )}
        </div>
      </div>
    </div>
  );
} 