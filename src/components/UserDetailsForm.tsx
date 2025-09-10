"use client";

import { useState, FormEvent } from "react";

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      onSubmit({ name, phone, email });
    } else {
      alert("Please fill in your name and phone number.");
    }
  };

  return (
    <div className="w-full max-w-md card">
      <h2 className="text-2xl font-bold text-center mb-6">
        Enter your details for {service}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full h-10 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink text-sm px-3"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full h-10 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink text-sm px-3"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full h-10 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink text-sm px-3"
          />
        </div>
        <button type="submit" className="w-full mt-6 btn-primary">
          Next
        </button>
      </form>
    </div>
  );
};
