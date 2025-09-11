import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { date, time } = await request.json();

    if (!date || !time) {
      return NextResponse.json({ message: 'Date and time are required.' }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      return NextResponse.json(
        { message: 'This slot is already booked or blocked.' },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase.from('bookings').insert({
      date,
      time,
      status: 'blocked',
    });

    if (insertError) throw insertError;

    return NextResponse.json({ message: 'Slot blocked successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error blocking slot:', error);
    return NextResponse.json({ message: 'Error blocking slot' }, { status: 500 });
  }
}
