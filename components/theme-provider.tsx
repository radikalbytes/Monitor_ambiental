"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

/**
 * Proveedor de tema para gestionar el modo claro/oscuro
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que heredarán el tema
 * @returns {JSX.Element} Componente proveedor de tema
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
} 