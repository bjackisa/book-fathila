import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const dataDirectory = path.join(process.cwd(), 'data');
  const bookingsPath = path.join(dataDirectory, 'bookings.json');

  try {
    const { date, time } = await request.json();

    if (!date || !time) {
      return NextResponse.json({ message: 'Date and time are required.' }, { status: 400 });
    }

    interface BookingEntry {
      booking?: { date: string; time: string };
      status?: string;
    }

    let bookings: BookingEntry[] = [];
    if (fs.existsSync(bookingsPath)) {
      const bookingsData = fs.readFileSync(bookingsPath, 'utf-8');
      if (bookingsData) {
        bookings = JSON.parse(bookingsData);
      }
    }

    const isSlotBooked = bookings.some(
      (b) => b.booking?.date === date && b.booking?.time === time
    );
    if (isSlotBooked) {
      return NextResponse.json({ message: 'This slot is already booked or blocked.' }, { status: 409 });
    }

    bookings.push({ booking: { date, time }, status: 'blocked' });
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

    return NextResponse.json({ message: 'Slot blocked successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error blocking slot:', error);
    return NextResponse.json({ message: 'Error blocking slot' }, { status: 500 });
  }
}

