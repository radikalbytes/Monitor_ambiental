import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Genera datos de muestra para el tipo y período especificados
 * @param {string} type - Tipo de dato (temperatura, humedad, etc.)
 * @param {string} timeFrame - Período de tiempo (hour, day, week, month, year)
 * @returns {Array<{x: Date, y: number}>} Datos generados
 */
function generateSampleData(type: string, timeFrame: string) {
  const now = new Date();
  const result: {x: Date, y: number}[] = [];
  let points = 0;
  let interval = 0;
  let baseValue = 0;
  
  // Configurar los parámetros según el tipo de dato
  switch (type) {
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
    if (i > points * 0.7 && i < points * 0.8) {
      // Umbral estimado según el tipo de dato
      let umbral = 0;
      switch (type) {
        case 'temperatura': umbral = 30; break;
        case 'humedad': umbral = 80; break;
        case 'consumoKwh': umbral = 10; break;
        case 'corrienteRms': umbral = 15; break;
        case 'calidadAire': umbral = 150; break;
        default: umbral = 100;
      }
      value = umbral * 1.2; // 20% por encima del umbral
    }
    
    // Asegurar que los valores estén en rangos razonables
    if (type === 'humedad') {
      value = Math.min(100, Math.max(0, value));
    } else if (type === 'calidadAire') {
      value = Math.min(500, Math.max(0, value));
    } else if (type === 'temperatura') {
      value = Math.min(50, Math.max(-10, value));
    }
    
    result.push({ x: time, y: Number(value.toFixed(1)) });
  }
  
  return result;
}

/**
 * Endpoint para obtener datos históricos por tipo y período de tiempo
 * @param {Request} request - Solicitud HTTP
 * @param {Object} params - Parámetros de la ruta
 * @param {string} params.type - Tipo de dato (temperatura, humedad, etc.)
 * @returns {Promise<NextResponse>} Respuesta HTTP con los datos solicitados
 */
export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame') || 'day';
    
    // Validar que el tipo sea válido
    const validTypes = ['temperatura', 'humedad', 'consumoKwh', 'corrienteRms', 'calidadAire'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Tipo de dato inválido: ${type}` },
        { status: 400 }
      );
    }

    // En entorno de producción sin acceso a base de datos, generar datos de muestra
    if (process.env.NODE_ENV === 'production' || process.env.USE_SAMPLE_DATA === 'true') {
      const sampleData = generateSampleData(type, timeFrame);
      return NextResponse.json(sampleData);
    }
    
    // Calcular la fecha de inicio según el período de tiempo
    const now = new Date();
    let startDate: Date;
    
    switch (timeFrame) {
      case 'hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 hora atrás
        break;
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 día atrás
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 semana atrás
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 mes atrás
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 año atrás
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Por defecto 1 día
    }
    
    try {
      // Consultar los datos en la base de datos
      const data = await prisma.medicion.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
        select: {
          timestamp: true,
          [type]: true,
        }
      });
      
      // Transformar los datos al formato esperado por el gráfico
      const formattedData = data.map(item => ({
        x: item.timestamp,
        y: item[type as keyof typeof item],
      }));
      
      return NextResponse.json(formattedData);
    } catch (dbError) {
      console.error(`Error de base de datos: ${dbError}`);
      // Si hay error de DB, devolver datos de muestra
      const sampleData = generateSampleData(type, timeFrame);
      return NextResponse.json(sampleData);
    }
  } catch (error) {
    console.error(`Error al obtener datos de ${params.type}:`, error);
    return NextResponse.json(
      { error: 'Error al obtener los datos' },
      { status: 500 }
    );
  }
} 