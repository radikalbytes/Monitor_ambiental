"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

/**
 * Barra de navegación de la aplicación
 * @returns {JSX.Element} Componente de barra de navegación
 */
export function Navbar() {
  // Obtener la ruta actual para evitar mostrar la barra en la página de gráfico detalle
  const pathname = usePathname();
  
  // No mostrar la barra de navegación en la página de gráfico detalle
  if (pathname === "/grafico-detalle") {
    return null;
  }
  
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">Monitor Ambiental</Link>
      </div>
      <div className="navbar-center">
        <nav className="flex space-x-2">
          <Link 
            href="/" 
            className={`btn btn-circle btn-ghost ${pathname === '/' ? 'btn-active' : ''}`}
            title="Inicio"
          >
            🏠
          </Link>
          <Link 
            href="/historico" 
            className={`btn btn-circle btn-ghost ${pathname === '/historico' ? 'btn-active' : ''}`}
            title="Histórico"
          >
            📊
          </Link>
          <Link 
            href="/configuracion" 
            className={`btn btn-circle btn-ghost ${pathname === '/configuracion' ? 'btn-active' : ''}`}
            title="Configuración"
          >
            ⚙️
          </Link>
        </nav>
      </div>
      <div className="navbar-end">
        <div className="flex items-center px-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
} 