import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const dataDirectory = path.join(process.cwd(), 'data');
  const availabilityPath = path.join(dataDirectory, 'availability.json');
  const bookingsPath = path.join(dataDirectory, 'bookings.json');

  try {
    // Ensure the data directory exists to avoid write errors
    fs.mkdirSync(dataDirectory, { recursive: true });

    const newBooking = await request.json();
    const { date, time } = newBooking.booking || {};

    if (!date || !time) {
      return NextResponse.json({ message: 'Invalid booking data.' }, { status: 400 });
    }

    // --- Validation ---
    // Read availability data safely
    let availability: { slots: Record<string, string[]> } = { slots: {} };
    if (fs.existsSync(availabilityPath)) {
      try {
        const availabilityData = fs.readFileSync(availabilityPath, 'utf-8');
        availability = JSON.parse(availabilityData);
      } catch {
        return NextResponse.json({ message: 'Failed to read availability data.' }, { status: 500 });
      }
    }

    // Check if the slot is generally available
    const isSlotAvailable = availability.slots[date]?.includes(time);
    if (!isSlotAvailable) {
      return NextResponse.json({ message: 'This time slot is not available.' }, { status: 400 });
    }

    // Read current bookings safely
    interface BookingEntry {
      service?: string;
      user?: { name: string; phone: string; email?: string };
      booking: { date: string; time: string };
      status?: string;
    }

    let bookings: BookingEntry[] = [];
    if (fs.existsSync(bookingsPath)) {
      try {
        const bookingsData = fs.readFileSync(bookingsPath, 'utf-8');
        if (bookingsData) {
          bookings = JSON.parse(bookingsData);
        }
      } catch {
        // If the bookings file is corrupt, reset to an empty array
        bookings = [];
      }
    }

    // Check if the slot is already booked or blocked
    const isSlotBooked = bookings.some(
      (b) => b.booking.date === date && b.booking.time === time
    );
    if (isSlotBooked) {
      return NextResponse.json({ message: 'This time slot has already been booked.' }, { status: 409 }); // 409 Conflict
    }

    // --- Save the new booking ---
    bookings.push(newBooking);
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

    return NextResponse.json(
      { message: 'Booking successful!', booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ message: 'Error processing booking' }, { status: 500 });
  }
}
