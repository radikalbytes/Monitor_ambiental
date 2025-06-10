"use client";

import { useState, useEffect } from "react";

/**
 * Página de configuración
 * @returns {JSX.Element} Componente de página de configuración
 */
export default function Configuracion() {
  // Estados para los campos del formulario
  const [apiEndpoint, setApiEndpoint] = useState<string>("/api/data");
  const [intervalo, setIntervalo] = useState<number>(5);
  const [notificaciones, setNotificaciones] = useState<boolean>(false);
  const [umbralTemperatura, setUmbralTemperatura] = useState<number>(30);
  const [umbralHumedad, setUmbralHumedad] = useState<number>(80);
  const [umbralConsumo, setUmbralConsumo] = useState<number>(10);
  const [umbralCorriente, setUmbralCorriente] = useState<number>(15);
  const [umbralCalidadAire, setUmbralCalidadAire] = useState<number>(150);
  const [guardadoExitoso, setGuardadoExitoso] = useState<boolean>(false);
  
  // Estados para el borrado de datos
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);
  const [segundaConfirmacion, setSegundaConfirmacion] = useState<boolean>(false);
  const [borrando, setBorrando] = useState<boolean>(false);
  const [borradoExitoso, setBorradoExitoso] = useState<boolean>(false);

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Recuperar valores de localStorage
        const storedApiEndpoint = localStorage.getItem('apiEndpoint');
        const storedIntervalo = localStorage.getItem('intervalo');
        const storedNotificaciones = localStorage.getItem('notificaciones');
        const storedUmbralTemperatura = localStorage.getItem('umbralTemperatura');
        const storedUmbralHumedad = localStorage.getItem('umbralHumedad');
        const storedUmbralConsumo = localStorage.getItem('umbralConsumo');
        const storedUmbralCorriente = localStorage.getItem('umbralCorriente');
        const storedUmbralCalidadAire = localStorage.getItem('umbralCalidadAire');

        // Actualizar estados con valores guardados, si existen
        if (storedApiEndpoint) setApiEndpoint(storedApiEndpoint);
        if (storedIntervalo) setIntervalo(Number(storedIntervalo));
        if (storedNotificaciones) setNotificaciones(storedNotificaciones === 'true');
        if (storedUmbralTemperatura) setUmbralTemperatura(Number(storedUmbralTemperatura));
        if (storedUmbralHumedad) setUmbralHumedad(Number(storedUmbralHumedad));
        if (storedUmbralConsumo) setUmbralConsumo(Number(storedUmbralConsumo));
        if (storedUmbralCorriente) setUmbralCorriente(Number(storedUmbralCorriente));
        if (storedUmbralCalidadAire) setUmbralCalidadAire(Number(storedUmbralCalidadAire));
      } catch (error) {
        console.error("Error cargando configuración:", error);
      }
    }
  }, []);

  // Función para guardar la configuración
  const guardarConfiguracion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('apiEndpoint', apiEndpoint);
        localStorage.setItem('intervalo', intervalo.toString());
        localStorage.setItem('notificaciones', notificaciones.toString());
        localStorage.setItem('umbralTemperatura', umbralTemperatura.toString());
        localStorage.setItem('umbralHumedad', umbralHumedad.toString());
        localStorage.setItem('umbralConsumo', umbralConsumo.toString());
        localStorage.setItem('umbralCorriente', umbralCorriente.toString());
        localStorage.setItem('umbralCalidadAire', umbralCalidadAire.toString());
        
        // Mostrar mensaje de éxito
        setGuardadoExitoso(true);
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setGuardadoExitoso(false);
        }, 3000);
      } catch (error) {
        console.error("Error guardando configuración:", error);
        alert("Error al guardar la configuración");
      }
    }
  };

  // Función para borrar todos los datos
  const borrarDatos = async () => {
    if (!segundaConfirmacion) {
      setSegundaConfirmacion(true);
      return;
    }
    
    try {
      setBorrando(true);
      
      // Aquí realizaríamos la llamada a la API para borrar los datos
      // Por ejemplo:
      // const respuesta = await fetch('/api/borrar-datos', { method: 'DELETE' });
      // if (!respuesta.ok) throw new Error('Error al borrar los datos');
      
      // Simulación de tiempo de espera para la demostración
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      setBorradoExitoso(true);
      
      // Resetear estados
      setTimeout(() => {
        setMostrarConfirmacion(false);
        setSegundaConfirmacion(false);
        setBorrando(false);
        setBorradoExitoso(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error borrando datos:", error);
      alert("Error al borrar los datos");
      setBorrando(false);
    }
  };

  // Cerrar modal de confirmación
  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setSegundaConfirmacion(false);
  };

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Ajustes generales</h2>
            
            {guardadoExitoso && (
              <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Configuración guardada correctamente</span>
              </div>
            )}
            
            <form onSubmit={guardarConfiguracion}>
              {/* API Endpoint */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">API Endpoint</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="URL del endpoint para enviar datos" 
                />
                <label className="label">
                  <span className="label-text-alt">Dirección a la que se enviarán los datos</span>
                </label>
              </div>
              
              {/* Intervalo de muestreo */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Intervalo de muestreo (minutos)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={intervalo}
                  onChange={(e) => setIntervalo(Number(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>
              
              {/* Notificaciones */}
              <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Activar notificaciones</span> 
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={notificaciones}
                    onChange={(e) => setNotificaciones(e.target.checked)}
                  />
                </label>
              </div>
              
              <h3 className="text-xl font-semibold mt-8 mb-4">Umbrales de alerta</h3>
              
              {/* Umbral de temperatura */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Temperatura máxima (°C)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={umbralTemperatura}
                  onChange={(e) => setUmbralTemperatura(Number(e.target.value))}
                />
              </div>
              
              {/* Umbral de humedad */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Humedad máxima (%)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={umbralHumedad}
                  onChange={(e) => setUmbralHumedad(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
              
              {/* Umbral de consumo eléctrico */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Consumo eléctrico máximo (kW/h)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={umbralConsumo}
                  onChange={(e) => setUmbralConsumo(Number(e.target.value))}
                  min="0"
                />
              </div>
              
              {/* Umbral de corriente RMS */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Corriente RMS máxima (A)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={umbralCorriente}
                  onChange={(e) => setUmbralCorriente(Number(e.target.value))}
                  min="0"
                />
              </div>
              
              {/* Umbral de calidad del aire */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Índice máximo de calidad del aire (AQI)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={umbralCalidadAire}
                  onChange={(e) => setUmbralCalidadAire(Number(e.target.value))}
                  min="0"
                  max="500"
                />
              </div>
              
              <div className="card-actions justify-end mt-6">
                <button type="submit" className="btn btn-primary">Guardar configuración</button>
              </div>
            </form>
            
            {/* Sección de administración de datos */}
            <div className="divider my-8">Administración de datos</div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Borrar datos</h3>
              <p className="text-sm text-gray-500 mb-4">
                Esta acción eliminará permanentemente todos los datos almacenados en la base de datos. Esta acción no se puede deshacer.
              </p>
              <button 
                onClick={() => setMostrarConfirmacion(true)} 
                className="btn btn-error"
              >
                Borrar todos los datos
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {!segundaConfirmacion 
                ? "¿Está seguro de que desea borrar todos los datos?" 
                : "¿CONFIRMAR BORRADO DEFINITIVO?"}
            </h3>
            <p className="py-4">
              {!segundaConfirmacion 
                ? "Esta acción eliminará permanentemente todos los datos de monitorización almacenados en la base de datos." 
                : "Al confirmar, se borrarán TODOS los datos. Esta acción NO SE PUEDE DESHACER."}
            </p>
            
            {borradoExitoso ? (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Datos borrados correctamente</span>
              </div>
            ) : (
              <div className="modal-action">
                <button 
                  onClick={cerrarConfirmacion} 
                  className="btn btn-ghost" 
                  disabled={borrando}
                >
                  Cancelar
                </button>
                <button 
                  onClick={borrarDatos} 
                  className={`btn ${segundaConfirmacion ? 'btn-error' : 'btn-warning'}`}
                  disabled={borrando}
                >
                  {borrando ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Borrando...
                    </>
                  ) : segundaConfirmacion ? 'Confirmar borrado' : 'Borrar datos'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
} 