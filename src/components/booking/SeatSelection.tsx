import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { Seat } from '../../types';
import ErrorAlert from '../common/ErrorAlert';

export default function SeatSelection() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const { data, error } = await supabase
          .from('seats')
          .select('*')
          .eq('bus_id', busId);

        if (error) throw error;
        setSeats(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [busId]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceed = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(selectedSeats.map(seatId => ({
          user_id: user.id,
          bus_id: busId,
          seat_id: seatId,
          journey_date: new Date().toISOString(),
          amount: 0
        })))
        .select()
        .single();

      if (error) throw error;
      navigate(`/payment/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading seats...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <ErrorAlert message={error} />}
      
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h5" gutterBottom>Select Your Seats</Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {seats.map((seat) => (
            <Grid item xs={2} key={seat.id}>
              <Box
                onClick={() => seat.is_available && handleSeatClick(seat.id)}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  bgcolor: seat.is_available
                    ? selectedSeats.includes(seat.id)
                      ? 'primary.main'
                      : 'background.paper'
                    : 'grey.300',
                  color: selectedSeats.includes(seat.id) ? 'white' : 'inherit',
                  cursor: seat.is_available ? 'pointer' : 'not-allowed',
                  '&:hover': seat.is_available ? {
                    bgcolor: 'primary.light'
                  } : {},
                }}
              >
                <Typography align="center">{seat.seat_number}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          disabled={selectedSeats.length === 0}
          onClick={handleProceed}
          fullWidth
        >
          Proceed to Payment
        </Button>
      </Box>
    </Container>
  );
}