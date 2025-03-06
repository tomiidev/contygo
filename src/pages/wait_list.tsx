import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { API_LOCAL, API_URL } from '@/hooks/apis';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface Booking {
  therapistId: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  message: string
}
interface ApiResponse {
  data: Booking[];
}
const ListaEspera: FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [bookingToAccept, setBookingToAccept] = useState<Booking | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para manejar la lista de pacientes
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/get-bookings`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener pacientes');
        const result: ApiResponse = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setBookings(result.data); // Asignamos los pacientes al estado
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

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<Booking>({
    therapistId: '',
    _id: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    age: "",
    gender: "Masculino"
  });

  // Estado para manejar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBookingToDelete(null);
  };
  const handleCancelAccept = () => {
    setIsModalOpen(false);
    setBookingToAccept(null);
  };

  // Función para manejar el clic en un paciente
  const handleClick = (_id: string) => {
    navigate(`/patients/${_id}`); // Redirige a la vista del paciente
  };



  // Función para eliminar un paciente
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingToDelete) {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/reject-patient`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({ bookingToDelete: bookingToDelete })
        });

        if (!response.ok) throw new Error('Error al rechazar el paciente');

        setBookings((prevPacientes) => prevPacientes.filter((p) => p._id !== bookingToDelete._id));

        setShowDeleteModal(false);
        setBookingToDelete(null);
      } catch (error) {
        console.error('Error eliminando el paciente:', error);
      }
      finally {
        setLoading(false)
        setShowDeleteModal(false);
        setBookingToDelete(null);
      }
    }
  };
  // Función para agregar un paciente
  const handleConfirmAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingToAccept) {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/add-patient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({ bookingToAccept })
        });

        if (!response.ok) throw new Error('Error al aceptar el paciente');

        setBookings((prevPacientes) => prevPacientes.filter((p) => p._id !== bookingToAccept._id));

        setIsModalOpen(false);
        setBookingToAccept(null);
      } catch (error) {
        console.error('Error eliminando el paciente:', error);
      }
      finally {
        setLoading(false)
        setIsModalOpen(false);
        setBookingToAccept(null);
      }
    }
  };

  const handleDeleteClick = (b: Booking) => {
    setBookingToDelete(b);
    setShowDeleteModal(true);
  };


  // Función para editar un paciente
  const handleAccept = (b: Booking) => {
    setBookingToAccept(b);

    setIsModalOpen(true); // Abrir el modal para editar
  };

  // Función para actualizar un paciente


  // Función para cerrar el modal
  /*   const closeModal = () => {
      setIsModalOpen(false);
      setFormData({ i nombre: '', edad: 0, genero: 'Masculino', email: "", phone: "", _id: "" });
      setIsEditing(false); // Resetear el estado de edición
    }; */

  return (
    <div>
      <Breadcrumb pageName="Lista de espera" number={bookings.length} />
      <div className="flex justify-end mb-4">
        {/*    <h2 className="text-lg font-semibold">Calendario de citas</h2> */}

      </div>


      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark">



        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-meta-4">
                <th className="py-3 px-4 font-medium text-black dark:text-white">Nombre</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Edad</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Género</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Email</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Teléfono</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Mensaje</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings?.map((b) => (
                <tr key={b._id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-2">
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.name}</td>
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.age}</td>
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.gender}</td>
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.email}</td>
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.phone}</td>
                  <td className="border-b border-gray-300 py-3 px-4" onClick={() => handleClick(b._id)}>{b.message}</td>
                  <td className="border-b border-gray-300 py-3 px-4">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleAccept(b)}
                    >
                      Aceptar
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteClick(b)}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              )) : <td className='text-left'>No hay solicitudes nuevas.</td>}
            </tbody>
          </table>
        </div>

      </div>
      {showDeleteModal && bookingToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg"> {/* Cambié w-96 a w-3/4 */}
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas rechazar esta solicitud?</h3>





            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelDelete} className="bg-gray-300 px-4 py-2 rounded text-gray-700">
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleConfirmDelete}
                className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && bookingToAccept && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg"> {/* Cambié w-96 a w-3/4 */}
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas aceptar esta solicitud?</h3>
            <p>Agregaremos este paciente al sistema</p>




            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelAccept} className="bg-gray-300 px-4 py-2 rounded text-gray-700">
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleConfirmAccept}
                className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                ) : (
                  'Aceptar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEspera;
