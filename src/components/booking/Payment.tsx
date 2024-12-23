import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { Booking } from '../../types';
import ErrorAlert from '../common/ErrorAlert';
import PaymentForm from '../payment/PaymentForm';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            bus:buses(*),
            seat:seats(*)
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePaymentSuccess = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'completed' })
        .eq('id', bookingId);

      if (error) throw error;
      navigate('/bookings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {error && <ErrorAlert message={error} />}
      
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h5" gutterBottom>Payment Details</Typography>
        
        {booking && (
          <Box sx={{ mb: 3 }}>
            <Typography>Amount: ${booking.amount}</Typography>
            <Typography>Seat: {booking.seat?.seat_number}</Typography>
            <Typography>Bus: {booking.bus?.bus_number}</Typography>
          </Box>
        )}

        <PaymentForm
          amount={booking?.amount || 0}
          onSuccess={handlePaymentSuccess}
          onError={setError}
        />
      </Box>
    </Container>
  );
}