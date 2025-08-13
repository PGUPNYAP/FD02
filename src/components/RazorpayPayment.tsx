import React from 'react';
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

interface PaymentOptions {
  amount: number;
  orderId?: string;
  name: string;
  description: string;
  email?: string;
  contact?: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const openRazorpayPayment = (options: PaymentOptions) => {
  const razorpayOptions = {
    description: options.description,
    image: 'https://i.imgur.com/3g7nmJC.png', // Your app logo URL
    currency: 'INR',
    key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
    amount: options.amount * 100, // Amount in paise
    name: 'Focus Desk',
    order_id: options.orderId, // Optional
    prefill: {
      email: options.email || '',
      contact: options.contact || '',
      name: options.name,
    },
    theme: { color: '#3b82f6' },
  };

  RazorpayCheckout.open(razorpayOptions)
    .then((data: any) => {
      // Payment successful
      console.log('Payment successful:', data);
      options.onSuccess(data);
    })
    .catch((error: any) => {
      // Payment failed or cancelled
      console.log('Payment error:', error);
      if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
        Alert.alert('Payment Cancelled', 'You cancelled the payment.');
      } else {
        Alert.alert('Payment Failed', error.description || 'Something went wrong.');
      }
      options.onError(error);
    });
};

export default { openRazorpayPayment };