"use client";

import { useState, FormEvent } from "react";
import { User, Phone, Mail } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto surface animate-slide-up">
      <h2 className="text-2xl font-bold text-center mb-6">Enter your details for {service}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-win-blue/70 group-focus-within:text-win-blue" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-9"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone / WhatsApp Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-win-blue/70 group-focus-within:text-win-blue" />
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field pl-9"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email (Optional)
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-win-blue/70 group-focus-within:text-win-blue" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>
        <button type="submit" className="w-full mt-6 btn-accent">
          Next
        </button>
      </form>
    </div>
  );
};
