import { ShippingFormInputs } from '@repo/types'
import { PaymentElement, useCheckout } from '@stripe/react-stripe-js/checkout';
import React, { useState } from 'react'

const CheckoutForm = ({ ShippingForm }: { ShippingForm: ShippingFormInputs }) => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (checkoutState.type === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-700">Loading checkout...</p>
        </div>
      </div>
    );
  } 
  
  if (checkoutState.type === 'error') {
    return (
      <div className="p-4 text-black bg-gray-100 border border-black rounded-md">
        Error: {checkoutState.error.message}
      </div>
    );
  }

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!ShippingForm.email || !ShippingForm.address || !ShippingForm.city) {
        setError('Please fill in all required shipping information');
        setLoading(false);
        return;
      }

      await checkoutState.checkout.updateEmail(ShippingForm.email);
      await checkoutState.checkout.updateShippingAddress({
        name: ShippingForm.name,
        address: {
          line1: ShippingForm.address,
          city: ShippingForm.city,
          country:'US',
        }
      });

      const res = await checkoutState.checkout.confirm();

      if (res.type === 'error') {
        setError(res.error.message || 'Payment failed. Please try again.');
      } else if (res.type === 'success') {
        console.log("Payment successful!");
     
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-white border border-gray-300 rounded-lg shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black border-b-2 border-black pb-2">
          Complete Your Payment
        </h2>
        
        {error && (
          <div className="p-4 text-black bg-gray-100 rounded-md border-2 border-black">
            <p className="font-semibold">⚠ {error}</p>
          </div>
        )}

        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <PaymentElement 
            options={{ 
              layout: 'accordion',
            
            }} 
          />
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleClick}
        className={`w-full py-4 px-6 rounded-md font-bold text-lg transition-all border-2 ${
          loading
            ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
            : 'bg-black text-white border-black hover:bg-white hover:text-black active:scale-95'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>

      
    </div>
  );
};

export default CheckoutForm;