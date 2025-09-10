import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataDirectory = path.join(process.cwd(), 'data');
  const availabilityPath = path.join(dataDirectory, 'availability.json');
  const bookingsPath = path.join(dataDirectory, 'bookings.json');

  try {
    // Read availability data
    let availability = { slots: {} };
    if (fs.existsSync(availabilityPath)) {
      const availabilityData = fs.readFileSync(availabilityPath, 'utf-8');
      availability = JSON.parse(availabilityData);
    }

    // Read bookings data
    let bookings: { date: string; time: string }[] = [];
    if (fs.existsSync(bookingsPath)) {
      const bookingsData = fs.readFileSync(bookingsPath, 'utf-8');
      bookings = JSON.parse(bookingsData);
    }

    // Create a set of booked slots for quick lookup
    const bookedSlots = new Set(bookings.map(b => `${b.date}T${b.time}`));

    // Filter out booked slots from availability
    const availableSlots: { [key: string]: string[] } = {};
    for (const date in availability.slots) {
      const slots = (availability.slots as any)[date];
      const unbookedSlots = slots.filter((time: string) => !bookedSlots.has(`${date}T${time}`));
      if (unbookedSlots.length > 0) {
        availableSlots[date] = unbookedSlots;
      }
    }

    return NextResponse.json(availableSlots);

  } catch (error) {
    console.error('Error reading availability data:', error);
    return NextResponse.json({ message: 'Error reading availability data' }, { status: 500 });
  }
}
