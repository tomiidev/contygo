import { API_LOCAL } from "@/hooks/apis";
import { useState, useEffect, ReactNode } from "react";

// Definir los tipos de las props
interface ProtectedRouteProps {
  children: ReactNode; // 'children' puede ser cualquier cosa que se pase como hijos de este componente
  redirectTo: string;  // 'redirectTo' es una cadena de texto que representa la URL a la que redirigir
}

function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
  // Tipar el estado de la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_LOCAL}/check-auth`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Enviar cookies HTTP-only automáticamente
          mode: "cors",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = redirectTo; // Redirigir a otro dominio
    }
  }, [isAuthenticated, redirectTo]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Mostrar un estado de carga mientras se verifica
  }

  return isAuthenticated ? <>{children}</> : null; // No renderizar nada si no está autenticado
}

export default ProtectedRoute;
