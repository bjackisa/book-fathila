"use client";

import { useState, useEffect } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";
import { SunIcon, MoonIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const services = [
  { name: "Community Impact Planning", duration: 360 },
  { name: "Startup Advisory Session", duration: 60 },
  { name: "Skills Development Workshop", duration: 180 },
  { name: "Growth Strategy Consultation", duration: 60 },
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
        className="self-end mb-4 p-2 rounded-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
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
                className="w-full text-left p-4 rounded-lg border border-brand-pink bg-white dark:bg-neutral-900 hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-between"
              >
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <ChevronRightIcon className="w-5 h-5" />
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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-500 mb-4">Booking Confirmed!</h2>
            <p className="text-lg">Thank you, {userDetails.name}.</p>
            <p>
              Your {selectedService.name} session is booked for {bookingDetails.date} at {bookingDetails.time}.
            </p>
            <button
              onClick={startOver}
              className="mt-6 p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-90"
            >
              Book Another Session
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
