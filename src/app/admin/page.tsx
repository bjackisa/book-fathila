"use client";

import { useState, FormEvent } from "react";

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
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-brand-pink focus:border-brand-pink"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-brand-pink focus:border-brand-pink"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-90"
        >
          Block Slot
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </main>
  );
}
