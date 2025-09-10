"use client";

import { useState, useEffect } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";
import {
  Sun,
  Moon,
  Sparkles,
  GraduationCap,
  BarChart3,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const services = [
  { name: "Community Impact Planning", duration: 360, icon: Sparkles },
  { name: "Startup Advisory Session", duration: 60, icon: Briefcase },
  { name: "Skills Development Workshop", duration: 180, icon: GraduationCap },
  { name: "Growth Strategy Consultation", duration: 60, icon: BarChart3 },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // initialize from system preference / stored value
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  // update document class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [step, setStep] = useState("service"); // 'service', 'details', 'calendar', 'confirmed'
  const [selectedService, setSelectedService] = useState<{ name: string; duration: number } | null>(null);
  const [userDetails, setUserDetails] = useState({ name: "", phone: "", email: "" });
  const [bookingDetails, setBookingDetails] = useState({ date: "", time: "" });

  const handleServiceSelect = (service: { name: string; duration: number }) => {
    setSelectedService(service);
    setStep("details");
  };

  const handleDetailsSubmit = (details: { name: string; phone: string; email: string }) => {
    setUserDetails(details);
    setStep("calendar");
  };

  const handleBooking = async (details: { date: string; time: string }) => {
    setBookingDetails(details);

    const bookingData = {
      service: selectedService?.name,
      duration: selectedService?.duration,
      user: userDetails,
      booking: details,
    };

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setStep("confirmed");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Booking failed: ${message}`);
      setStep("calendar");
    }
  };

  const startOver = () => {
    setStep("service");
    setSelectedService(null);
    setUserDetails({ name: "", phone: "", email: "" });
    setBookingDetails({ date: "", time: "" });
  };

  return (
    <main className="space-y-10">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="ml-auto mb-4 p-2 rounded-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <header className="flex flex-col items-center text-center space-y-3">
        <img
          src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
          alt="Fathila Nanozi"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold">Book Fathila</h1>
        {step === "service" && <p className="text-lg">Choose a service to get started</p>}
      </header>

      {step === "service" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          {services.map((service) => (
            <button
              key={service.name}
              onClick={() => handleServiceSelect(service)}
              className="card flex items-center gap-3 p-5 text-left hover:shadow-md transition-shadow"
            >
              <service.icon className="w-5 h-5 text-brand-pink" />
              <span className="text-sm font-medium">{service.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === "details" && selectedService && (
        <UserDetailsForm service={selectedService.name} onSubmit={handleDetailsSubmit} />
      )}

      {step === "calendar" && selectedService && (
        <Calendar service={selectedService.name} duration={selectedService.duration} onBook={handleBooking} />
      )}

      {step === "confirmed" && selectedService && (
        <div className="card text-center space-y-4">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          <p>Thank you, {userDetails.name}.</p>
          <p>
            Your {selectedService.name} session is booked for {bookingDetails.date} at {bookingDetails.time}.
          </p>
          <button onClick={startOver} className="btn-primary mt-2">
            Book Another Session
          </button>
        </div>
      )}
    </main>
  );
}
