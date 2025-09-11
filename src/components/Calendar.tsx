"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

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
    <div className="w-full max-w-lg mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center">Select a date and time for {service}</h2>
      {isLoading ? (
        <p className="text-center">Loading availability...</p>
      ) : (
        <div className="surface space-y-3 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevMonth}
              className="slot-btn h-8 w-8 flex items-center justify-center text-win-blue disabled:opacity-50"
              disabled={currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={handleNextMonth}
              className="slot-btn h-8 w-8 flex items-center justify-center text-win-blue"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-medium">
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
              const isToday = date.toDateString() === today.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={!hasSlots || isPast || isSunday}
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-sm transition-all ${
                    isSelected
                      ? "bg-win-blue text-white"
                      : hasSlots && !isPast && !isSunday
                      ? "slot-btn"
                      : "text-gray-400 cursor-not-allowed"
                  } ${isToday ? "ring-2 ring-win-blue" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-center">Available slots for {selectedDate.toLocaleDateString()}</h3>
          <div className="mt-4 md:flex md:items-start md:gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm md:flex-1">
              {availableSlots.length > 0 ? (
                availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`slot-btn flex items-center justify-center gap-1 ${
                      selectedTime === time ? "slot-btn-active" : ""
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </button>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">No available slots for this day.</p>
              )}
            </div>
            {selectedTime && (
              <button
                onClick={() =>
                  onBook({
                    date: selectedDate!.toISOString().split("T")[0],
                    time: selectedTime,
                  })
                }
                className="w-full md:w-48 mt-4 md:mt-0 btn-accent"
              >
                Book {selectedDate.toLocaleDateString()} at {selectedTime}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
