import { API_LOCAL } from "@/hooks/apis";
import { useState } from "react";

type Farmaco = {
    _id?: string;
    id: string;
    nombre: string;
    date: string;
    description: string;
    duration: string;
    dosis: string;
    freq: string;
    patientId: string;
    status: string; // Estado del medicamento (activo, inactivo, etc.)
};

type Patient = {
    _id: string;
    name: string;
};

const Farm: React.FC<{
    patient: Patient;
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}> = ({ patient, openModal, setOpenModal }) => {

    const [formData, setFormData] = useState<Farmaco>({
        id: "",
        date: "",
        patientId: patient._id,
        nombre: "",
        freq: "",
        description: "",
        duration: "",
        dosis: "",
        status: "activo",
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(formData)
        try {
            const response = await fetch(`${API_LOCAL}/add-patient-farm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                credentials: "include",
                body: JSON.stringify({ formData: formData }),
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            // ✅ Resetear formulario y cerrar modal
            setOpenModal(false);
            setFormData({
                id: "",
                date: "",
                nombre: "",
                patientId: "",
                freq: "",
                description: "",
                duration: "",
                dosis: "",
                status: "activo",

            });

            alert("Fármaco agregado correctamente");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="mb-6">

            {openModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform scale-95 transition-all duration-300 ease-in-out">
                        <form onSubmit={handleSubmit}>


                            <label className="block mb-2">
                                Fecha de prescripción:
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>

                            <label className="block mb-2">
                                Nombre del Fármaco:
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>

                            <label className="block mb-2">
                                Descripción:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>

                            <label className="block mb-2">
                                Dosis:
                                <input
                                    type="text"
                                    name="dosis"
                                    value={formData.dosis}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>

                            <label className="block mb-2">
                                Frecuencia:
                                <input
                                    type="text"
                                    name="freq"
                                    value={formData.freq}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>





                            <label className="block mb-2">
                                Estado del fármaco:
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </label>

                            <div className="flex justify-between gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="w-full bg-gray-300 px-4 py-2 rounded text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Farm;
