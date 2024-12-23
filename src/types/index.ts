export interface Bus {
  id: string;
  route_id: string;
  bus_number: string;
  bus_type: string;
  total_seats: number;
  departure_time: string;
  arrival_time: string;
  fare: number;
  created_at: string;
  route?: {
    id: string;
    source: string;
    destination: string;
    distance: number;
  };
}

export interface Seat {
  id: string;
  bus_id: string;
  seat_number: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  bus_id: string;
  seat_id: string;
  booking_date: string;
  journey_date: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_id?: string;
  amount: number;
  created_at: string;
  bus?: Bus;
  seat?: Seat;
}