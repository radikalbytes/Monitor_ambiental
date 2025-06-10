"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Componente para alternar entre modo claro y oscuro
 * @returns {JSX.Element} Botón de cambio de tema
 * @description Este componente muestra un botón que permite al usuario cambiar entre el tema claro y oscuro
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente se monte para evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8"></div>;
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn btn-ghost px-2 py-1 text-lg"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
} 