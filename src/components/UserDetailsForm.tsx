"use client";

import { useState, FormEvent } from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

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
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Enter your details for {service}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg"
      >
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-pink" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 mt-1 block w-full p-2 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink sm:text-sm transition-colors"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone / WhatsApp Number
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-pink" />
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 mt-1 block w-full p-2 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink sm:text-sm transition-colors"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email (Optional)
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-pink" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 mt-1 block w-full p-2 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink sm:text-sm transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 p-3 bg-brand-pink text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-pink/90 transition-colors"
        >
          Next
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
