import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons"; // Para el punto indicador

const LocationAndModality = () => {
    return (
        <div className="flex items-center gap-6">
            {/* Marcador de ubicación */}
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" width={20} />
                <p className="text-white">Montevideo</p>
            </div>

            {/* Indicador de modalidad (presencial o virtual) */}
            <div className="flex items-center gap-2">
                <FontAwesomeIcon
                    icon={faCircle} // Indicador de modalidad
                    className="text-green-500" // Color para modalidad presencial
                    width={10}
                />
                <p className="text-white">Presencial</p>
            </div>

            {/* Si es virtual, puedes cambiar el color */}
            {/* <div className="flex items-center gap-2">
                <FontAwesomeIcon
                    icon={faCircle}
                    className="text-blue-500" // Color para modalidad virtual
                    width={10}
                />
                <p className="text-white">Virtual</p>
            </div> */}
        </div>
    );
};

export default LocationAndModality;
