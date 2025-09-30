import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineHeart } from "react-icons/ai";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CheckoutButton from "../Payment/CheckoutButton";

const Cart = () => {
  const nav = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Adidas Running Shoes",
      image: "/assets/product-1.png",
      price: 120,
      quantity: 1,
      isFavorite: false,
      description: "High-performance running shoes with superior comfort"
    },
    {
      id: 2,
      name: "Nike Sneakers",
      image: "/assets/product-2.png",
      price: 150,
      quantity: 2,
      isFavorite: false,
      description: "Premium lifestyle sneakers with modern design"
    },
    {
      id: 3,
      name: "Puma Sport Shoes",
      image: "/assets/product-3.png",
      price: 130,
      quantity: 1,
      isFavorite: false,
      description: "Versatile sport shoes for everyday activities"
    },
  ]);

  const handleQuantityChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity:
              type === "increase"
                ? item.quantity + 1
                : Math.max(item.quantity - 1, 1),
          }
          : item
      )
    );
  };

  const handleFavoriteToggle = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  // Transform cart items to match CheckoutButton expected format with images
  const orderItems = cartItems.map(item => ({
    productName: item.name,
    unitPrice: item.price,
    quantity: item.quantity,
    // Add image URL - convert relative path to absolute URL
    imageUrl: item.image.startsWith('http')
      ? item.image
      : `${window.location.origin}${item.image}`,
    description: item.description || item.name
  }));

  const handleCheckoutError = (error) => {
    console.error('Checkout failed:', error);
    alert(`Checkout failed: ${error}`);
  };

  const handleCheckoutSuccess = (response) => {
    console.log('Checkout initiated successfully:', response);
  };

  return (
    <div className="px-6 sm:px-8 lg:px-16 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        // Empty cart state
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 10v6a1 1 0 001 1h12a1 1 0 001-1v-6M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8.1" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some items to get started!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"

                  />
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>

                <div className="flex flex-col flex-1 ml-6">
                  <p className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">${item.price} per item</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  )}
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(item.id, "decrease")}
                    disabled={item.quantity === 1}
                    className={`px-3 py-2 rounded-md text-lg font-semibold transition ${item.quantity === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, "increase")}
                    className="px-3 py-2 bg-gray-200 rounded-md text-lg font-semibold hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 ml-6">
                  <button
                    onClick={() => handleFavoriteToggle(item.id)}
                    className={`transition ${item.isFavorite
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-400 hover:text-red-600'
                      }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <AiOutlineHeart
                      size={24}
                      fill={item.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Remove from cart"
                  >
                    <AiOutlineDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal:</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping Fee:</p>
                <p className="font-medium">${shippingFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Tax:</p>
                <p className="font-medium">$0.00</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <p>Total:</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <CheckoutButton
              orderItems={orderItems}
              onError={handleCheckoutError}
              onSuccess={handleCheckoutSuccess}
              buttonText="Proceed to Payment"
            />

            {/* Continue Shopping Link */}
            <div className="mt-4">
              <Link
                to="/"
                className="block w-full text-center py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;