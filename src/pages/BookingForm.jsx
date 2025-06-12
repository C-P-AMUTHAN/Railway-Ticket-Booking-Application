// BookingForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
      <input className="border p-2 mb-3 block w-full" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
      <input className="border p-2 mb-3 block w-full" placeholder="Age" type="number" onChange={(e) => setAge(e.target.value)} required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Proceed to Payment</button>
    </form>
  );
};
export default BookingForm;