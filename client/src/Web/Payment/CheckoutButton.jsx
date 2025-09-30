


import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Cookie from 'cookie-universal'
// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51S32g34R8IHh6cFyGJKlxcsV3DMx7Lk7dKZ7G1eiNR5f1Md9Pf5JeFXBFGcNP8FbIXCAx0cmeHiafhr2FYvgf70j00ERJINASp');

const CheckoutButton = ({
  orderItems = [],
  className = "",
  buttonText = "Proceed to Checkout",
  onError,
  onSuccess,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate total amount
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const handleCheckout = async () => {
    console.log('🚀 Starting checkout process...');
    setError(null);

    try {
      setIsLoading(true);

      // Validate order items
      if (!orderItems || orderItems.length === 0) {
        throw new Error('Your cart is empty. Please add items before checkout.');
      }

      const cookie = Cookie();
      // Get JWT token from various possible storage locations
      const token =
        cookie.get('token');

      console.log('🔑 Token found:', token ? 'Yes' : 'No');

      if (!token) {
        throw new Error('Please login to continue with your purchase.');
      }

      console.log('📦 Order items:', orderItems);
      console.log('💰 Total amount: $', totalAmount.toFixed(2));

      // Call backend API to create Stripe session
      const response = await fetch('http://localhost:5212/Api/Payment/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderItems),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        } else if (response.status === 400) {
          throw new Error('Invalid order data. Please refresh and try again.');
        } else {
          throw new Error(errorData.error || `Server error (${response.status})`);
        }
      }

      const responseData = await response.json();
      console.log('✅ Payment session created:', responseData);

      const { sessionId, url } = responseData;

      if (!sessionId && !url) {
        throw new Error('Invalid response from payment processor.');
      }

      // Redirect to Stripe Checkout
      if (url) {
        console.log('🔗 Redirecting to checkout URL...');
        window.location.href = url;
      } else if (sessionId) {
        console.log('🎯 Using Stripe session ID...');
        const stripe = await stripePromise;

        if (!stripe) {
          throw new Error('Payment processor failed to load. Please refresh the page.');
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(responseData);
      }

    } catch (error) {
      console.error('💥 Checkout error:', error);
      setError(error.message);
      setIsLoading(false);

      // Call error handler if provided
      if (onError) {
        onError(error.message);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 text-sm font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Summary</h3>
          <div className="space-y-1">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="text-gray-900 font-medium">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : disabled || orderItems.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
          }
          ${className}
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </div>
        ) : orderItems.length === 0 ? (
          'Cart is Empty'
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {buttonText}
          </div>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secured by Stripe
      </div>
    </div>
  );
};

export default CheckoutButton;