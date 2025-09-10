"use client";

import { useState } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";

const services = [
  "Mentorship",
  "Consultancy",
  "Business Training",
  "Mass Coaching",
];

export default function Home() {
  const [step, setStep] = useState("service"); // 'service', 'details', 'calendar', 'confirmed'
  const [selectedService, setSelectedService] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", phone: "", email: "" });
  const [bookingDetails, setBookingDetails] = useState({ date: "", time: "" });

  const handleServiceSelect = (service: string) => {
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
      service: selectedService,
      user: userDetails,
      booking: details,
    };

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      setStep("confirmed");

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Booking failed: ${message}`);
      // Optional: reset the state to allow user to try again
      setStep("calendar");
    }
  };

  const startOver = () => {
    setStep("service");
    setSelectedService("");
    setUserDetails({ name: "", phone: "", email: "" });
    setBookingDetails({ date: "", time: "" });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <header className="flex flex-col items-center text-center mb-12">
          <img
            src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
            alt="Fathila Nanozi"
            width={100}
            height={100}
            className="rounded-full mb-4"
          />
        <h1 className="text-4xl font-bold text-white">Book Fathila</h1>
        {step === "service" && (
          <p className="text-lg text-gray-300 mt-2">
            Choose a service to get started
          </p>
        )}
      </header>

      <section className="w-full max-w-lg">
        {step === "service" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => handleServiceSelect(service)}
                className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-brand-pink transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-white">{service}</h3>
              </button>
            ))}
          </div>
        )}

        {step === "details" && <UserDetailsForm service={selectedService} onSubmit={handleDetailsSubmit} />}

        {step === "calendar" && <Calendar service={selectedService} onBook={handleBooking} />}

        {step === "confirmed" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Booking Confirmed!</h2>
            <p className="text-lg">Thank you, {userDetails.name}.</p>
            <p>Your {selectedService} session is booked for {bookingDetails.date} at {bookingDetails.time}.</p>
            <button onClick={startOver} className="mt-6 p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-90">
              Book Another Session
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
