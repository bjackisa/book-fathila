import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const newBooking = await request.json();
    const { date, time } = newBooking.booking || {};

    if (!date || !time) {
      return NextResponse.json({ message: 'Invalid booking data.' }, { status: 400 });
    }

    // Check if slot exists in availability table
    const { data: availabilitySlot, error: availabilityError } = await supabase
      .from('availability')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (availabilityError) throw availabilityError;

    if (!availabilitySlot) {
      return NextResponse.json(
        { message: 'This time slot is not available.' },
        { status: 400 }
      );
    }

    // Check if slot already booked or blocked
    const { data: existing, error: existingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      return NextResponse.json(
        { message: 'This time slot has already been booked.' },
        { status: 409 }
      );
    }

    // Save booking
    const { data: bookingRow, error: insertError } = await supabase
      .from('bookings')
      .insert({
        service: newBooking.service,
        user_name: newBooking.user?.name,
        user_phone: newBooking.user?.phone,
        user_email: newBooking.user?.email,
        attendees: newBooking.meeting?.attendees,
        meeting_type: newBooking.meeting?.meetingType,
        location_option: newBooking.meeting?.locationOption,
        address: newBooking.meeting?.address,
        district: newBooking.meeting?.district,
        country: newBooking.meeting?.country,
        date,
        time,
        status: 'booked',
      })
      .select('id')
      .single();

      if (insertError) throw insertError;

      if (newBooking.note) {
        const { error: noteError } = await supabase.from('booking_notes').insert({
          booking_id: bookingRow.id,
          note: newBooking.note,
        });
        if (noteError) throw noteError;
      }

      if (newBooking.reminder) {
        const bookingDateTime = new Date(`${date}T${time}`);
        const remindAt = new Date(bookingDateTime.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const { error: reminderError } = await supabase.from('booking_reminders').insert({
          booking_id: bookingRow.id,
          remind_at: remindAt,
        });
        if (reminderError) throw reminderError;
      }

    return NextResponse.json(
      { message: 'Booking successful!', booking: { id: bookingRow.id, ...newBooking } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ message: 'Error processing booking' }, { status: 500 });
  }
}
