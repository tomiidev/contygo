import { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";

interface Appointment {
  id: number;
  date: string;
  time: string;
  description: string;
  reason: string;
  duration: string;
  modality: string;
  patientId: string;
  status: string;
}

const patients = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María García" },
  { id: "3", name: "Carlos López" },
  // Agrega más pacientes aquí
];

const Calendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Appointment>({
    id: Date.now(),
    date: "",
    time: "",
    description: "",
    reason: "",
    duration: "",
    modality: "",
    patientId: "", // Almacenamos el ID del paciente
    status: "activo", // Estado por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppointment) {
      // Editar cita
      setAppointments(
        appointments.map((appt) =>
          appt.id === selectedAppointment.id ? { ...formData, id: selectedAppointment.id } : appt
        )
      );
      setSelectedAppointment(null);
    } else {
      // Agregar nueva cita
      setAppointments([...appointments, { ...formData, id: Date.now() }]);
    }
    setShowForm(false);
    setFormData({
      id: Date.now(),
      date: "",
      time: "",
      description: "",
      reason: "",
      duration: "",
      modality: "",
      patientId: "",
      status: "activo",
    });
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData(appointment);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter((appt) => appt.id !== id));
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
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
          <h3 className="text-lg font-semibold mb-2">{selectedAppointment ? "Editar Cita" : "Nueva Cita"}</h3>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Nombre del paciente:
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
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
                value={formData.time}
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
              Motivo de la sesión:
              <input
                type="text"
                name="reason"
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
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
            <label className="block mb-2">
              Modalidad:
              <select
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
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="activo">Activo</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
              {selectedAppointment ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.id} className="p-4 border rounded shadow bg-white">
                <p className="font-semibold">{appt.date} - {appt.time}</p>
                <p>{appt.description}</p>
                <p><strong>Paciente:</strong> {patients.find(patient => patient.id === appt.patientId)?.name}</p>
                <p><strong>Motivo:</strong> {appt.reason}</p>
                <p><strong>Duración:</strong> {appt.duration} minutos</p>
                <p><strong>Modalidad:</strong> {appt.modality}</p>
                <p><strong>Estado:</strong> {appt.status === "activo" ? "Activo" : "Cancelado"}</p>
                <div className="flex justify-between mt-2">
                  <button className="text-blue-500" onClick={() => handleEdit(appt)}>Editar</button>
                  <button className="text-red-500" onClick={() => handleDelete(appt.id)}>Eliminar</button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay citas programadas.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Calendar;
