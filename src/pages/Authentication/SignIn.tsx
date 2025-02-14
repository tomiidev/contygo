import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImagenSvg from '@/images/svg';
import { API_LOCAL, API_URL } from '@/hooks/apis';  // Si tienes un archivo que gestiona las URLs de la API

interface Errors {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Función de validación de formulario
  const validateForm = () => {
    let formErrors: Errors = { email: '', password: '' };
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/sign_in_with_email`, {
        method: 'POST',
        mode: "cors",
        credentials: 'include', // Enviar cookies HTTP-only automáticamente
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error desconocido en la autenticación.');
        return;
      }

      const result = await response.json();
      console.log('Login successful:', result);

      // Redirige al usuario a la página de inicio o dashboard

     /*  navigate('/') */
        /*   window.location.replace("http://localhost:5173")  */
          window.location.replace("https://contygo.vercel.app") 
      /*  window.location.href = "http://localhost:5173"; */
    } catch (err) {
      setLoading(false);
      setError('Error de conexión. Intenta de nuevo más tarde.');
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke h-screen flex justify-center bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <ImagenSvg />
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to TailAdmin
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-5">
                  <input
                    type="submit"
                    value={loading ? 'Logging in...' : 'Sign In'}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={loading}
                  />
                </div>

                {error && <div className="text-red-500 text-center">{error}</div>}

                <div className="mt-6 text-center">
                  <p>
                    ¿No tienes cuenta?{' '}
                    <Link to="/auth/signup" className="text-primary">
                      Regístrate
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
