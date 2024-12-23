import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/common/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BusSearch from './components/booking/BusSearch';
import BusList from './components/booking/BusList';
import SeatSelection from './components/booking/SeatSelection';
import Payment from './components/booking/Payment';
import BookingHistory from './components/booking/BookingHistory';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<BusSearch />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/select-seat/:busId" element={<SeatSelection />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/bookings" element={<BookingHistory />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;