"use client";

import { useState } from "react";

export const UserDetailsForm = ({
  service,
  onSubmit,
}: {
  service: string;
  onSubmit: (details: { name: string; phone: string; email: string }) => void;
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      onSubmit({ name, phone, email });
    } else {
      alert("Please fill in your name and phone number.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Enter your details for {service}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          Next
        </button>
      </form>
    </div>
  );
};
