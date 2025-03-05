
import Loader from '@/common/Loader';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
interface Paciente {
  id: string;
  _id: string;
  name: string;
  age: number;
  email: string
  gender: 'masculino' | 'femenino';
  phone: string;
  message: string;
}
/* interface Send {
  patientName: string;
  subject: string;
  message: string;
} */
interface SharedResourcesProps {
  patients: Paciente[];
  isSharing: boolean;
  /*   send: Send; */
  selectedPatient: Paciente | null;
  setSelectedPatient: (patient: Paciente | null) => void;
  handleShareResource: (e: React.FormEvent) => void;
  handleCloseShareModal: () => void;
  handleChangeSend: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const FormLayout: React.FC<SharedResourcesProps> = ({ isSharing, handleCloseShareModal, patients, selectedPatient, handleShareResource, setSelectedPatient, handleChangeSend }) => {
  console.log(isSharing)
  return (

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 w-96">
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Compartir recurso (por email)
            </h3>
          </div>
          <form action="#">
            <div className="p-6.5">
              <SelectGroupOne patients={patients} selectedPatient={selectedPatient} handleChangeSend={handleChangeSend} setSelectedPatient={setSelectedPatient} />




              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Asunto
                </label>
                <input
                  type="text"
                  name='subject'
                  required
                  onChange={handleChangeSend}
                  placeholder="Asunto"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* <SelectGroupOne patients={patients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient}/> */}

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white" >
                  Mensaje
                </label>
                <textarea
                  required
                  onChange={handleChangeSend}
                  rows={6}
                  name='message'
                  placeholder="Escribí tu mensaje"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button onClick={(e) => {
                if (selectedPatient) {
                  handleShareResource(e);  // Llamar explícitamente a handleShareResource
                }
              }}
                disabled={!selectedPatient || isSharing} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                {isSharing ? (
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                ) : (
                  'Enviar email'
                )}
              </button>
              <button onClick={handleCloseShareModal} className="flex w-full justify-center rounded mt-5 p-3 font-medium text-black underline hover:bg-opacity-90">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>

  );
};

export default FormLayout;
