const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Función para generar datos aleatorios para los sensores
 * @param {Date} date - Fecha para el registro
 * @returns {Object} Objeto con datos de sensores
 */
function generateRandomData(date) {
  return {
    timestamp: date,
    temperatura: parseFloat((15 + Math.random() * 20).toFixed(1)),
    humedad: parseFloat((40 + Math.random() * 50).toFixed(1)),
    consumoKwh: parseFloat((1 + Math.random() * 10).toFixed(2)),
    corrienteRms: parseFloat((5 + Math.random() * 15).toFixed(2)),
    calidadAire: Math.floor(20 + Math.random() * 400)
  };
}

/**
 * Función principal para poblar la base de datos
 */
async function main() {
  console.log('Inicio de la población de la base de datos...');

  // Eliminar datos existentes para evitar duplicados
  await prisma.medicion.deleteMany({});
  
  // Generar datos para los últimos 7 días con lecturas cada 5 minutos
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás
  const interval = 5 * 60 * 1000; // 5 minutos en milisegundos
  
  const data = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push(generateRandomData(new Date(currentDate)));
    currentDate = new Date(currentDate.getTime() + interval);
  }
  
  console.log(`Insertando ${data.length} registros...`);

  // Insertar todos los registros
  await prisma.medicion.createMany({
    data: data
  });

  console.log('Base de datos poblada correctamente.');
}

// Ejecutar la función y capturar errores
main()
  .catch(e => {
    console.error('Error poblando la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 