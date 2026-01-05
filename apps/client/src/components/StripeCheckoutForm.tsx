"use client"

import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from './CheckoutForm';
import { useAuth } from '@clerk/nextjs';
import { CartItemsType, ShippingFormInputs } from '@repo/types';
import useCartStore from '@/stores/cartStore';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fetchClientSecret = async (token: string,cart:CartItemsType): Promise<string> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
      {
        method: 'POST',
        body: JSON.stringify({cart}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create checkout session: ${response.statusText}`);
    }

    const json = await response.json();
    return json.checkoutSessionClientSecret;
  } catch (error) {
    console.error('Error fetching client secret:', error);
    throw error;
  }
};

const StripeCheckoutForm = ({ShippingForm}:{ShippingForm:ShippingFormInputs}) => {
  const [token, setToken] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const {cart}=useCartStore()

  useEffect(() => {
    const initialize = async () => {
      try {
        const t = await getToken();
        if (!t) {
          throw new Error('No authentication token available');
        }
        setToken(t);

        // Fetch client secret
        const secret = await fetchClientSecret(t,cart);
        setClientSecret(secret);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize checkout. Please try again.');
      }
    };

    initialize();
  }, [getToken]);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (!token || !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <CheckoutForm ShippingForm={ShippingForm} />
    </CheckoutProvider>
  );
};

export default StripeCheckoutForm;