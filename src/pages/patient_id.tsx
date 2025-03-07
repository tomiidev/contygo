import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_LOCAL, API_URL } from "@/hooks/apis";
import SessionLayout from "./session_layout";

// Tipos de datos
interface Note {  // Definí el tipo 'Note'
    _id?: string;
    id: string;
    note: string;
    createdAt: number;
}

interface Sesion {
    _id: string;
    id: string;
    date: string;
    especialista: string;
    modality: string;
    duration: string;
    notes: Note[]; // Cambié esta parte para que 'notes' sea un array de objetos de tipo 'Note'
    time: string;
    reason: string;
    recomendaciones: string;
    materiales: string[];
}


const VistaSesion: React.FC = () => {
    const [session, setSession] = useState<Sesion | null>(null);
    const [note, setNote] = useState<Note>({ id: "", note: "", createdAt: 0 });
    const [notes, setNotes] = useState<Note[]>([]); // Cambié el tipo aquí también
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { sessionId } = useParams<{ sessionId: string }>();
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
    const [modalValue, setModalValue] = useState<string>("");

    useEffect(() => {
        const obtenerSesion = async () => {
            try {
                const response = await fetch(`${API_URL}/get-session-byid/${sessionId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    mode: "cors",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Error al obtener la sesión");
                const result = await response.json();
                setSession(result.data[0]);
                setNotes(result.data[0]?.notes || []); // Asegúrate de asignar las notas de la sesión
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        obtenerSesion();
    }, [sessionId]);

/*     const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote((prevNote) => ({
            ...prevNote,
            note: event.target.value,
        }));
    };
 */
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote((prevNote) => ({
            ...prevNote,
            _id: "  ", // Asegura que _id se mantenga
            note: event.target.value,
            createdAt: Date.now(),
        }));
    };
    
    const handleDelete = (index?: string) => {
        if (!index) return; // Evita eliminar si no hay un ID válido
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== index));
    };

    /* const closeModal = () => setIsModalOpen(null); */

    const saveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(notes)
        try {
            const response = await fetch(`${API_URL}/insert-session-notes/${sessionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                mode: "cors",
                body: JSON.stringify({ note: note, idSession: sessionId, notes: notes }), // Guarda las notas actualizadas
                credentials: "include",
            });

            if (!response.ok) throw new Error("Error al actualizar la sesión");

            window.location.reload();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando sesión...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!session) return <p>No se encontró la sesión</p>;

    return (
        <div className="bg-white p-8 rounded-lg border space-y-8">
            <h1 className="text-lg font-bold text-gray-800 mb-8">Detalles de la sesión</h1>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                {Object.entries({
                    "Fecha": session.date,
                    "Modalidad": session.modality,
                    "Duración": `${session.duration} min.`,
                    "Hora": session.time,
                    "Motivo de sesión": session.reason,
                }).map(([label, value]) => (
                    <p key={label} className="text-sm text-gray-700">
                        <strong>{label}:</strong> {value}
                    </p>
                ))}
            </div>

            <SessionLayout note={note} notes={notes} handleChange={handleChange} handleDelete={handleDelete} />

            <div className="flex justify-end">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700" onClick={saveChanges}>
                    Guardar cambios
                </button>
            </div>

            {/*   {isModalOpen && (
                <Modal title={`Editar ${isModalOpen}`} value={modalValue} onSave={saveChanges} onClose={closeModal} setValue={setModalValue} />
            )} */}
        </div>
    );

};

export default VistaSesion;
