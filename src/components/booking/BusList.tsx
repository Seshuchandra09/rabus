import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Grid, Skeleton } from '@mui/material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Bus } from '../../types';
import ErrorAlert from '../common/ErrorAlert';

export default function BusList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { source, destination, date } = location.state || {};
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data, error } = await supabase
          .from('buses')
          .select(`
            *,
            route:routes(*)
          `)
          .eq('route.source', source)
          .eq('route.destination', destination);

        if (error) throw error;
        setBuses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={200} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <ErrorAlert message={error} />}
      
      <Typography variant="h5" gutterBottom>
        Buses from {source} to {destination} on {format(new Date(date), 'dd MMM yyyy')}
      </Typography>

      <Grid container spacing={3}>
        {buses.map((bus) => (
          <Grid item xs={12} key={bus.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6">{format(new Date(bus.departure_time), 'HH:mm')}</Typography>
                    <Typography color="textSecondary">Departure</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6">{format(new Date(bus.arrival_time), 'HH:mm')}</Typography>
                    <Typography color="textSecondary">Arrival</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6">${bus.fare}</Typography>
                    <Typography color="textSecondary">Price</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/select-seat/${bus.id}`)}
                    >
                      Select Seats
                    </Button>
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