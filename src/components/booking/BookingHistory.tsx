import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Booking } from '../../types';
import ErrorAlert from '../common/ErrorAlert';

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            bus:buses(*),
            seat:seats(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading your bookings...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <ErrorAlert message={error} />}
      
      <Typography variant="h5" gutterBottom>Your Bookings</Typography>

      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">
                      Journey Date: {format(new Date(booking.journey_date), 'dd MMM yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Bus: {booking.bus?.bus_number}</Typography>
                    <Typography>Seat: {booking.seat?.seat_number}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Amount: ${booking.amount}</Typography>
                    <Typography
                      color={booking.payment_status === 'completed' ? 'success.main' : 'error.main'}
                    >
                      Status: {booking.payment_status}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}