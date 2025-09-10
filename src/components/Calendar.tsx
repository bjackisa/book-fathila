"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export const Calendar = ({
  service,
  duration,
  onBook,
}: {
  service: string;
  duration: number;
  onBook: (bookingDetails: { date: string; time: string }) => void;
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlotsData, setAvailableSlotsData] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch("/api/availability");
        const data = await response.json();
        setAvailableSlotsData(data);
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const handlePrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentDate(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const getAvailableSlotsForDate = (date: Date | null): string[] => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return availableSlotsData[dateString] || [];
  };

  const filterSlots = (slots: string[]): string[] => {
    const startMinutes = 5 * 60 + 30; // 5:30 AM
    const endMinutes = 18 * 60; // 6:00 PM
    return slots.filter((time) => {
      const [h, m] = time.split(":").map(Number);
      const minutes = h * 60 + m;
      if (minutes < startMinutes) return false;
      if (minutes + duration > endMinutes) return false;
      return true;
    });
  };

  const availableSlots = filterSlots(getAvailableSlotsForDate(selectedDate));

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Select a date and time for {service}
      </h2>
      {isLoading ? (
        <p className="text-center">Loading availability...</p>
      ) : (
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-brand-pink/20">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white disabled:opacity-50 transition-transform hover:-translate-x-1"
              disabled={currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-transform hover:translate-x-1"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-sm">
                {day}
              </div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateString = date.toISOString().split("T")[0];
              const rawSlots = availableSlotsData[dateString] || [];
              const hasSlots = filterSlots(rawSlots).length > 0;
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isSunday = date.getDay() === 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={!hasSlots || isPast || isSunday}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isSelected
                      ? "bg-brand-pink text-white"
                      : hasSlots && !isPast && !isSunday
                      ? "border border-brand-pink hover:bg-brand-pink hover:text-white hover:shadow"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-center">
            Available slots for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {availableSlots.length > 0 ? (
              availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    selectedTime === time
                      ? "bg-brand-pink text-white"
                      : "border border-brand-pink hover:bg-brand-pink hover:text-white"
                  }`}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No available slots for this day.</p>
            )}
          </div>
        </div>
      )}

      {selectedTime && (
        <button
          onClick={() =>
            onBook({ date: selectedDate!.toISOString().split("T")[0], time: selectedTime })
          }
          className="w-full mt-6 p-3 bg-brand-pink text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-pink/90 transition-colors"
        >
          <CalendarDaysIcon className="w-5 h-5" />
          Book Now for {selectedTime}
        </button>
      )}
    </div>
  );
};
