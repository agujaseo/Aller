import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { getReactions } from '../services/reactionService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentReactions, setRecentReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);

        // Fetch recent reactions (last 5)
        const reactions = await getReactions(currentUser.uid);
        setRecentReactions(reactions.slice(0, 5));
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {profile?.name || 'User'}!</h1>
      
      <div className="dashboard-summary">
        <div className="profile-summary">
          <h2>Your Profile</h2>
          <p>Age: {profile?.age || 'Not set'}</p>
          <h3>Known Allergies</h3>
          {profile?.knownAllergies?.length > 0 ? (
            <ul>
              {profile.knownAllergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          ) : (
            <p>No known allergies recorded</p>
          )}
        </div>

        <div className="reactions-summary">
          <h2>Recent Reactions</h2>
          {recentReactions.length > 0 ? (
            <ul>
              {recentReactions.map((reaction) => (
                <li key={reaction.id}>
                  <strong>Date:</strong> {reaction.date}
                  <strong>Severity:</strong> {reaction.severity}/5
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent reactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;