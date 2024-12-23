import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to RaBus
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Book your bus tickets easily and safely
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/search')}
          sx={{ mt: 4 }}
        >
          Book Now
        </Button>
      </Box>
    </Container>
  );
}