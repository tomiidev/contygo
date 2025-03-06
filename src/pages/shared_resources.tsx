import { API_LOCAL, API_URL } from "@/hooks/apis";
import { useEffect, useState } from "react";
import { BsDownload, BsShare } from "react-icons/bs";
type Sesion = {
    _id: string,
    date: string;
    description: string;
    time: string,
    modality: string,
    type: string,
    reason: string
};

type Material = {
    tipo: string;
    descripcion: string;
    fechaEntrega: string;
};
interface Resource {
    id?: string;
    _id?: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    path: string;
}
interface Paciente {
    _id: string;
    id?: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    sessions: Sesion[];
    materialesBrindados: Material[];
    notasAdicionales: string;
}
interface ApiResponse {
    data: Resource[];
}
interface SharedResourcesProps {
    patient: Paciente | null;
}
const SharedResources: React.FC<SharedResourcesProps> = ({ patient }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const formatMongoDate = (mongoDate: string): string => {
        const date = new Date(mongoDate);
        const day = date.getDate().toString().padStart(2, "0"); // Agrega un "0" si es necesario
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Enero es 0 en JS
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    /* const [selectedResource, setSelectedResource] = useState<Resource | null>(null); */
    useEffect(() => {
        const obtenerRecursos = async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/get-patient-resources`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    mode: "cors",
                    body: JSON.stringify({ patient }),
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Error al obtener los recursos");

                const result: ApiResponse = await response.json();

                if (result.data && Array.isArray(result.data)) {
                    setResources(result.data);
                } else {
                    throw new Error("Los datos recibidos no tienen el formato esperado");
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        console.log(resources)
        obtenerRecursos();
    }, []);






    /*   const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      }; */

    const handleDeleteResource = async (e: React.FormEvent, resource: Resource) => {
        e.preventDefault();
        if (patient !== null && resource !== null) {

            await deleteResource(patient, resource);
        }

    };

    /*  const deleteResource = (index: number) => {
         setResources((prev) => prev.filter((_, i) => i !== index));
     }; */
    const deleteResource = async (patient: Paciente, resource: Resource): Promise<void> => {
        try {


            const response = await fetch(`${API_URL}/delete-patient-resource`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ patient, resource }),
                mode: "cors",
                credentials: "include", // Si necesitas enviar cookies
            });

            if (!response.ok) {
                throw new Error("Error al subir el recurso");
            }

            const result: ApiResponse = await response.json();

            if (result.data) {
                setResources(result.data);
                window.location.reload();
            } else {
                throw new Error("Los datos recibidos no tienen el formato esperado");
            }
        } catch (error) {
            console.error("Error:", (error as Error).message);
        }
    };












    return (
        <div className="rounded-lg border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black dark:text-white">Recursos</h2>
                {/*   <button
                    onClick={handleOpen}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Agregar recurso
                </button> */}
            </div>

            {/* loading ? (
                <p className="text-center">Cargando...</p>
            ) : */ error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : resources.length === 0 ? (
                <p className="text-center">No hay recursos disponibles.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 text-left dark:bg-gray-700">
                                <th className="p-3 border border-gray-200 dark:border-gray-700">Nombre</th>
                                <th className="p-3 border border-gray-200 dark:border-gray-700">Tipo</th>
                                <th className="p-3 border border-gray-200 dark:border-gray-700">Tamaño</th>
                                <th className="p-3 border border-gray-200 dark:border-gray-700">Fecha</th>
                                <th className="p-3 border border-gray-200 dark:border-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource, index) => (
                                <tr key={index} className="border border-gray-200 dark:border-gray-700">
                                    <td className="p-3">{resource.name}</td>
                                    <td className="p-3">{resource.type}</td>
                                    <td className="p-3">{(resource.size / (1024 * 1024)).toFixed(2)} MB</td>

                                    <td className="p-3">{formatMongoDate(resource.uploadedAt)}</td>
                                    <td className="p-3 flex space-x-3 items-center">

                                        <a href={`https://contygo.s3.us-east-2.amazonaws.com/67a78dc1a0d27dd1623ec869/${resource.path}`} download title="Descargar" className="text-green-600 hover:underline">
                                            <BsDownload className="w-4 h-4" />
                                        </a>

                                        <button onClick={(e) => handleDeleteResource(e, resource)} title="Eliminar" className="text-red-600 hover:underline">
                                            🗑️
                                        </button>



                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}





        </div >
    );
};

export default SharedResources;
