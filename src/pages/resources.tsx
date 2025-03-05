import Loader from "@/common/Loader";
import { API_LOCAL } from "@/hooks/apis";
import { useEffect, useState } from "react";
import { BsDownload, BsShare } from "react-icons/bs";
import FormLayout from "./Form/FormLayout";

const fileTypes = ["PDF", "Video", "Excel", "Imagen", "Documento"];

interface Resource {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  path: string;
}

interface ApiResponse {
  data: Resource[];
}
interface ApiResponsePatients {
  data: Paciente[];
}
interface Paciente {
  id: string;
  _id: string;
  name: string;
  age: number;
  email: string
  gender: 'masculino' | 'femenino';
  phone: string;
  message: string;
}
interface Send {
  _id: string;
  subject: string;
  message: string;
  email: string;
  name: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [send, setSend] = useState<Send>({
    subject: "",
    message: "",
    name: "",
    email: "",
    _id: ""
  });

  const formatMongoDate = (mongoDate: string): string => {
    const date = new Date(mongoDate);
    const day = date.getDate().toString().padStart(2, "0"); // Agrega un "0" si es necesario
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Enero es 0 en JS
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-patients`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener pacientes');
        const result: ApiResponsePatients = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setPatients(result.data); // Asignamos los pacientes al estado
        } else {
          throw new Error('Los datos de pacientes no están en el formato esperado');
        }

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPacientes();
  }, []); // Se ejecuta solo una vez al montar el componente
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false) // Estado para manejar la carga

  const handleShareClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setSelectedResource(null);
    setShareModalOpen(false);
  };

  useEffect(() => {
    const obtenerRecursos = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-resources`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
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

  const [open, setOpen] = useState(false);
  const [newResource, setNewResource] = useState<{
    name: string;
    type: string;
    file: File | null;
  }>({
    name: "",
    type: "",
    file: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewResource({ name: "", type: "", file: null });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setNewResource((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeSend = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Si el cambio proviene del select de pacientes
    if (name === "patient") {
      const selected = patients.find((p) => p._id === value);
      if (selected) {
        setSelectedPatient(selected);
        setSend((prev) => ({
          ...prev,
          name: selected.name,
          email: selected.email,
          _id: selected._id,
        }));
      }
    } else {
      // Si el cambio es en otro input (subject, message)
      setSend((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewResource({
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "",
        file,
      });
    }
  };

  /*   const formatFileSize = (size: number) => {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }; */

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.name || !newResource.type || !newResource.file) return;

    const newItem: Resource = {
      name: newResource.name,
      type: newResource.type,
      size: newResource.file.size,
      uploadedAt: new Date().toLocaleDateString(),
      path: URL.createObjectURL(newResource.file),
    };

    setResources((prev) => [...prev, newItem]);
    await subirRecurso(newResource.file, newResource.type);
    handleClose();
  };

  const handleDeleteResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };
  const subirRecurso = async (file: File, type: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch(`${API_LOCAL}/upload-resource`, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "include", // Si necesitas enviar cookies
      });

      if (!response.ok) {
        throw new Error("Error al subir el recurso");
      }

      const result = await response.json();
      console.log("Recurso subido:", result);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };








  const handleShareResource = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificamos que ambos estén seleccionados
    if (send.email === "" || send.message === "" || send.subject === "" || !selectedResource) {
      alert("Paciente o recurso no seleccionado");
      return;
    }
    setIsSharing(true); // Inicia la carga
    // Llamamos a la función para compartir el recurso con el paciente
    try {
      await handleShare(send, selectedResource); // Llama a la función que maneja la compartición
      setSelectedPatient(null)
    } catch (error) {
      console.error("Error al compartir recurso", error);
    } finally {
      setIsSharing(false); // Finaliza la carga
    }
    handleCloseShareModal(); // Cerramos el modal
  };

  const handleShare = async (/* patient: Paciente */send: Send, resource: Resource): Promise<void> => {
    console.log(send)
    
    try {
      const response = await fetch(`${API_LOCAL}/share-resource`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ send, resource }), // Solo enviamos los IDs
        mode: "cors",
        credentials: "include", // Si necesitas enviar cookies
      });

      if (!response.ok) {
        throw new Error("Error al compartir el recurso");
      }

      const result: ApiResponse = await response.json();


      if (result.data && Array.isArray(result.data)) {
      } else {
        throw new Error("Los datos recibidos no tienen el formato esperado");
      }
      alert("Recurso compartido");
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };


  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Recursos</h2>
        <button
          onClick={handleOpen}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Agregar recurso
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
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
                    {/*  <a href={`https://contygo.s3.us-east-2.amazonaws.com/67a78dc1a0d27dd1623ec869/${resource.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      🔗 Ver
                    </a> */}
                    <a href={`https://contygo.s3.us-east-2.amazonaws.com/67a78dc1a0d27dd1623ec869/${resource.path}`} download title="Descargar" className="text-green-600 hover:underline">
                      <BsDownload className="w-4 h-4" />
                    </a>

                    <button onClick={() => handleDeleteResource(index)} title="Eliminar" className="text-red-600 hover:underline">
                      🗑️
                    </button>
                    <button onClick={() => handleShareClick(resource)} title="Compartir" className="text-blue-600 hover:underline">
                      <BsShare className="w-5 h-5" />
                    </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar nuevo recurso</h3>

            <label className="block mb-2">Tipo de archivo:</label>
            <select name="type" value={newResource.type} onChange={handleChange} className="w-full p-2 mb-3 border border-gray-300 rounded-lg">
              <option value="">Selecciona el tipo</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label className="block mb-2">Selecciona un archivo:</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 mb-3 border border-gray-300 rounded-lg" />

            <div className="flex justify-end space-x-3">
              <button onClick={handleClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                Cancelar
              </button>
              <button onClick={handleAddResource} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
      {shareModalOpen && selectedResource && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <FormLayout isSharing={isSharing} handleChangeSend={handleChangeSend} handleCloseShareModal={handleCloseShareModal} patients={patients} selectedPatient={selectedPatient} handleShareResource={handleShareResource} setSelectedPatient={setSelectedPatient} />
          {/*  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Compartir "{selectedResource.name}"</h3>

            {patients.length === 0 ? (
              <p className="text-gray-500">Cargando pacientes...</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 p-2 rounded-md">
                {patients.map((patient) => (
                  <li
                    key={patient._id}
                    className={`p-2 rounded cursor-pointer ${selectedPatient === patient ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    {patient.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={handleCloseShareModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  if (selectedPatient) {
                    handleShareResource(e);  // Llamar explícitamente a handleShareResource
                  }
                }}
                disabled={!selectedPatient || isSharing}
                className={`px-4 py-2 rounded-lg ${selectedPatient ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
              Compartir
              </button>


            </div>
          </div> */}
        </div>
      )
      }


    </div >
  );
};

export default Resources;
