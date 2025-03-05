import React, { useState } from 'react';
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
interface SharedResourcesProps {
  patients: Paciente[];
  selectedPatient: Paciente | null;
  setSelectedPatient: (patient: Paciente | null) => void; // Permitir null
  handleChangeSend: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const SelectGroupOne: React.FC<SharedResourcesProps> = ({ patients, handleChangeSend }) => {
  return (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">

        Nombre
      </label>

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select

          name='patient'
          onChange={handleChangeSend}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
        >
          <option value="">Seleccione un paciente</option>
          {patients && patients.length > 0 && patients.map((patient) => (
            <option value={patient._id} key={patient._id} className={`p-2 rounded cursor-pointer`}>

              {patient.name}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div >
  );
};

export default SelectGroupOne;
