// SearchResults.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  const trains = [
    { id: 1, name: "Shatabdi Express", time: "10:00 AM", class: "AC" },
    { id: 2, name: "Intercity Express", time: "01:00 PM", class: "Sleeper" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Available Trains</h2>
      {trains.map(train => (
        <div key={train.id} className="bg-white shadow p-4 mb-3 rounded">
          <p>{train.name} - {train.time} - {train.class}</p>
          <Link to={`/book/${train.id}`} className="text-blue-600">Book Now</Link>
        </div>
      ))}
    </div>
  );
};
export default SearchResults;