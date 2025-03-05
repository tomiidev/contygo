import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Note {
  _id?: string;
  id: string;
  note: string;
  createdAt: number;
}

interface SessionLayoutProps {
  note: Note; // Ahora es un objeto
  notes: Note[]; // Array de notas previas
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDelete: (index?: string) => void;
}


const SessionLayout: React.FC<SessionLayoutProps> = ({ note, handleChange, notes, handleDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black text-sm dark:text-white">
              Notas durante la sesión
            </h3>
          </div>
          {/* 🔹 Mostrar notas previas */}
          <div className="max-h-60 overflow-y-auto">
            {notes.length > 0 ? (
              notes.map((n) => (
                <div key={n._id} className="flex justify-between border-b border-stroke py-3 px-6.5 dark:border-strokedark">
                  <p className="text-sm dark:text-white">{n.note}</p>
                  <FontAwesomeIcon title="Eliminar" icon={faClose} width={15} className="cursor-pointer" onClick={() => handleDelete(n._id)} />
                </div>
              ))
            ) : (
              <p className="text-sm px-6.5 py-3 text-gray-500 dark:text-gray-400">
                Aún no hay notas registradas.
              </p>
            )}
          </div>
          {/* Área para escribir una nota */}
          <div className="p-6.5">
            <textarea
              rows={6}
              value={note.note} // Mostrar la nota actual
              placeholder="Escribí tus apuntes de la sesión acá"
              onChange={handleChange} // Manejar cambios en la nota
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionLayout;
