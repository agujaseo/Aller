import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getReactions, deleteReaction } from '../../services/reactionService';

const ReactionList = () => {
  const { currentUser } = useAuth();
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const userReactions = await getReactions(currentUser.uid);
        setReactions(userReactions);
      } catch (error) {
        setError('Error loading reactions');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchReactions();
    }
  }, [currentUser]);

  const handleDeleteReaction = async (reactionId) => {
    if (window.confirm('Are you sure you want to delete this reaction?')) {
      try {
        await deleteReaction(currentUser.uid, reactionId);
        setReactions(prev => prev.filter(reaction => reaction.id !== reactionId));
      } catch (error) {
        setError('Error deleting reaction');
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="reaction-list">
      <h2>Allergic Reactions</h2>
      <div className="reactions">
        {reactions.length === 0 ? (
          <p>No reactions recorded yet.</p>
        ) : (
          reactions.map((reaction) => (
            <div key={reaction.id} className="reaction-card">
              <h3>Reaction on {reaction.date}</h3>
              <div className="reaction-details">
                <p><strong>Severity:</strong> {reaction.severity}/5</p>
                <div>
                  <strong>Symptoms:</strong>
                  <ul>
                    {reaction.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Triggers:</strong>
                  <ul>
                    {reaction.triggers.map((trigger, index) => (
                      <li key={index}>{trigger}</li>
                    ))}
                  </ul>
                </div>
                <p><strong>Notes:</strong> {reaction.notes}</p>
                {reaction.photos && reaction.photos.length > 0 && (
                  <div className="reaction-photos">
                    <strong>Photos:</strong>
                    <div className="photo-grid">
                      {reaction.photos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Reaction photo ${index + 1}`} />
                      ))}
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => handleDeleteReaction(reaction.id)}
                  className="delete-button"
                >
                  Delete Reaction
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReactionList;