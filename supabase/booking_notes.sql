create table if not exists booking_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);
