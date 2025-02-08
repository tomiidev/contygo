import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Tipos de datos
type Sesion = {
    fecha: string;
    especialista: string;
    tipo: string;
    duracion: string;
    nota: string;
    evolucion: string;
    recomendaciones: string;
    materiales: string[];
};

type Paciente = {
    nombre: string;
    sesiones: Sesion[];
};

const sesionesEjemplo: Sesion[] = Array.from({ length: 10 }, (_, i) => ({
    fecha: `2025-02-${String(i + 1).padStart(2, '0')}`,
    especialista: 'Dr. Juan Pérez',
    tipo: 'Seguimiento clínico',
    duracion: '60 minutos',
    nota: `Notas de la sesión ${i + 1}`,
    evolucion: `Evolución del paciente sesión ${i + 1}`,
    recomendaciones: `Recomendaciones para la sesión ${i + 1}`,
    materiales: ['Folleto de ansiedad', 'Ejercicios de relajación']
}));

const pacienteData: Paciente = {
    nombre: 'Carlos Gómez',
    sesiones: sesionesEjemplo
};

const VistaSesion: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const sessionIndex = Number(sessionId);
    
    if (isNaN(sessionIndex) || sessionIndex < 0 || sessionIndex >= pacienteData.sesiones.length) {
        return <p className="text-red-500">Sesión no encontrada</p>;
    }

    const sesionActual = pacienteData.sesiones[sessionIndex];
    const [notaSesion, setNotaSesion] = useState(sesionActual.nota);
    const [evolucion, setEvolucion] = useState(sesionActual.evolucion);
    const [recomendaciones, setRecomendaciones] = useState(sesionActual.recomendaciones);
    const [materiales, setMateriales] = useState(sesionActual.materiales);
    const [nuevoMaterial, setNuevoMaterial] = useState('');

    const guardarCambios = () => {
        sesionActual.nota = notaSesion;
        sesionActual.evolucion = evolucion;
        sesionActual.recomendaciones = recomendaciones;
        sesionActual.materiales = materiales;
        alert('Cambios guardados con éxito');
    };

    const agregarMaterial = () => {
        if (nuevoMaterial.trim()) {
            setMateriales([...materiales, nuevoMaterial]);
            setNuevoMaterial('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Información de la sesión</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p><strong>Fecha:</strong> {sesionActual.fecha}</p>
                    <p><strong>Duración:</strong> {sesionActual.duracion}</p>
                </div>
                <div>
                    <p><strong>Especialista:</strong> {sesionActual.especialista}</p>
                    <p><strong>Tipo de sesión:</strong> {sesionActual.tipo}</p>
                </div>
            </div>

            <div className="mb-6 bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Notas de la sesión</h2>
                <textarea className="w-full p-2 border rounded" rows={4} value={notaSesion} onChange={e => setNotaSesion(e.target.value)} />
            </div>

            <div className="mb-6 bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Evolución del paciente</h2>
                <textarea className="w-full p-2 border rounded" rows={4} value={evolucion} onChange={e => setEvolucion(e.target.value)} />
            </div>

            <div className="mb-6 bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Recomendaciones y próximos pasos</h2>
                <textarea className="w-full p-2 border rounded" rows={4} value={recomendaciones} onChange={e => setRecomendaciones(e.target.value)} />
            </div>

            <div className="mb-6 bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Materiales brindados</h2>
                <ul>
                    {materiales.map((mat, index) => (
                        <li key={index} className="border-b py-1">{mat}</li>
                    ))}
                </ul>
                <input
                    type="text"
                    className="w-full p-2 border rounded mt-2"
                    placeholder="Agregar nuevo material"
                    value={nuevoMaterial}
                    onChange={(e) => setNuevoMaterial(e.target.value)}
                />
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={agregarMaterial}>Agregar</button>
            </div>

            <div className="flex space-x-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={guardarCambios}>Guardar Cambios</button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded">Generar Diagrama</button>
            </div>
        </div>
    );
};

export default VistaSesion;
