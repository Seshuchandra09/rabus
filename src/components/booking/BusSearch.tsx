import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function BusSearch() {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/buses', {
      state: { source, destination, date }
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box component="form" onSubmit={handleSearch}>
          <TextField
            fullWidth
            label="From"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            margin="normal"
            required
          />
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            customInput={
              <TextField
                fullWidth
                label="Journey Date"
                margin="normal"
                required
              />
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Search Buses
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}