import { API_LOCAL } from "@/hooks/apis";
import { formatDateToDMY } from "@/hooks/dates";
import { useEffect, useState } from "react";
interface Appointment {
  id: string;
  _id?: string;
  date: string;
  time: string;
  description: string;
  reason: string;
  duration: string;
  modality: string;
  patientId: string;
  status: string;
  nombre: string;
}
interface Paciente {
  id: string;
  _id: string;
  name: string;
  age: number;
  email: string
  gender: 'Masculino' | 'Femenino' | 'Otro';
  phone: string
}
interface ApiResponse {
  data: Paciente[];
}
interface ApiResponseAppointment {
  data: Appointment[];
}



const Calendar = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Appointment>({
    id: "",
    date: "",
    nombre: "",
    time: "",
    description: "",
    reason: "",
    duration: "",
    modality: "",
    patientId: "", // Almacenamos el ID del paciente
    status: "activo", // Estado por defecto
  });
  useEffect(() => {
    const obtenerCitas = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-appointments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener citas');
        const result: ApiResponseAppointment = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setAppointments(result.data); // Asignamos los pacientes al estado
        } else {
          throw new Error('Los datos de las citas no están en el formato esperado');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    obtenerCitas();
  }, []); // Se ejecuta solo una vez al montar el componente
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
        const result: ApiResponse = await response.json();

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si el campo cambiado es el "patientId" (selección del paciente)
    if (name === "patientId") {
      const selectedPatient = patients.find(patient => patient._id === value);
      if (selectedPatient) {
        setFormData({ ...formData, patientId: selectedPatient._id, nombre: selectedPatient.name });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = selectedAppointment ? 'PUT' : 'POST'; // Si hay una cita seleccionada, es edición
      const endpoint = selectedAppointment ? `${API_LOCAL}/edit-appointment` : `${API_LOCAL}/add-appointment`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include', // Enviar cookies HTTP-only automáticamente
        body: JSON.stringify({ formData: formData }),
      });

      if (!response.ok) {
        throw new Error(`Error al ${selectedAppointment ? 'editar' : 'agregar'} la cita`);
      }

      const data = await response.json();

      if (selectedAppointment) {
        // 📝 Editar cita en el estado

        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt._id === selectedAppointment._id // Verifica si es la cita seleccionada
              ? { ...appt, ...formData } // Mantiene datos originales y actualiza solo los editados
              : appt
          )
        );
        setSelectedAppointment(null);

      } else {
        // ➕ Agregar nueva cita al estado
        setAppointments((prevAppointments) => [...prevAppointments, { ...formData, id: data.id }]);
      }

      // ✅ Resetear formulario y cerrar modal
      setShowForm(false);
      setFormData({
        id: "",
        date: "",
        nombre: "",
        time: "",
        description: "",
        reason: "",
        duration: "",
        modality: "",
        patientId: "", // Almacenamos el ID del paciente
        status: "activo", // Estado por defecto
      });

      alert(`Cita ${selectedAppointment ? 'actualizada' : 'agregada'} correctamente`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };




  const handleEdit = async (appointment: Appointment) => {

    setSelectedAppointment(appointment);
    setFormData(appointment);
    setShowForm(true);
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    const paciente = patients.find(patient => patient.id === appointment.patientId);
    setMessage(`Estimado paciente,

      Le informamos que su cita con el Dr. ${paciente?.name || "Desconocido"} en la fecha ${appointment.date} a las ${appointment.time} ha sido cancelada.
      Pronto recibirá un mensaje de su parte para una reprogramación.
      
      Saludos.`);
    setShowDeleteModal(true);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appointmentToDelete) {
      setLoading(true)
      try {
        const response = await fetch(`${API_LOCAL}/delete-appointment`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({ appointmentToDelete })
        });

        const result: ApiResponseAppointment = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data) {
          setAppointments((prevA) => prevA.filter((appt) => appt._id !== appointmentToDelete._id));
          setShowDeleteModal(false);
          setAppointmentToDelete(null);
          alert("Cita eliminada")
        } else {
          throw new Error('Los datos de las citas no están en el formato esperado');
        }
      } catch (error) {
        console.error('Error eliminando el paciente:', error);
      }
      finally {
        setLoading(false)
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
      }
    }

  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Calendario de citas</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Ver calendario" : "Nueva cita"}
        </button>
      </div>

      {showForm ? (
        <div className=" mx-auto p-4 bg-white  rounded">
          <h3 className="text-lg font-semibold mb-2">{selectedAppointment ? "Editar cita" : "Nueva cita"}</h3>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Nombre del paciente:
              <select
                name="patientId"
                 autoComplete="off"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((patient, i) => (
                  <option key={i} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Fecha:
              <input
                type="date"
                name="date"
                value={formData.date}
                 autoComplete="off"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
            <label className="block mb-2">
              Hora:
              <input
                type="time"
                name="time"
                 autoComplete="off"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
            {/*  <label className="block mb-2">
              Descripción:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label> */}
            <label className="block mb-2">
              Motivo de la sesión:
              <input
                type="text"
                name="reason"
                autoComplete="off"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
            <label className="block mb-2">
              Duración (minutos):
              <input
                type="number"
                name="duration"
                 autoComplete="off"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
            <label className="block mb-2">
              Modalidad:
              <select
               autoComplete="off"
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </label>
            <label className="block mb-2">
              Estado de la cita:
              <select
                name="status"
                value={formData.status}
                 autoComplete="off"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="activo">Activo</option>
                <option value="cancelado">Cancelado</option>
                <option value="terminada">Terminada</option>
              </select>
            </label>
            <div className="flex justify-between gap-10">

              <button onClick={() => setShowForm(!showForm)} className="w-full bg-gray-300 px-4 py-2 rounded text-gray-700">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                {selectedAppointment ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.length > 0 ? (
            appointments
              .filter((s) => s.status !== "terminada")
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Ordenar por fecha descendente
              .map((appt) => (
                <div key={appt.id} className="p-4 border rounded bg-white">
                  <p className="font-semibold text-right">Fecha: {formatDateToDMY(appt.date)} - Hora: {appt.time}</p>
                  <hr/>
                  <p><strong>Paciente:</strong> {appt.nombre}</p>
                  <hr/>
                  <p><strong>Motivo:</strong> {appt.reason}</p>
                  <hr/>
                  <p><strong>Duración:</strong> {appt.duration} minutos</p>
                  <hr/>
                  <p><strong>Modalidad:</strong> {appt.modality}</p>
                  <hr/>
                  <p><strong>Estado:</strong> {appt.status === "activo" ? "Activo" : "Cancelado"}</p>
                  <hr/>
                  <div className="flex justify-between mt-2">
                    <button className="text-blue-500" onClick={() => handleEdit(appt)}>Editar</button>
                    <button className="text-red-500" onClick={() => handleDeleteClick(appt)}>Eliminar</button>
                  </div>
                </div>
              ))
          ) : (
            <p>No hay citas programadas.</p>
          )}

        </div>
      )}

      {/* Modal de confirmación */}
      {showDeleteModal && appointmentToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg"> {/* Cambié w-96 a w-3/4 */}
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas eliminar esta cita?</h3>
            <p className="mb-4">Una vez eliminada, no podrás recuperar esta cita y deberas agendarla nuevamente.</p>
            <p className="mb-4">Enviaremos este mensaje al paciente para que lo sepa de inmediato.</p>

            <textarea
              value={message}
              onChange={handleMessageChange}
              className="w-full p-2 border rounded mb-4"
              rows={6}
            />

            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelDelete} className="bg-gray-300 px-4 py-2 rounded text-gray-700">
                Cancelar
              </button>
              <button onClick={handleDelete} className="bg-red-500 px-4 py-2 rounded text-white">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
