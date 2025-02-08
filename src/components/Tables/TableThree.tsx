import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para el paciente
interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  genero: 'Masculino' | 'Femenino' | 'Otro';
}

const ListaPacientes: FC = () => {
  const navigate = useNavigate();

  // Estado para manejar la lista de pacientes
  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: 1, nombre: 'Juan Pérez', edad: 30, genero: 'Masculino' },
    { id: 2, nombre: 'María Gómez', edad: 25, genero: 'Femenino' },
    { id: 3, nombre: 'Carlos Ruiz', edad: 40, genero: 'Masculino' },
    { id: 4, nombre: 'Ana Torres', edad: 35, genero: 'Femenino' },
  ]);

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<Paciente>({
    id: Date.now(),
    nombre: '',
    edad: 0,
    genero: 'Masculino', // Género predeterminado
  });

  // Estado para manejar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para manejar si estamos editando un paciente
  const [isEditing, setIsEditing] = useState(false);

  // Función para manejar el clic en un paciente
  const handleClick = (id: number) => {
    navigate(`/patients/${id}`); // Redirige a la vista del paciente
  };

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para agregar un nuevo paciente
  const handleAddPatient = () => {
    setPacientes([
      ...pacientes,
      { ...formData, id: Date.now() },
    ]);
    setFormData({ id: Date.now(), nombre: '', edad: 0, genero: 'Masculino' });
    setIsModalOpen(false); // Cerrar el modal después de agregar el paciente
  };

  // Función para eliminar un paciente
  const handleDelete = (id: number) => {
    setPacientes(pacientes.filter(paciente => paciente.id !== id));
  };

  // Función para editar un paciente
  const handleEdit = (paciente: Paciente) => {
    setFormData(paciente);
    setIsEditing(true);
    setIsModalOpen(true); // Abrir el modal para editar
  };

  // Función para actualizar un paciente
  const handleUpdatePatient = () => {
    setPacientes(pacientes.map(paciente => (paciente.id === formData.id ? formData : paciente)));
    setFormData({ id: Date.now(), nombre: '', edad: 0, genero: 'Masculino' });
    setIsEditing(false);
    setIsModalOpen(false); // Cerrar el modal después de actualizar
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: Date.now(), nombre: '', edad: 0, genero: 'Masculino' });
    setIsEditing(false); // Resetear el estado de edición
  };

  return (
    <div>
       <div className="flex justify-end mb-4">
     {/*    <h2 className="text-lg font-semibold">Calendario de citas</h2> */}
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {isModalOpen ? "Ver pacientes" : "Nuevo paciente"}
        </button>
      </div>
    

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Modal para agregar o editar pacientes */}
        {isModalOpen ? (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold">{isEditing && 'Editar Paciente'}</h3>
              <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Edad</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={isEditing ? handleUpdatePatient : handleAddPatient}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ): 

     
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-meta-4">
                <th className="py-3 px-4 font-medium text-black dark:text-white">Nombre</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Edad</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Género</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-2" onClick={()=>handleClick(paciente.id)}>
                  <td className="border-b border-gray-300 py-3 px-4">{paciente.nombre}</td>
                  <td className="border-b border-gray-300 py-3 px-4">{paciente.edad} años</td>
                  <td className="border-b border-gray-300 py-3 px-4">{paciente.genero}</td>
                  <td className="border-b border-gray-300 py-3 px-4">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleEdit(paciente)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(paciente.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        }
      </div>
    </div>
  );
};

export default ListaPacientes;
