"use client";

import { useState, FormEvent } from "react";
import { ShieldCheckIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error blocking slot");
      }
      setMessage("Slot blocked successfully.");
      setDate("");
      setTime("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`Failed to block slot: ${message}`);
    }
  };

    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <img
          src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
          alt="Fathila Nanozi"
          width={80}
          height={80}
          className="rounded-full mb-4"
        />
        <div className="card w-full max-w-sm">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-brand-pink mr-2" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <div className="relative mt-1">
                <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-pink" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">
                Time
              </label>
              <div className="relative mt-1">
                <ClockIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-pink" />
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full pl-10 rounded-md border border-brand-pink bg-white dark:bg-neutral-900 focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary">
              Block Slot
            </button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      </main>
    );
}
