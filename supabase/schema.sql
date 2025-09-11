-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- Table storing all possible availability slots
create table if not exists availability (
  id serial primary key,
  date date not null,
  time text not null,
  unique(date, time)
);

-- Table storing bookings and blocked slots
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service text,
  user_name text,
  user_phone text,
  user_email text,
  date date not null,
  time text not null,
  status text not null default 'booked',
  created_at timestamptz default now(),
  unique(date, time)
);

-- Initial availability taken from data/availability.json
insert into availability (date, time) values
  ('2025-09-15', '09:00'),
  ('2025-09-15', '10:00'),
  ('2025-09-15', '11:00'),
  ('2025-09-15', '14:00'),
  ('2025-09-15', '15:00'),
  ('2025-09-16', '09:00'),
  ('2025-09-16', '10:00'),
  ('2025-09-16', '14:00'),
  ('2025-09-17', '11:00'),
  ('2025-09-17', '12:00'),
  ('2025-09-17', '15:00'),
  ('2025-09-17', '16:00'),
  ('2025-09-18', '09:00'),
  ('2025-09-18', '10:00'),
  ('2025-09-22', '10:00'),
  ('2025-09-22', '11:00'),
  ('2025-09-22', '14:00'),
  ('2025-09-23', '09:00'),
  ('2025-09-23', '14:00'),
  ('2025-09-23', '15:00'),
  ('2025-09-24', '11:00'),
  ('2025-09-24', '12:00'),
  ('2025-09-25', '09:00'),
  ('2025-09-25', '10:00'),
  ('2025-09-25', '11:00'),
  ('2025-09-25', '14:00'),
  ('2025-09-25', '15:00'),
  ('2025-09-25', '16:00'),
  ('2025-10-01', '10:00'),
  ('2025-10-01', '11:00'),
  ('2025-10-01', '14:00'),
  ('2025-10-02', '09:00'),
  ('2025-10-02', '14:00'),
  ('2025-10-02', '15:00')
  on conflict do nothing;
