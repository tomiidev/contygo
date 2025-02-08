
import { Outlet } from 'react-router-dom'; // 'Outlet' es el lugar donde se renderizan las rutas hijas

const AuthLayout = () => {
  return (
    <div>
      {/* Aquí puedes agregar cualquier componente o estilo específico del layout de autenticación */}
      <div className="auth-container">
        <Outlet /> {/* Este es el lugar donde se renderizan las rutas hijas */}
      </div>
    </div>
  );
};

export default AuthLayout;
