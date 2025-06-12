// Profile.jsx
import React, { useState } from 'react';

const Profile = () => {
  const [name, setName] = useState('Amuthan');
  const [email, setEmail] = useState('amuthan@example.com');

  const handleSave = () => {
    alert('Profile updated successfully.');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
      <input className="border p-2 mb-3 block w-full" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 mb-3 block w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  );
};
export default Profile;
