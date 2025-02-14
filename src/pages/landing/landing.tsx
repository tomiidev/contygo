import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faTiktok, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import LocationAndModality from "./location_modality";
import axios from "axios";
import { API_LOCAL } from "@/hooks/apis";
type User = {
    _id: string;
    id?: string;
    name: string;
    photo: string;
    email: string;
    phone: string,
    description: string,
  };
const PsychologistProfile: React.FC = () => {
    const [formData, setFormData] = useState({
       
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
 
    useEffect(() => {
  
  
      const getDataInformation = async () => {
        try {
          const response = await axios.post(`${API_LOCAL}/get-user-data/67a78dc1a0d27dd1623ec869`, { withCredentials: false });
  
          if (response.status === 200) {
            const userData = response.data.data;
            console.log(userData)
            setUser(userData);      
          } else {
            setUser(null);
  
          }
        } catch (error) {
          console.error('Error checking authentication:', error)
          setUser(null);
  
        }
      }
      getDataInformation();
  
    }, [])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage(""); // Reset response message

        try {
            const response = await fetch("https://your-api-endpoint.com/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setResponseMessage("¡Mensaje enviado con éxito!");
            } else {
                setResponseMessage("Hubo un error al enviar el mensaje.");
            }
        } catch (error) {
            setResponseMessage("Error al intentar contactar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="flex flex-col items-center max-w-2xl w-full rounded-xl p-8">
                {/* Foto de perfil */}
                <img
                    src="https://via.placeholder.com/150"
                    alt="Foto del Psicólogo"
                    className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-xl mb-6"
                />

                {/* Nombre y Especialidad */}
                <h2 className="text-4xl font-extrabold text-white text-center mb-2">{user&&user.name}</h2>
                <p className="text-gray-400 text-lg mb-4">Psicólogo Clínico</p>

                {/* Descripción */}
                <p className="text-center text-gray-300 mb-6 px-4">
                    {user && user.description}
                </p>
              <LocationAndModality/>

                {/* Redes Sociales */}
                <div className="flex items-center gap-8 mt-4">
                    <a href="#" className="text-white hover:text-blue-700 text-4xl transition duration-200">
                        <FontAwesomeIcon icon={faFacebook} width={20} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-700 text-4xl transition duration-200">
                        <FontAwesomeIcon icon={faTwitter} width={20} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-700 text-4xl transition duration-200">
                        <FontAwesomeIcon icon={faInstagram} width={20} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-700 text-4xl transition duration-200">
                        <FontAwesomeIcon icon={faTiktok} width={20} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-700 text-4xl transition duration-200">
                        <FontAwesomeIcon icon={faLinkedin} width={20} />
                    </a>
                </div>

                {/* Separador */}
                <div className="w-20 h-1 bg-blue-500 my-8 rounded-full"></div>

                {/* Formulario de Contacto */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Mensaje"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-36 resize-none transition duration-200"
                    ></textarea>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar mensaje"}
                    </button>
                </form>

                {/* Mensaje de respuesta */}
                {responseMessage && (
                    <p className={`mt-4 text-center text-lg ${responseMessage.includes("éxito") ? "text-green-500" : "text-red-500"}`}>
                        {responseMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PsychologistProfile;
