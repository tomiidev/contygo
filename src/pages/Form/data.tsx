import { API_LOCAL } from "@/hooks/apis";
import React, { useEffect, useState } from "react";

type User = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  description: string;
  photo: string;
  especiality: string; // Agrega la especialidad al formulario de edición de usuario
  modality: string; // Agrega la especialidad al formulario de edición de usuario
};

interface SharedResourcesProps {
  user: User | null;
}

const UserProfileEditForm: React.FC<SharedResourcesProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    description: user?.description || "",
    especiality: user?.especiality || "",
    photo: user?.photo,
    modality: user?.modality || "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "", // Asegura que el email se setea
        description: user.description || "",
        photo: user.photo,
        especiality: user.especiality || "",
        modality: user?.modality || "",
      });
    }
  }, [user]); // Ejecuta el efecto cuando `user` cambia

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_LOCAL}/user-information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors",
        credentials: "include", // Enviar cookies HTTP-only automáticamente
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      alert("Perfil actualizado con éxito");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Hubo un error, intenta nuevamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-5">
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>

            <div className="mb-5.5">
              <label className="block text-sm font-medium">Teléfono</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
              />
            </div>

            <div className="mb-5.5">
              <label className="block text-sm font-medium">Email</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"

              />
            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium">Email</label>
              <select
                name="especiality"
                value={formData.especiality}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona una especialidad</option>
                <option value="Psicología Clínica">Psicología Clínica</option>
                <option value="Psicología Infantil">Psicología Infantil</option>
                <option value="Neuropsicología">Neuropsicología</option>
                <option value="Psicología Educativa">Psicología Educativa</option>
                <option value="Psicoterapia">Psicoterapia</option>
                <option value="Psicología Organizacional">Psicología Organizacional</option>
              </select>

            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium">Modalidad</label>
              <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona una modalidad</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="ambas">Ambas</option>
            
              </select>

            </div>

            <div className="mb-5.5">
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                className="w-full rounded border border-stroke py-3 px-4"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Escribe tu bio aquí"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90"
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditForm;
