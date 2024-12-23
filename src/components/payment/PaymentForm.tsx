import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { stripePromise } from '../../lib/stripe';
import ErrorAlert from '../common/ErrorAlert';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentFormContent({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'paypal',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        onError(error.message);
        return;
      }

      if (paymentMethod) {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter Card Details
        </Typography>
        <Box sx={{ 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1 
        }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </Box>
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <CircularProgress size={24} />
        ) : (
          `Pay $${amount}`
        )}
      </Button>
    </form>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}