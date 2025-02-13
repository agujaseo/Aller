import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addReaction } from '../../services/reactionService';

const ReactionForm = ({ onReactionAdded }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reactionData, setReactionData] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: [],
    severity: 1,
    triggers: [],
    notes: '',
    photos: []
  });

  const handleSymptomAdd = () => {
    const symptom = prompt('Enter symptom:');
    if (symptom) {
      setReactionData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    }
  };

  const handleTriggerAdd = () => {
    const trigger = prompt('Enter trigger:');
    if (trigger) {
      setReactionData(prev => ({
        ...prev,
        triggers: [...prev.triggers, trigger]
      }));
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setReactionData(prev => ({
      ...prev,
      photos: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newReaction = await addReaction(currentUser.uid, reactionData);
      
      // Reset form
      setReactionData({
        date: new Date().toISOString().split('T')[0],
        symptoms: [],
        severity: 1,
        triggers: [],
        notes: '',
        photos: []
      });

      if (onReactionAdded) {
        onReactionAdded(newReaction);
      }
    } catch (error) {
      setError('Error saving reaction');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="reaction-form">
      <h3>Record New Reaction</h3>
      
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={reactionData.date}
          onChange={(e) => setReactionData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label>Severity (1-5):</label>
        <input
          type="range"
          min="1"
          max="5"
          value={reactionData.severity}
          onChange={(e) => setReactionData(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
        />
        <span>{reactionData.severity}</span>
      </div>

      <div>
        <label>Symptoms:</label>
        <ul>
          {reactionData.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
        <button type="button" onClick={handleSymptomAdd}>Add Symptom</button>
      </div>

      <div>
        <label>Triggers:</label>
        <ul>
          {reactionData.triggers.map((trigger, index) => (
            <li key={index}>{trigger}</li>
          ))}
        </ul>
        <button type="button" onClick={handleTriggerAdd}>Add Trigger</button>
      </div>

      <div>
        <label>Notes:</label>
        <textarea
          value={reactionData.notes}
          onChange={(e) => setReactionData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div>
        <label>Photos:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Reaction'}
      </button>
    </form>
  );
};

export default ReactionForm;