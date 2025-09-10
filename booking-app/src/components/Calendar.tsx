"use client";

import { useState, useEffect } from "react";

export const Calendar = ({
  service,
  onBook,
}: {
  service: string;
  onBook: (bookingDetails: { date: string; time: string }) => void;
}) => {
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
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

  const availableSlots = getAvailableSlotsForDate(selectedDate);

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Select a date and time for {service}
      </h2>
      {isLoading ? <p className="text-center">Loading availability...</p> : (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full bg-gray-700 hover:bg-brand-pink">&lt;</button>
          <h3 className="text-xl font-semibold">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full bg-gray-700 hover:bg-brand-pink">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="font-semibold text-sm">{day}</div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateString = date.toISOString().split("T")[0];
            const hasSlots = availableSlotsData[dateString]?.length > 0;
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={!hasSlots}
                className={`p-2 rounded-full ${isSelected ? "bg-brand-pink" : (hasSlots ? "bg-gray-700 hover:bg-brand-pink" : "text-gray-500")}`}
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
          <h3 className="text-lg font-semibold text-center">Available slots for {selectedDate.toLocaleDateString()}</h3>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {availableSlots.length > 0 ? availableSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 rounded-lg ${selectedTime === time ? "bg-brand-pink" : "bg-gray-700 hover:bg-brand-pink"}`}
              >
                {time}
              </button>
            )) : <p className="col-span-3 text-center text-gray-400">No available slots for this day.</p>}
          </div>
        </div>
      )}

      {selectedTime && (
        <button
          onClick={() => onBook({ date: selectedDate!.toISOString().split("T")[0], time: selectedTime })}
          className="w-full mt-6 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors duration-300"
        >
          Book Now for {selectedTime}
        </button>
      )}
    </div>
  );
};
