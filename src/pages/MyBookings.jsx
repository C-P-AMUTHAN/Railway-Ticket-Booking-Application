// MyBookings.jsx
import React from 'react';

const MyBookings = () => {
  const bookings = [
    { id: 1, name: "Shatabdi Express", date: "2025-06-10" },
    { id: 2, name: "Intercity Express", date: "2025-06-11" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id} className="mb-2">{b.name} - {b.date}</li>
        ))}
      </ul>
    </div>
  );
};
export default MyBookings;