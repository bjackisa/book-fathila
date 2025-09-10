"use client";

import { useState, useEffect } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const services = [
  { name: "Community Impact Planning", duration: 360, icon: SparklesIcon },
  { name: "Startup Advisory Session", duration: 60, icon: BriefcaseIcon },
  { name: "Skills Development Workshop", duration: 180, icon: AcademicCapIcon },
  { name: "Growth Strategy Consultation", duration: 60, icon: ChartBarIcon },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
    <main className="flex flex-col items-center justify-center min-h-screen p-8 transition-colors duration-300">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="self-end mb-8 p-2 rounded-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>
      <header className="flex flex-col items-center text-center mb-12">
        <img
          src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
          alt="Fathila Nanozi"
          width={100}
          height={100}
          className="rounded-full mb-4"
        />
        <h1 className="text-4xl font-bold">Book Fathila</h1>
        {step === "service" && (
          <p className="text-lg mt-2">Choose a service to get started</p>
        )}
      </header>

      <section className="w-full max-w-lg">
        {step === "service" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => handleServiceSelect(service)}
                className="card flex items-center gap-3 text-left hover:shadow-md p-4"
              >
                <service.icon className="w-5 h-5 text-brand-pink flex-shrink-0" />
                <h3 className="text-base font-medium">{service.name}</h3>
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
            <CheckCircleIcon className="w-10 h-10 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-lg">Thank you, {userDetails.name}.</p>
            <p>
              Your {selectedService.name} session is booked for {bookingDetails.date} at {bookingDetails.time}.
            </p>
            <button onClick={startOver} className="btn-primary mt-2">
              Book Another Session
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
