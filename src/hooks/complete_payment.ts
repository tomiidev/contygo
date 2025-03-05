import { useEffect } from "react";
import { API_URL } from "./apis";

interface PaymentData {
  collection_id: string | null;
  collection_status: string | null;
  payment_id: string | null;
  status: string | null;
  external_reference: string | null;
  payment_type: string | null;
  merchant_order_id: string | null;
  preference_id: string | null;
  site_id: string | null;
  processing_mode: string | null;
  merchant_account_id: string | null;
}

const RegisterPayment: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentData: PaymentData = {
      collection_id: urlParams.get("collection_id"),
      collection_status: urlParams.get("collection_status"),
      payment_id: urlParams.get("payment_id"),
      status: urlParams.get("status"),
      external_reference: urlParams.get("external_reference"),
      payment_type: urlParams.get("payment_type"),
      merchant_order_id: urlParams.get("merchant_order_id"),
      preference_id: urlParams.get("preference_id"),
      site_id: urlParams.get("site_id"),
      processing_mode: urlParams.get("processing_mode"),
      merchant_account_id: urlParams.get("merchant_account_id"),
    };

    if (paymentData.payment_id) {
      console.log("Enviando datos al backend:", paymentData);

      fetch(`${API_URL}/register-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Pago registrado exitosamente");
          } else {
            console.error("Error al registrar el pago");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  }, []);

  return null;
};

export default RegisterPayment;
