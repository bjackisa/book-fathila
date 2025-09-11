create table if not exists booking_reminders (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  remind_at timestamptz not null,
  sent boolean not null default false,
  created_at timestamptz default now()
);
