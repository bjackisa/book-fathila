"use client";

import { useState, useEffect } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";
import { Sun, Moon, CheckCircle } from "lucide-react";
import { AttendeeForm } from "@/components/AttendeeForm";
import { MeetingTypeForm } from "@/components/MeetingTypeForm";
import { LocationForm } from "@/components/LocationForm";
import { StepIndicator } from "@/components/StepIndicator";

const services = [
  {
    name: "Business Formalization (e.g., Registration, Certification, TIN Registration, etc.)",
    duration: 60,
  },
  { name: "Business Start-up Reviews & Consultation", duration: 60 },
  { name: "Business Training & Workshop Facilitation", duration: 180 },
  { name: "Community Development Initiatives", duration: 360 },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [step, setStep] = useState("service");
  const [selectedService, setSelectedService] = useState<{ name: string; duration: number } | null>(null);
  const [meetingInfo, setMeetingInfo] = useState({
    attendees: "",
    meetingType: "",
    locationOption: "",
    address: "",
    district: "",
    country: "",
  });
  const [userDetails, setUserDetails] = useState({ name: "", phone: "", email: "", note: "", reminder: false });
  const [bookingDetails, setBookingDetails] = useState({ date: "", time: "" });

  const handleServiceSelect = (service: { name: string; duration: number }) => {
    setSelectedService(service);
    setStep("attendees");
  };

  const handleAttendeeSubmit = (size: string) => {
    setMeetingInfo((prev) => ({ ...prev, attendees: size }));
    setStep("meeting-type");
  };

  const handleMeetingType = (type: "Physical" | "Online") => {
    if (type === "Physical") {
      setMeetingInfo((prev) => ({ ...prev, meetingType: type }));
      setStep("location");
    } else {
      setMeetingInfo((prev) => ({ ...prev, meetingType: type, locationOption: "online" }));
      setStep("online-info");
    }
  };

  const handleLocationSubmit = (info: {
    locationOption: string;
    address: string;
    district: string;
    country: string;
  }) => {
    setMeetingInfo((prev) => ({ ...prev, ...info }));
    setStep("details");
  };

  const handleDetailsSubmit = (details: {
    name: string;
    phone: string;
    email: string;
    note: string;
    reminder: boolean;
  }) => {
    setUserDetails(details);
    setStep("calendar");
  };

  const handleBooking = async (details: { date: string; time: string }) => {
    setBookingDetails(details);
    const bookingData = {
      service: selectedService?.name,
      duration: selectedService?.duration,
      meeting: meetingInfo,
      user: { name: userDetails.name, phone: userDetails.phone, email: userDetails.email },
      note: userDetails.note,
      reminder: userDetails.reminder,
      booking: details,
    };
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    setMeetingInfo({
      attendees: "",
      meetingType: "",
      locationOption: "",
      address: "",
      district: "",
      country: "",
    });
    setUserDetails({ name: "", phone: "", email: "", note: "", reminder: false });
    setBookingDetails({ date: "", time: "" });
  };

  const currentStepNumber =
    step === "service"
      ? 1
      : step === "attendees"
      ? 2
      : step === "meeting-type" || step === "location" || step === "online-info"
      ? 3
      : step === "details"
      ? 4
      : 5;

  const stepTitle =
    step === "service"
      ? "Select a Service"
      : step === "attendees"
      ? "How many people will attend?"
      : step === "meeting-type" || step === "location" || step === "online-info"
      ? "Meeting Type"
      : step === "details"
      ? "Contact Details"
      : step === "calendar"
      ? "Select Date & Time"
      : "";

  return (
    <main className="space-y-10 animate-fade-in">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle Theme"
        className="ml-auto mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-brand-pink shadow hover:bg-white/80 dark:hover:bg-neutral-700"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <header className="flex flex-col items-center text-center space-y-3">
        <img
          src="https://fathilananozi.com/storage/fathila-widget-pic-1.png"
          alt="Fathila Nanozi"
          width={100}
          height={100}
          className="rounded-full shadow ring-1 ring-[var(--surface-border)]"
        />
        <h1 className="text-3xl font-bold">Book Fathila</h1>
        <p className="text-sm text-gray-500">Professional Business Advisory & Consulting Services</p>
      </header>
      {step !== "confirmed" && (
        <div className="space-y-4">
          <StepIndicator current={currentStepNumber} />
          <p className="text-center text-sm">Step {currentStepNumber} of 5</p>
          {stepTitle && <h2 className="text-xl font-semibold text-center">{stepTitle}</h2>}
        </div>
      )}

      {step === "service" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          {services.map((service, idx) => (
            <button
              key={service.name}
              onClick={() => handleServiceSelect(service)}
              className="option-card text-left"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-white text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-sm font-medium">{service.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === "attendees" && (
        <AttendeeForm onSubmit={handleAttendeeSubmit} onBack={() => setStep("service")} />
      )}

      {step === "meeting-type" && (
        <MeetingTypeForm onSubmit={handleMeetingType} onBack={() => setStep("attendees")} />
      )}

      {step === "location" && (
        <LocationForm onSubmit={handleLocationSubmit} onBack={() => setStep("meeting-type")} />
      )}

      {step === "online-info" && (
        <div className="surface max-w-md mx-auto space-y-4">
          <p>If approved, the meeting will be hosted on my Zoom and might be recorded for record purposes.</p>
          <div className="flex justify-between gap-2">
            <button className="slot-btn flex-1" onClick={() => setStep("meeting-type")}>Back</button>
            <button className="btn-accent flex-1" onClick={() => setStep("details")}>Continue</button>
          </div>
        </div>
      )}

      {step === "details" && selectedService && (
        <UserDetailsForm
          service={selectedService.name}
          onSubmit={handleDetailsSubmit}
          onBack={() =>
            setStep(meetingInfo.meetingType === "Physical" ? "location" : "online-info")
          }
        />
      )}

      {step === "calendar" && selectedService && (
        <Calendar
          service={selectedService.name}
          duration={selectedService.duration}
          onBook={handleBooking}
          onBack={() => setStep("details")}
        />
      )}

      {step === "confirmed" && selectedService && (
        <div className="surface text-center space-y-4">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          <p>Thank you, {userDetails.name}.</p>
          <p>
            Your {selectedService.name} session is booked for {bookingDetails.date} at {bookingDetails.time}.
          </p>
          {meetingInfo.meetingType && <p>Meeting type: {meetingInfo.meetingType}</p>}
          {meetingInfo.attendees && <p>Attendees: {meetingInfo.attendees}</p>}
          {meetingInfo.locationOption === "other" && (
            <p>
              Location: {meetingInfo.address}, {meetingInfo.district}, {meetingInfo.country}
            </p>
          )}
          {meetingInfo.locationOption === "office" && <p>Location: Kigobe Rd, Ntinda, Kampala</p>}
          {userDetails.note && <p className="italic">Note: {userDetails.note}</p>}
          {userDetails.reminder && <p>A reminder will be sent 24 hours before.</p>}
          <button onClick={startOver} className="btn-accent mt-2">
            Book Another Session
          </button>
        </div>
      )}
    </main>
  );
}
