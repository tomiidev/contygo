import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Resources from './resources';
import { API_LOCAL } from '@/hooks/apis';

// Tipos de datos
type Sesion = {
    _id: string;
    fecha: string;
    especialista: string;
    tipo: string;
    duracion: string;
    nota: string;
    evolucion: string;
    recomendaciones: string;
    materiales: string[];
};



interface ApiResponse {
    data: Sesion[];
}

const VistaSesion: React.FC = () => {
    const [session, setSession] = useState<Sesion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { sessionId } = useParams<{ sessionId: string }>();
    const [isModalOpen, setIsModalOpen] = useState<Record<string, boolean>>({});

    // Obtener la sesión cuando cambia sessionId
    useEffect(() => {
        const obtenerSesion = async (): Promise<void> => {
            try {
                const response = await fetch(`${API_LOCAL}/get-session-byid/${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Error al obtener la sesión');
                const result: ApiResponse = await response.json();
                if (Array.isArray(result.data)) {
                    setSession(result.data[0]); // Asigna solo el primer paciente

                } else {
                    throw new Error('Los datos de las citas no están en el formato esperado');
                };
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        obtenerSesion();
    }, [sessionId]);

    const toggleModal = (modal: string) => {
        setIsModalOpen(prev => ({ ...prev, [modal]: !prev[modal] }));
    };

    const guardarCambios = () => {
        alert('Cambios guardados con éxito');
    };

    if (loading) return <p>Cargando sesión...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!session) return <p>No se encontró la sesión</p>;

    return (
        <div className="bg-white p-8 rounded-lg border space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Detalles de la sesión</h1>

            {/* Datos Generales de la sesión */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {['date', 'time', 'nombre', 'reason'].map((field) => (
                        <p key={field} className="text-lg text-gray-700 mb-2">
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                            <span
                                onClick={() => toggleModal(field)}
                                className="text-indigo-700 cursor-pointer hover:underline"
                            >
                                {session[field as keyof Sesion]}
                            </span>
                        </p>
                    ))}
                </div>
            </div>
                <div className="bg-gray-50 p-6 rounded-lg  border border-gray-200">
                    <h3 className="font-semibold text-xl text-gray-800">Resumen:</h3>
                    {['evolucion', 'recomendaciones'].map((field) => (
                        <p key={field} className="text-lg text-gray-700 mb-2">
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                            <span
                                onClick={() => toggleModal(field)}
                                className="text-indigo-700 cursor-pointer hover:underline"
                            >
                                {session[field as keyof Sesion]}
                            </span>
                        </p>
                    ))}
                </div>

          

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mb-8">
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    onClick={guardarCambios}
                >
                    Guardar Cambios
                </button>
            </div>

            {/* Modales de edición */}
            {Object.keys(isModalOpen).map((modal) =>
                isModalOpen[modal] ? (
                    <Modal
                        key={modal}
                        title={`Editar ${modal.charAt(0).toUpperCase() + modal.slice(1)}`}
                        value={session[modal as keyof Sesion]}
                        onSave={(newValue) => {
                            setSession({ ...session, [modal]: newValue });
                            toggleModal(modal);
                        }}
                        onClose={() => toggleModal(modal)}
                    />
                ) : null
            )}
        </div>
    );
};

// Componente Modal
const Modal = ({ title, value, onSave, onClose }: { title: string; value: string; onSave: (newValue: string) => void; onClose: () => void }) => {
    const [inputValue, setInputValue] = useState(value);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 transition-all">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
                <textarea
                    className="w-full p-4 border-2 rounded-lg text-gray-700"
                    rows={6}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-4 hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={() => onSave(inputValue)}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VistaSesion;
