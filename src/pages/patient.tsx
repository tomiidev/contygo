import React, { useState } from 'react';
import Resources from './resources';
import { useNavigate } from 'react-router-dom';
import ChartOne from '@/components/Charts/ChartOne';
import { API_LOCAL } from '@/hooks/apis';

// Tipos de datos
type Sesion = {
    fecha: string;
    descripcion: string;
    duracion: string;
    nota: string;
};

type Material = {
    tipo: string;
    descripcion: string;
    fechaEntrega: string;
};

type Paciente = {
    nombre: string;
    edad: number;
    email: string;
    telefono: string;
    sesiones: Sesion[];
    materialesBrindados: Material[];
    notasAdicionales: string;
};

const sesionesEjemplo: Sesion[] = Array.from({ length: 50 }, (_, i) => ({
    fecha: `2025-02-${String(i + 1).padStart(2, '0')}`,
    descripcion: `Sesión ${i + 1}: Seguimiento clínico`,
    duracion: '60 minutos',
    nota: `Notas de la sesión ${i + 1}`
}));

const pacienteData: Paciente = {
    nombre: 'Juan Pérez',
    edad: 30,
    email: 'juan.perez@mail.com',
    telefono: '+34 123 456 789',
    sesiones: sesionesEjemplo,
    materialesBrindados: [
        {
            tipo: 'Folleto',
            descripcion: 'Estrategias para el manejo de la ansiedad.',
            fechaEntrega: '2025-01-10'
        },
        {
            tipo: 'Audiolibro',
            descripcion: 'Mindfulness para principiantes.',
            fechaEntrega: '2025-01-15'
        }
    ],
    notasAdicionales: 'Paciente tiene una historia familiar con trastornos de ansiedad, lo que requiere un seguimiento cercano.'
};

const VistaPaciente: React.FC = () => {
    const navigate = useNavigate();
    const [pagina, setPagina] = useState(1);
    const sesionesPorPagina = 5;
    const totalPaginas = Math.ceil(pacienteData.sesiones.length / sesionesPorPagina);

    const sesionesPaginadas = pacienteData.sesiones.slice(
        (pagina - 1) * sesionesPorPagina,
        pagina * sesionesPorPagina
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerarDiagrama = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_LOCAL}/generar-diagrama`, { // Aquí va la URL de tu API backend
                method: 'POST', // O POST si pasas algún dato,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Enviar cookies HTTP-only automáticamente
                mode: 'cors',
            });

            if (response.ok) {
                // Obtener el archivo generado
                const blob = await response.blob();

                // Crear un enlace para la descarga
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'diagrama.png'; // Nombre del archivo descargado
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Información del paciente</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p><strong>Nombre:</strong> {pacienteData.nombre}</p>
                    <p><strong>Edad:</strong> {pacienteData.edad}</p>
                    <p><strong>Email:</strong> {pacienteData.email}</p>
                    <p><strong>Teléfono:</strong> {pacienteData.telefono}</p>
                </div>
                <div className="flex justify-end items-start">
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded flex items-center"
                        onClick={handleGenerarDiagrama}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                {/* Spinner con CSS */}
                                <div className="spinner-border animate-spin w-4 h-4 mr-2 border-t-2 border-white rounded-full"></div>
                                Generando...
                            </>
                        ) : (
                            'Generar diagrama'
                        )}
                    </button>

                </div>
            </div>


            {/* Lista de Sesiones con paginación */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Sesiones</h2>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Fecha</th>
                            <th className="border p-2">Descripción</th>
                            <th className="border p-2">Duración</th>
                            <th className="border p-2">Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sesionesPaginadas.map((sesion, index) => {
                            const globalIndex = (pagina - 1) * sesionesPorPagina + index; // Índice real en el array original

                            return (
                                <tr key={globalIndex} className="border">
                                    <td className="border p-2">{sesion.fecha}</td>
                                    <td className="border p-2">{sesion.descripcion}</td>
                                    <td className="border p-2">{sesion.duracion}</td>
                                    <td className="border p-2">{sesion.nota}</td>
                                    <td className="border p-2">
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                            onClick={() => navigate(`/patients/${pacienteData.nombre}/${globalIndex}`)}
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded mr-2 disabled:opacity-50"
                        onClick={() => setPagina(pagina - 1)}
                        disabled={pagina === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2">Página {pagina} de {totalPaginas}</span>
                    <button
                        className="px-4 py-2 bg-gray-200 rounded ml-2 disabled:opacity-50"
                        onClick={() => setPagina(pagina + 1)}
                        disabled={pagina === totalPaginas}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            <div className="my-10">
                <ChartOne />
            </div>
            {/* Lista de Materiales Brindados */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Materiales brindados</h2>
                <Resources />
            </div>
        </div>
    );
};

export default VistaPaciente;