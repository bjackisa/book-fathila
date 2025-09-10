"use client";

import { useState, FormEvent } from "react";
import { CalendarDaysIcon, ClockIcon, LockClosedIcon } from "@heroicons/react/24/outline";

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
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg">
        <img
          src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
          alt="Fathila Nanozi"
          width={80}
          height={80}
          className="rounded-full mb-4 mx-auto"
        />
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-pink" />
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 mt-1 w-full p-2 bg-white dark:bg-neutral-800 border border-brand-pink rounded-md focus:ring-brand-pink focus:border-brand-pink"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="time" className="block text-sm font-medium">
              Time
            </label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-pink" />
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 mt-1 w-full p-2 bg-white dark:bg-neutral-800 border border-brand-pink rounded-md focus:ring-brand-pink focus:border-brand-pink"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-brand-pink text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-pink/90 transition-colors"
          >
            <LockClosedIcon className="w-5 h-5" />
            Block Slot
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </main>
  );
}
