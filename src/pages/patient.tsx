import React, { useEffect, useState } from 'react';
import Resources from './resources';
import { useNavigate, useParams } from 'react-router-dom';
import ChartOne from '@/components/Charts/ChartOne';
import { API_LOCAL } from '@/hooks/apis';
import SharedResources from './shared_resources';

// Tipos de datos
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

type Paciente = {
    _id: string;
    id?: string;
    name: string;
    age: number;
    gender: "masculino" | "femenino";
    email: string;
    phone: string;
    sessions: Sesion[];
    materialesBrindados: Material[];
    notasAdicionales: string;
};



interface ApiResponse {
    data: Paciente[];
}

const VistaPaciente: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>()
    const [loading, setLoading] = useState<boolean>(true);
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
                const response = await fetch(`${API_LOCAL}/get-patient-byid/${patientId}`, {
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
    console.log(sesionesPaginadas)
    return (
        <div className="bg-white p-6 rounded-lg border">
            <h1 className="text-2xl font-bold mb-4">Información del paciente</h1>
            <p>Nombre: <strong>{pacienteData.name}</strong></p>
            <p>Edad:  <strong>{pacienteData.age}</strong></p>
            <p>Teléfono:  <strong>{pacienteData.phone}</strong></p>
            <p>Email:  <strong>{pacienteData.email}</strong></p>
            <p>Genero:  <strong>{pacienteData.gender}</strong></p>
            <div className="mb-6">
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
                        {sesionesPaginadas?.map((sesion, index) => (
                            <tr key={index} className="border" onClick={() => navigate(`/patients/${patientId}/${sesion._id}`)}>
                                <td className="border p-2">{sesion.date}</td>
                                <td className="border p-2">{sesion.reason}</td>
                                <td className="border p-2">{sesion.time}</td>

                                <td className="border p-2">{sesion.modality}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ChartOne />
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Materiales brindados</h2>
                <SharedResources patient={patient} />
            </div>
        </div>
    );
};

export default VistaPaciente;
