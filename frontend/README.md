# Monitor Ambiental y Eléctrico

Aplicación web para monitorización de datos ambientales y eléctricos con gráficos interactivos similares a los de Red Eléctrica Española (REE).

## Características

- Visualización de datos en tiempo real:
  - Temperatura
  - Humedad
  - Consumo eléctrico (kW/h)
  - Corriente RMS
  - Calidad del aire
- Gráficos interactivos con zoom
- Visualización por diferentes períodos de tiempo (horas, días, semanas, meses, años)
- Modo oscuro / claro
- Diseño responsive con Tailwind CSS y DaisyUI
- API para recepción de datos por POST

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Chart.js
- Prisma (ORM)
- PostgreSQL

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/usuario/monitor-ambiental.git
cd monitor-ambiental
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basándote en `.env.example` con tus credenciales de base de datos:
```bash
cp .env.example .env
```

4. Configura la base de datos PostgreSQL y actualiza la URL en el archivo `.env`

5. Ejecuta las migraciones de la base de datos:
```bash
npx prisma migrate dev --name init
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

7. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Envío de datos

La aplicación espera recibir datos cada 5 minutos mediante una solicitud POST a `/api/data` con el siguiente formato JSON:

```json
{
  "temperatura": 22.5,
  "humedad": 45.2,
  "consumoKwh": 3.7,
  "corrienteRms": 8.2,
  "calidadAire": 85
}
```

Puedes usar cualquier dispositivo o sistema que pueda enviar solicitudes HTTP para alimentar los datos a la aplicación.

## Despliegue

La aplicación está preparada para ser desplegada en Vercel:

1. Sube el código a un repositorio de GitHub
2. Conecta tu repositorio a Vercel
3. Configura las variables de entorno para la base de datos
4. ¡Listo!

También puedes utilizar otros servicios como Railway, Render o similares para el despliegue.

## Licencia

MIT 