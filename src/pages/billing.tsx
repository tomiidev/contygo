import Loader from "@/common/Loader";
import { API_LOCAL, API_URL } from "@/hooks/apis";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { BsDownload, BsShare } from "react-icons/bs";
import { Link } from "react-router-dom";

interface Buyer {
  email: string
  name: string,
  date: string
}

interface Payment {
  id?: string;
  _id?: string;
  patientId: string;
  name: string;
  buyer: Buyer;
  descriptor: string;
  modality: string;
  sessions: string
  date: number;
  path: string;
  price: string;

}

interface ApiResponse {
  data: Payment[];
}
interface ApiResponsePatients {
  data: Paciente[];
}
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

const Billing = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${paymentLink}`)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);  // Reset the animation after 1 second
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const formatMongoDate = (mongoDate: number): string => {
    const date = new Date(mongoDate);
    const day = date.getDate().toString().padStart(2, "0"); // Agrega un "0" si es necesario
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Enero es 0 en JS
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [patients, setPatients] = useState<Paciente[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-payments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener pacientes');
        const result: ApiResponse = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setPayments(result.data); // Asignamos los pacientes al estado
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
        const result: ApiResponsePatients = await response.json();

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
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSharing, setIsSharing] = useState(false); // Estado para manejar la carga

  const handleShareClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setSelectedPayment(null);
    setShareModalOpen(false);
  };

  useEffect(() => {
    const obtenerRecursos = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-payments`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener los recursos");

        const result: ApiResponse = await response.json();

        if (result.data && Array.isArray(result.data)) {
          setPayments(result.data);
        } else {
          throw new Error("Los datos recibidos no tienen el formato esperado");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    obtenerRecursos();
  }, []);

  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState<Payment>({
    patientId: "", buyer: {
      email: "",
      name: "",
      date: "",
    }, name: "", sessions: "", descriptor: "", modality: "", date: Date.now(), path: "", price: ""
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setPayment({
      patientId: "", name: "", buyer: {
        email: "",
        name: "",
        date: "",
      }, sessions: "", descriptor: "", modality: "", date: Date.now(), path: "", price: ""
    });
    setPaymentLink("")
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };




  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payment.name || !payment.descriptor || !payment.sessions) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newPayment = {
      _id: payment._id,
      id: payment.id,
      patientId: payment.patientId,
      name: payment.name,
      buyer: payment.buyer,

      sessions: payment.sessions,
      descriptor: payment.descriptor,
      modality: payment.modality,
      date: payment.date,
      price: payment.price,
      path: payment.path,
    }
    setPayments((prev) => [...prev, newPayment]);
    await uploadPayment(payment);
    /* handleClose(); */
  };

  const handleDeleteResource = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };



  const uploadPayment = async (payment: Payment): Promise<void> => {
    try {

      const formData = {
        _id: String(payment._id),
        id: String(payment.id),
        patientId: payment.patientId,
        patientName: payment.name,
        sessions: payment.sessions,
        descriptor: payment.descriptor,
        modality: payment.modality,
        date: String(payment.date),
        path: payment.path,
        price: payment.price,
      };

      console.log(payment)
      const response = await fetch(`${API_URL}/upload-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: formData }),
        mode: "cors",
        credentials: "include", // Si necesitas enviar cookies
      });

      if (!response.ok) {
        throw new Error("Error al subir el recurso");
      }

      const result = await response.json();
      setPaymentLink(result.sandbox_init_point)
      console.log("pago subido:", result);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };








  const handleShareResource = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificamos que ambos estén seleccionados
    if (!selectedPatient || !selectedPayment) {
      console.error("Paciente o recurso no seleccionado");
      return;
    }
    setIsSharing(true); // Inicia la carga
    // Llamamos a la función para compartir el recurso con el paciente
    try {
      await handleShare(selectedPatient, selectedPayment); // Llama a la función que maneja la compartición
      setSelectedPatient(null)
      setSelectedPayment(null)
    } catch (error) {
      console.error("Error al compartir recurso", error);
    } finally {
      setIsSharing(false); // Finaliza la carga
    }
    handleCloseShareModal(); // Cerramos el modal
  };

  const handleShare = async (patient: Paciente, payment: Payment): Promise<void> => {
    try {
      const response = await fetch(`${API_LOCAL}/share-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient, payment }), // Solo enviamos los IDs
        mode: "cors",
        credentials: "include", // Si necesitas enviar cookies
      });

      if (!response.ok) {
        throw new Error("Error al compartir el recurso");
      }

      const result: ApiResponse = await response.json();


      if (result.data && Array.isArray(result.data)) {
      } else {
        throw new Error("Los datos recibidos no tienen el formato esperado");
      }
      alert("Recurso compartido");
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  console.log(payments)
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Pagos</h2>
        <button
          onClick={handleOpen}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear link de pago
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : payments.length === 0 ? (
        <p className="text-center">No hay pagos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="p-3 border border-gray-200 dark:border-gray-700">Paciente</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">N° Sesiones</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">Modalidad</th>

                <th className="p-3 border border-gray-200 dark:border-gray-700">Fecha</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments?.length > 0 ? payments?.map((p, index) => (
                <tr key={index} className="border border-gray-200 dark:border-gray-700">
                  <td className="p-3">{p.buyer.name}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">{p.modality}</td>


                  <td className="p-3">{formatMongoDate(p.date)}</td>
                  <td className="p-3 flex space-x-3 items-center">
                    {/*  <a href={`https://contygo.s3.us-east-2.amazonaws.com/67a78dc1a0d27dd1623ec869/${resource.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      🔗 Ver
                    </a> */}
                    <a href={`https://contygo.s3.us-east-2.amazonaws.com/67a78dc1a0d27dd1623ec869/${p.path}`} download title="Descargar" className="text-green-600 hover:underline">
                      <BsDownload className="w-4 h-4" />
                    </a>

                    <button onClick={() => handleDeleteResource(index)} title="Eliminar" className="text-red-600 hover:underline">
                      🗑️
                    </button>
                    <button onClick={() => handleShareClick(p)} title="Compartir" className="text-blue-600 hover:underline">
                      <BsShare className="w-5 h-5" />
                    </button>


                  </td>
                </tr>
              )): <p className="font-questrial">No hay pagos.</p>}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 flex flex-wrap items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Crear link de pago</h3>

            <label className="block mb-2">Paciente</label>
            <select name="patientName" value={selectedPatient?.name} onChange={handleChange} className="w-full p-2 mb-3 border border-gray-300 rounded-lg">
              <option value="">Selecciona un paciente</option>
              {patients.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>

            <label className="block mb-2">N° de sesiones</label>
            <input type="text" placeholder="N° de sesiones" name="sessions" onChange={handleChange} className="w-full p-2 mb-3 border border-gray-300 rounded-lg" />

            <label className="block mb-2">Precio (por sesión)</label>
            <input type="text" placeholder="Precio" onChange={handleChange} name="price" className="w-full p-2 mb-3 border border-gray-300 rounded-lg" />

            <label className="block mb-2">Nombre que aparecera en la factura</label>
            <input type="text" placeholder="Mi negocio" onChange={handleChange} name="descriptor" className="w-full p-2 mb-3 border border-gray-300 rounded-lg" />

            {/* Contenedor con overflow para evitar que el texto sobresalga */}
            {
              paymentLink &&
              <>
                <p className="text-sm font-semibold mb-2">Link para enviar al paciente:</p>
                <div className="w-full overflow-hidden mb-10">

                  <div className="relative w-full">
                    <input
                      type="text"
                      value={`${paymentLink}`}
                      readOnly
                      className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm font-semibold "
                    />
                    {/* Icono dentro del input a la izquierda */}
                    <button
                      onClick={handleCopy}
                      className={`absolute left-2 top-1/2 bottom-0 transform -translate-y-1/2 text-gray-500 transition-all duration-200 ${copySuccess ? 'text-green-500 animate-pulse' : ''}`}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>
                </div>
              </>
            }


            <div className="flex justify-end space-x-3">
              <button onClick={handleClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                Cerrar
              </button>
              <button onClick={handleAddPayment} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Crear
              </button>
            </div>
          </div>
        </div>

      )
      }
      {
        shareModalOpen && selectedPayment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Enviar la factura {selectedPatient?._id} a {selectedPayment.name}</h3>

              {patients.length === 0 ? (
                <p className="text-gray-500">Cargando pacientes...</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 p-2 rounded-md">
                  {patients.map((patient) => (
                    <li
                      key={patient._id}
                      className={`p-2 rounded cursor-pointer ${selectedPatient === patient ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      {patient.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <button onClick={handleCloseShareModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    if (selectedPatient) {
                      handleShareResource(e);  // Llamar explícitamente a handleShareResource
                    }
                  }}
                  disabled={!selectedPatient || isSharing}
                  className={`px-4 py-2 rounded-lg ${selectedPatient ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                >
                  Compartir
                </button>


              </div>
            </div>
          </div>
        )
      }


    </div >
  )
}
export default Billing;
