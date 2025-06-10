import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Endpoint para recibir datos mediante POST
 * @param {Request} request - Solicitud HTTP
 * @returns {Promise<NextResponse>} Respuesta HTTP
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Esquema de validación para los datos recibidos
    const dataSchema = z.object({
      temperatura: z.number(),
      humedad: z.number(),
      consumoKwh: z.number(),
      corrienteRms: z.number(),
      calidadAire: z.number().int(),
    });
    
    // Validar los datos recibidos
    const validationResult = dataSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extraer los datos validados
    const { temperatura, humedad, consumoKwh, corrienteRms, calidadAire } = validationResult.data;
    
    // Guardar en la base de datos
    const medicion = await prisma.medicion.create({
      data: {
        temperatura,
        humedad,
        consumoKwh,
        corrienteRms,
        calidadAire,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Datos recibidos correctamente',
      id: medicion.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error al procesar los datos:', error);
    return NextResponse.json(
      { error: 'Error al procesar los datos' },
      { status: 500 }
    );
  }
} 