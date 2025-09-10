"use client";

import { useState, FormEvent } from "react";
import { Calendar as CalendarIcon, Clock, Shield } from "lucide-react";

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
    <main className="space-y-10">
      <img
        src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
        alt="Fathila Nanozi"
        width={80}
        height={80}
        className="rounded-full mx-auto"
      />
      <div className="card w-full max-w-sm mx-auto">
        <h1 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-brand-pink" /> Admin Panel
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-pink" />
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-primary pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-pink" />
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-primary pl-9"
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
