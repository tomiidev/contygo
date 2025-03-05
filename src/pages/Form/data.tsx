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
  therapyTypes: string[];
  department?: string;
  neighborhood?: string;
  socialNetworks?: { [key: string]: string }; // Redes sociales como objeto
};

interface SharedResourcesProps {
  user: User | null;
}
const therapyTypes = [
  "Cognitivo-Conductual",
  "Psicoanálisis",
  "Gestalt",
  "Humanista",
  "Sistémica",
  "Terapia Breve"
];
const departments = {
  Montevideo: ["Centro", "Pocitos", "Carrasco", "La Teja", "Aguada", "Buceo", "Capurro", "Malvín", "Prado", "Unión", "Parque Rodó"],
  Canelones: ["Las Piedras", "Pando", "Ciudad de la Costa", "Atlántida", "Barros Blancos", "Toledo", "Sauce", "Santa Lucía"],
  Maldonado: ["Punta del Este", "Maldonado", "San Carlos", "Pan de Azúcar", "Piriápolis", "Aiguá"],
  Colonia: ["Colonia del Sacramento", "Carmelo", "Juan Lacaze", "Nueva Helvecia", "Rosario", "Tarariras"],
  Soriano: ["Mercedes", "Dolores", "Cardona"],
  Rivera: ["Rivera", "Tranqueras", "Vichadero"],
  Salto: ["Salto", "Constitución", "Belén"],
  Paysandú: ["Paysandú", "Guichón", "Quebracho"],
  Tacuarembó: ["Tacuarembó", "Paso de los Toros", "San Gregorio de Polanco"],
  Artigas: ["Artigas", "Bella Unión"],
  Rocha: ["Rocha", "Chuy", "Castillos", "La Paloma"],
  Treinta_y_Tres: ["Treinta y Tres", "Vergara"],
  Cerro_Largo: ["Melo", "Rio Branco"],
  Florida: ["Florida", "Sarandí Grande"],
  Flores: ["Trinidad"],
  Durazno: ["Durazno", "Sarandí del Yí"]
};

const UserProfileEditForm: React.FC<SharedResourcesProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    description: user?.description || "",
    especiality: user?.especiality || "",
    photo: user?.photo,
    modality: user?.modality || "",
    therapyTypes: user?.therapyTypes || [],
    department: user?.department || "",
    neighborhood: user?.neighborhood || "",
    socialNetworks: user?.socialNetworks || {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      titktok: "",
    }, // Inicializa redes sociales si están presentes
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
        therapyTypes: user.therapyTypes || [],
        department: user.department || "",
        neighborhood: user.neighborhood || "",
        socialNetworks: user.socialNetworks || {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: "",
          youtube:"",
          titktok:""
        }, // Inicializa redes sociales si están presentes
      });
    }
  }, [user]); // Ejecuta el efecto cuando `user` cambia

  /*   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value,  });
      
    }; */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { neighborhood: "" } : {}),
    }));
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
  const handleTherapySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTherapy = e.target.value;
    if (selectedTherapy && !formData.therapyTypes.includes(selectedTherapy)) {
      setFormData({ ...formData, therapyTypes: [...formData.therapyTypes, selectedTherapy] });
    }
  };

  const removeTherapyType = (type: string) => {
    const updatedTherapyTypes = formData.therapyTypes.filter(t => t !== type);
    setFormData({
      ...formData,
      therapyTypes: updatedTherapyTypes.length > 0 ? updatedTherapyTypes : [],
    });
  };
  const handleSocialNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialNetworks: {
        ...prev.socialNetworks,
        [name]: value,
      },
    }));
  };

  const handleAddSocialNetwork = () => {
    // Agregar un nuevo campo vacío para red social
    const newSocialNetworks = { ...formData.socialNetworks, newNetwork: "" };
    setFormData((prev) => ({
      ...prev,
      socialNetworks: newSocialNetworks,
    }));
  };

/*   const handleRemoveSocialNetwork = (network: string) => {
    // Eliminar la red social
    const updatedSocialNetworks = { ...formData.socialNetworks };
    delete updatedSocialNetworks[network];
    setFormData((prev) => ({
      ...prev,
      socialNetworks: updatedSocialNetworks,
    }));
  }; */
  return (
    <div className="col-span-5">
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Nombre</label>
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
              <label className="block text-sm font-medium py-3">Teléfono</label>
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
              <label className="block text-sm font-medium py-3">Email</label>
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
              <label className="block text-sm font-medium py-3">Especialidad</label>
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
              <label className="block text-sm font-medium py-3">Modalidad de las sesiones</label>
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
              <label className="block text-sm font-medium py-3">Tipos de terapia</label>
              <select
                onChange={handleTherapySelect}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona un tipo de terapia</option>
                {therapyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="mt-3 flex flex-wrap gap-2 py-3">
                {formData.therapyTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeTherapyType(type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="mb-5.5">
                <label className="block text-sm font-medium py-3">Departamento</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke py-3 px-4"
                >
                  <option value="">Selecciona un departamento</option>
                  {Object.keys(departments).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5.5">
                <label className="block text-sm font-medium py-3">Barrio</label>
                <select
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke py-3 px-4"
                  disabled={!formData.department}
                >
                  <option value="">Selecciona un barrio</option>
                  {formData.department && (departments[formData.department as keyof typeof departments])?.map((barrio) => (
                    <option key={barrio} value={barrio}>{barrio}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Descripción</label>
              <textarea
                className="w-full rounded border border-stroke py-3 px-4"
                name="description"
                rows={4}
                minLength={50}
                maxLength={300}
                value={formData.description}
                onChange={handleChange}
                placeholder="Escribe tu bio aquí"
              ></textarea>
            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Redes Sociales</label>

              {Object.keys(formData.socialNetworks).map((social) => (
                social !== "newNetwork" && (
                  <div key={social} className="mb-3">
                   {/*  <label className="block text-sm">{social.charAt(0).toUpperCase() + social.slice(1)}</label> */}
                    <input
                      className="w-full rounded border border-stroke py-3 px-4"
                      type="text"
                      name={social}
                      value={formData.socialNetworks[social]}
                      onChange={handleSocialNetworkChange}
                      placeholder={`Enlace a ${social}`}
                    />
                   {/*  <button
                      type="button"
                      onClick={() => handleRemoveSocialNetwork(social)}
                      className="text-red-500 mt-2"
                    >
                      Eliminar
                    </button> */}
                  </div>
                )
              ))}

           
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
