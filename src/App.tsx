import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout'; // Este es el layout de las páginas protegidas
import Resources from './pages/resources';
import VistaPaciente from './pages/patient';
import VistaSession from './pages/patient_id';
import AuthLayout from './layout/auth'; // Layout para autenticación
import { API_LOCAL, API_URL } from './hooks/apis';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Para verificar si el usuario está autenticado
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Usamos el hook para redirigir

  // Lógica de autenticación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulamos un delay de carga de 1 segundo
  }, []);

  useEffect(() => {
    // Aquí iría la lógica para comprobar la autenticación, por ejemplo, haciendo una llamada a la API
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/check-auth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode:"cors",
          credentials: 'include', // Enviar cookies HTTP-only automáticamente
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (!pathname.includes('/auth/')) {
            navigate('/auth/signin'); // Redirigir a la página de login si no está autenticado
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (!pathname.includes('/auth/')) {
          navigate('/auth/signin'); // Redirigir a la página de login en caso de error
        }
      }
    };

    checkAuth();
  }, [navigate, pathname]);

  // Lógica de renderizado condicional
  if (loading) {
    return <Loader />; // Muestra un Loader mientras carga la página
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Muestra un estado de carga mientras verificamos la autenticación
  }

  return (
    <>
      {/* Rutas de autenticación, que usan el AuthLayout */}
      {!isAuthenticated ? (
        <Routes>

          <Route element={<AuthLayout />}>
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignUp />
                </>
              }
            />
          </Route>
        </Routes>
      ) : (
        // Rutas protegidas, que usan el DefaultLayout
        <DefaultLayout>
          <Routes>


            <Route
              index
              element={
                <>
                  <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/resources"
              element={
                <>
                  <PageTitle title="Recursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Resources />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </>
              }
            />
            <Route path="/patients" element={<Tables />} />
            <Route path="/patients/:patientId" element={<VistaPaciente />} />
            <Route path="/patients/:patientId/:sessionId" element={<VistaSession />} />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            />
          </Routes>
        </DefaultLayout>
      )}

    </>
  );
}

export default App;
