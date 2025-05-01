"use client";

import { useState } from "react";

interface PaymentFormProps {
  onSubmit: (formData: {
    name: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    acceptRemotePayment: boolean;
  }) => void;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    acceptRemotePayment: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      // Sadece harfler ve boşluk kabul edilir, tüm harfler büyük harfe çevrilir
      const formattedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "cardNumber") {
      // Sadece sayılar kabul edilir, her 4 haneden sonra "-" eklenir
      const formattedValue = value
        .replace(/[^0-9]/g, "") // Sadece sayılar
        .replace(/(.{4})/g, "$1-") // Her 4 haneden sonra "-"
        .slice(0, 19); // Maksimum 16 hane + 3 "-"
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "expiry") {
      // Sadece sayılar kabul edilir, 2 haneden sonra "/" eklenir
      const formattedValue = value
        .replace(/[^0-9]/g, "") // Sadece sayılar
        .replace(/(.{2})/, "$1/") // İlk 2 haneden sonra "/"
        .slice(0, 5); // Maksimum 5 karakter (AA/YY)
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "cvc") {
      // Sadece sayılar kabul edilir, maksimum 3 hane
      const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Uzaktan ödeme kabul edilmezse hata mesajı göster
    if (!formData.acceptRemotePayment) {
      setErrorMessage("Ödeme onaylanmadı. Uzaktan ödeme kabul etmelisiniz.");
      return;
    }

    // Son kullanma tarihi doğrulaması
    const [month, year] = formData.expiry.split("/").map(Number);
    if (month < 1 || month > 12 || year < 25) {
      setErrorMessage("Son kullanma tarihi geçersiz.");
      return;
    }

    setErrorMessage(""); // Hata mesajını temizle
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ödeme Bilgileri</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Kart Üstündeki İsim</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Kart Numarası</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Son Kullanma Tarihi (AA/YY)</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">CVC</label>
          <input
            type="text"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="acceptRemotePayment"
            checked={formData.acceptRemotePayment}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Uzaktan ödeme kabul ediyorum</span>
        </label>
      </div>
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {formData.acceptRemotePayment ? "Ödeme Başarılı" : "Öde"}
      </button>
    </form>
  );
}
