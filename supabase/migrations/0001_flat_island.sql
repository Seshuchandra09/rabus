/*
  # Initial Schema for RaBus Application

  1. New Tables
    - users (handled by Supabase Auth)
    - buses
      - Basic bus information
      - Schedule and route details
    - seats
      - Seat configuration for each bus
    - bookings
      - Booking records
      - Payment status
    - routes
      - Available bus routes
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Routes table
CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source, destination)
);

-- Buses table
CREATE TABLE buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id),
  bus_number TEXT NOT NULL UNIQUE,
  bus_type TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  fare NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seats table
CREATE TABLE seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid REFERENCES buses(id),
  seat_number TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(bus_id, seat_number)
);

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  bus_id uuid REFERENCES buses(id),
  seat_id uuid REFERENCES seats(id),
  booking_date TIMESTAMPTZ DEFAULT now(),
  journey_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to routes"
  ON routes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to buses"
  ON buses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to available seats"
  ON seats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);