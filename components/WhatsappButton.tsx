"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const phoneNumber = "918870002908";

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}