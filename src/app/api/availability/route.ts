import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: slots, error: slotsError } = await supabase
      .from('availability')
      .select('date, time');
    if (slotsError) throw slotsError;

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('date, time');
    if (bookingsError) throw bookingsError;

    const bookedSet = new Set(bookings.map((b) => `${b.date}T${b.time}`));

    const availableSlots: { [key: string]: string[] } = {};
    slots.forEach((slot) => {
      const key = `${slot.date}T${slot.time}`;
      if (!bookedSet.has(key)) {
        if (!availableSlots[slot.date]) {
          availableSlots[slot.date] = [];
        }
        availableSlots[slot.date].push(slot.time);
      }
    });

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Error reading availability data:', error);
    return NextResponse.json({ message: 'Error reading availability data' }, { status: 500 });
  }
}
