"use client";

import { useState, useEffect } from "react";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { Calendar } from "@/components/Calendar";
import { Sun, Moon, CheckCircle } from "lucide-react";
import { AttendeeForm } from "@/components/AttendeeForm";
import { MeetingTypeForm } from "@/components/MeetingTypeForm";
import { LocationForm } from "@/components/LocationForm";

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
        {step === "service" && <p className="text-lg">Choose a service to get started</p>}
      </header>

      {step !== "confirmed" && (
        <div className="max-w-md mx-auto h-2 bg-[var(--surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-pink transition-all"
            style={{
              width:
                step === "service"
                  ? "14%"
                  : step === "attendees"
                  ? "28%"
                  : step === "meeting-type"
                  ? "42%"
                  : step === "location" || step === "online-info"
                  ? "56%"
                  : step === "details"
                  ? "70%"
                  : step === "calendar"
                  ? "85%"
                  : "100%",
            }}
          />
        </div>
      )}

      {step === "service" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          {services.map((service, idx) => (
            <button
              key={service.name}
              onClick={() => handleServiceSelect(service)}
              className={`flex flex-col items-start gap-3 text-left p-4 rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink transition-colors $
{theme === "dark" ? "bg-white text-black border-gray-300 hover:bg-gray-100" : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"}`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-white text-xs font-bold">
                  {idx + 1}
                </span>
              </div>
              <span className="text-sm font-medium">{service.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === "attendees" && <AttendeeForm onSubmit={handleAttendeeSubmit} />}

      {step === "meeting-type" && <MeetingTypeForm onSubmit={handleMeetingType} />}

      {step === "location" && <LocationForm onSubmit={handleLocationSubmit} />}

      {step === "online-info" && (
        <div className="surface max-w-md mx-auto space-y-4">
          <p>If approved, the meeting will be hosted on my Zoom and might be recorded for record purposes.</p>
          <button className="btn-accent w-full" onClick={() => setStep("details")}>
            Continue
          </button>
        </div>
      )}

      {step === "details" && selectedService && <UserDetailsForm service={selectedService.name} onSubmit={handleDetailsSubmit} />}

      {step === "calendar" && selectedService && (
        <Calendar service={selectedService.name} duration={selectedService.duration} onBook={handleBooking} />
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
