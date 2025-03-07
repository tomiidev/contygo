import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImagenSvg from "@/images/svg"; // Asumiendo que esta es una imagen en tu proyecto
import { API_LOCAL, API_URL } from "@/hooks/apis";

// Definición de tipos para los errores
interface Errors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  // State variables to store input field values and errors
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    let formErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords must match";
      isValid = false;
    }

    setErrors(formErrors);

    if (!isValid) return;

    setLoading(true);
    setError(""); // Reset previous errors

    // Prepare data for submission
    const data = {
      name,
      email,
      password,
    };

    // Proceed with the registration logic (e.g., API call)
    try {
      const response = await fetch(`${API_URL}/create_account_with_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include", // Importante para cookies
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage || "Error desconocido en la autenticación.");
        return;
      }

      const result = await response.json();
      console.log("Registro exitoso", result);

      // Redirigir después de un registro exitoso
      window.location.replace("https://www.contygoo.com")
      /*  window.location.href = "http://localhost:5173";  */// Cambia esta URL si es necesario

    } catch (error) {
      console.error("Registration failed", error);
      setLoading(false);
      setError("Hubo un error al registrar la cuenta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white flex justify-center h-screen shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <ImagenSvg />

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">¡7 dias gratis!</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Registrate en Contygo
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.name && <span className="text-red-500">{errors.name}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Confirma la contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma la contraseña"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <input
                  type="submit"
                  value={loading ? "Creando cuenta..." : "Registrarse"}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500">{error}</div>}

              <div className="mt-6 text-center">
                <p>
                  ¿Tienes cuenta?{" "}
                  <Link to="/auth/signin" className="text-primary">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
