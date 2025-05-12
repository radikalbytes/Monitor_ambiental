import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
  } catch (error) {
    console.error(`Error al obtener datos de ${params.type}:`, error);
    return NextResponse.json(
      { error: 'Error al obtener los datos' },
      { status: 500 }
    );
  }
} 