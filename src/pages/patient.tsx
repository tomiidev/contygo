import React, { useEffect, useState } from 'react';
import Resources from './resources';
import { useNavigate, useParams } from 'react-router-dom';
import ChartOne from '@/components/Charts/ChartOne';
import { API_LOCAL, API_URL } from '@/hooks/apis';
import SharedResources from './shared_resources';
import { BsPencil, BsTrash, BsTrash2 } from 'react-icons/bs';
import Farm from '@/components/farm';
import { formatDateToDMY } from '@/hooks/dates';

// Tipos de datos
type Sesion = {
    _id: string,
    id: string,
    date: string;
    description: string;
    time: string,
    modality: string,
    type: string,
    reason: string,
    fechaReceta: string,
    nombre: string,
    dosis: string,
    frecuencia: string,
    duracion: string,
    via: string
};
type Farmaco = {
    _id: string,
    date: string;
    description: string;
    time: string,
    duration: string,
    dosis: string;
    freq: string;
    status: string
    nombre: string
};

type Material = {
    tipo: string;
    descripcion: string;
    fechaEntrega: string;
};

type Paciente = {
    _id: string;
    id?: string;
    name: string;
    age: number;
    gender: "masculino" | "femenino";
    email: string;
    phone: string;
    sessions: Sesion[];
    medications: Farmaco[];
    materialesBrindados: Material[];
    notasAdicionales: string;
};



interface ApiResponse {
    data: Paciente[];
}

const VistaPaciente: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>()
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [pagina, setPagina] = useState(1);
    const sesionesPorPagina = 5;
    const [patient, setPatient] = useState<Paciente | null>(null);
    const [editablePaciente, setEditablePaciente] = useState<Paciente | null>(null);
    const totalPaginas = Math.ceil((patient?.sessions?.length || 1) / sesionesPorPagina);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const obtenerPacientes = async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/get-patient-byid/${patientId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Error al obtener paciente');
                const result: ApiResponse = await response.json();

                if (Array.isArray(result.data)) {
                    setPatient(result.data[0]); // Asigna solo el primer paciente

                } else {
                    throw new Error('Los datos de las citas no están en el formato esperado');
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        obtenerPacientes();
    }, [patientId]);

    const handleGenerarDiagrama = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_LOCAL}/generar-diagrama`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'diagrama.png';
                link.click();
            } else {
                alert('Hubo un problema al generar el diagrama.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el diagrama.');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!patient) return <p>No hay datos del paciente.</p>;

    const pacienteData = patient;
    const sesionesPaginadas = pacienteData.sessions?.slice(
        (pagina - 1) * sesionesPorPagina,
        pagina * sesionesPorPagina
    );
    const farmacosPaginados = pacienteData.medications?.slice(
        (pagina - 1) * sesionesPorPagina,
        pagina * sesionesPorPagina
    );
    const deleteFarmaco = async (fId: string) => {
        try {
            const response = await fetch(`${API_URL}/delete-patient-farm`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ farmId: fId, patientId: patientId }),
                mode: 'cors',
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Hubo un problema al borrar el farmaco');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al borrar el farmaco.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg border h-full">
            <h1 className="text-2xl font-bold mb-4">Información del paciente</h1>
            <p>Nombre: <strong>{pacienteData.name}</strong></p>
            <p>Edad:  <strong>{pacienteData.age}</strong></p>
            <p>Teléfono:  <strong>{pacienteData.phone}</strong></p>
            <p>Email:  <strong>{pacienteData.email}</strong></p>
            <p>Genero:  <strong>{pacienteData.gender}</strong></p>
            <div className="my-10">
                <h2 className="text-xl font-semibold mb-3">Sesiones</h2>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Fecha</th>
                            <th className="border p-2">Razón</th>
                            <th className="border p-2">Duración</th>
                            <th className="border p-2">Modo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sesionesPaginadas.length > 0 ? sesionesPaginadas?.map((sesion, index) => (
                            <tr key={index} className="border" onClick={() => navigate(`/patients/${patientId}/${sesion._id}`)}>
                                <td className="border p-2">{formatDateToDMY(sesion.date)}</td>
                                <td className="border p-2">{sesion.reason}</td>
                                <td className="border p-2">{sesion.time}</td>

                                <td className="border p-2">{sesion.modality}</td>
                            </tr>
                        )) : <td className='text-black text-left'>Aún no hubieron sesiones.</td>}
                    </tbody>
                </table>
            </div>
            {/* <ChartOne /> */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Materiales brindados</h2>
                <SharedResources patient={patient} />
            </div>
            <div className="mb-6 w-full  overflow-x-auto table-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold mb-3">Fármacos recetados</h2>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white text-xs sm:text-lg px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Agregar
                    </button>
                </div>
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 overflow-x-auto table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Fecha de la receta</th>
                            <th className="border p-2">Fármaco</th>
                            <th className="border p-2">Dosis</th>
                            <th className="border p-2">Frecuencia</th>
                            <th className="border p-2">Duración</th>

                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmacosPaginados?.length > 0 ? (
                            farmacosPaginados?.map((farmaco, index) => (
                                <tr key={index} className="border">
                                    <td className="border p-2">{farmaco.date}</td>
                                    <td className="border p-2">{farmaco.nombre}</td>
                                    <td className="border p-2">{farmaco.dosis}</td>
                                    <td className="border p-2">{farmaco.freq}</td>
                                    <td className="border p-2">{farmaco.duration}</td>

                                    <td className="flex justify-around items-center  p-2">
                                        {/*       <BsPencil title='Editar' className="w-4 h-4" onClick={() => editarFarmaco(farmaco._id)} /> */}
                                        <BsTrash title='Eliminar' className="w-4 h-4 text-red-500" onClick={() => deleteFarmaco(farmaco._id)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-black text-left p-2">
                                    Aún no se han agregado fármacos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Farm patient={pacienteData} openModal={isModalOpen} setOpenModal={setIsModalOpen} />
        </div>
    );
};

export default VistaPaciente;
