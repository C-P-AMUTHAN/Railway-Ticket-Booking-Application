// PaymentPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate('/confirmation');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Gateway</h2>
      <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">Pay Now</button>
    </div>
  );
};
export default PaymentPage;