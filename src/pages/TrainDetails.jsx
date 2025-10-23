// src/pages/TrainDetails.jsx
import React, { useEffect, useState } from "react";
import './Home.css';

const TrainDetails = () => {
  const [trains, setTrains] = useState([]);
  const [editingTrainId, setEditingTrainId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/trains")
      .then((res) => res.json())
      .then((data) => setTrains(data))
      .catch((err) => console.error("Error fetching trains:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/trains/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrains(trains.filter(t => t._id !== id));
      } else {
        console.error('Error deleting train');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (train) => {
    setEditingTrainId(train._id);
    setEditForm({ ...train });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/trains/${editingTrainId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setTrains(trains.map(t => t._id === editingTrainId ? updated.train : t));
        setEditingTrainId(null);
        setEditForm({});
      } else {
        console.error('Error updating train');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingTrainId(null);
    setEditForm({});
  };

  return (
    <div className="home-container" style={{ padding: "2rem" }}>
      <h1 className="home-title">🚆 Train Details</h1>
      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {trains.map((train) => (
          <div key={train._id} style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {editingTrainId === train._id ? (
                <>
                  <input placeholder="Name" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={{ marginRight: '0.5rem' }} />
                  <input placeholder="Number" value={editForm.number || ''} onChange={(e) => setEditForm({...editForm, number: e.target.value})} />
                  <br />
                  <input placeholder="From" value={editForm.from || ''} onChange={(e) => setEditForm({...editForm, from: e.target.value})} style={{ marginRight: '0.5rem' }} />
                  <input placeholder="To" value={editForm.to || ''} onChange={(e) => setEditForm({...editForm, to: e.target.value})} />
                  <br />
                  <input placeholder="Date" value={editForm.date || ''} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
                </>
              ) : (
                <>
                  <strong>{train.name} ({train.number})</strong>
                  <div>{train.from} → {train.to}</div>
                  <div>{new Date(train.date).toLocaleDateString()}</div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "0.5rem 1rem", textAlign: "center" }}>
                  <strong>AC 2-tier</strong>
                  <div>
                    {editingTrainId === train._id ? (
                      <input value={editForm.ac2Tier || ''} onChange={(e) => setEditForm({...editForm, ac2Tier: e.target.value})} />
                    ) : (
                      train.ac2Tier
                    )}
                  </div>
                </div>
                <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "0.5rem 1rem", textAlign: "center" }}>
                  <strong>AC 3-tier</strong>
                  <div>
                    {editingTrainId === train._id ? (
                      <input value={editForm.ac3Tier || ''} onChange={(e) => setEditForm({...editForm, ac3Tier: e.target.value})} />
                    ) : (
                      train.ac3Tier
                    )}
                  </div>
                </div>
                <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "0.5rem 1rem", textAlign: "center" }}>
                  <strong>Sleeper</strong>
                  <div>
                    {editingTrainId === train._id ? (
                      <input value={editForm.sleeper || ''} onChange={(e) => setEditForm({...editForm, sleeper: e.target.value})} />
                    ) : (
                      train.sleeper
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {editingTrainId === train._id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(train)}>Update</button>
                    <button onClick={() => handleDelete(train._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainDetails;
