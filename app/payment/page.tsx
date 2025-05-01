"use client";

import { useState } from "react";
import PaymentForm from "@/components/ui/paymentform";
import PaymentSimulation from "@/components/ui/PaymentSimulation";

export default function PaymentPage() {
  const [isApproved, setIsApproved] = useState(false);

  const handlePaymentSubmit = (formData: {
    name: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    acceptRemotePayment: boolean;
  }) => {
    console.log("Form Verileri:", formData);

    // Ödeme simülasyonu
    const paymentData = {
      customerName: formData.name,
      events: [
        { title: "Konser", price: 150 },
        { title: "Tiyatro", price: 100 },
      ],
    };

    PaymentSimulation(paymentData, true, (approved) => {
      setIsApproved(approved);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Ödeme Sayfası</h1>
      <PaymentForm onSubmit={handlePaymentSubmit} />
      {isApproved && (
        <p className="mt-4 text-green-600 font-semibold">
          Ödeme başarılı! Mail içeriği konsola yazdırıldı.
        </p>
      )}
    </div>
  );
}