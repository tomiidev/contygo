import { useState } from "react";

const fileTypes = ["PDF", "Video", "Excel", "Imagen", "Documento"];

const Resources = () => {
  const [resources, setResources] = useState([
    {
      name: "Project Proposal",
      type: "PDF",
      size: "1.2 MB",
      uploadedAt: "Feb 1, 2024",
      url: "https://example.com/project-proposal.pdf",
    },
    {
      name: "Team Meeting Recording",
      type: "Video",
      size: "500 MB",
      uploadedAt: "Jan 28, 2024",
      url: "https://example.com/team-meeting.mp4",
    },
    {
      name: "Financial Report",
      type: "Excel",
      size: "850 KB",
      uploadedAt: "Jan 25, 2024",
      url: "https://example.com/financial-report.xlsx",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    file: null as File | null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewResource({ name: "", type: "", file: null });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setNewResource({ ...newResource, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewResource({
        ...newResource,
        file,
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "",
      });
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.type || !newResource.file) return;

    const newItem = {
      name: newResource.name,
      type: newResource.type,
      size: formatFileSize(newResource.file.size),
      uploadedAt: new Date().toLocaleDateString(),
      url: URL.createObjectURL(newResource.file),
    };

    setResources([...resources, newItem]);
    handleClose();
  };

  const handleDeleteResource = (index: number) => {
    const updatedResources = resources.filter((_, i) => i !== index);
    setResources(updatedResources);
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Recursos</h2>
        <button
          onClick={handleOpen}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Agregar recurso
        </button>
      </div>

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
                <td className="p-3">{resource.size}</td>
                <td className="p-3">{resource.uploadedAt}</td>
                <td className="p-3 flex space-x-3">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🔗 Ver
                  </a>
                  <a href={resource.url} download className="text-green-600 hover:underline">
                    Descargar
                  </a>
                  <button
                    onClick={() => handleDeleteResource(index)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Recurso</h3>

            {/* Select de tipo de archivo */}
            <label className="block mb-2">Tipo de archivo:</label>
            <select
              name="type"
              value={newResource.type}
              onChange={handleChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            >
              <option value="">Selecciona el tipo</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Input para seleccionar el archivo */}
            <label className="block mb-2">Selecciona un archivo:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddResource}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
