import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile, addKnownAllergy, removeKnownAllergy } from '../../services/userService';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    knownAllergies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      } catch (error) {
        setError('Error loading profile');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleUpdateProfile = async (field, value) => {
    try {
      const updatedData = { [field]: value };
      await updateUserProfile(currentUser.uid, updatedData);
      setProfile(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      setError('Error updating profile');
      console.error('Error:', error);
    }
  };

  const handleAddAllergy = async () => {
    const allergy = prompt('Enter new allergy:');
    if (allergy) {
      try {
        await addKnownAllergy(currentUser.uid, allergy);
        setProfile(prev => ({
          ...prev,
          knownAllergies: [...prev.knownAllergies, allergy]
        }));
      } catch (error) {
        setError('Error adding allergy');
        console.error('Error:', error);
      }
    }
  };

  const handleRemoveAllergy = async (allergy) => {
    try {
      await removeKnownAllergy(currentUser.uid, allergy);
      setProfile(prev => ({
        ...prev,
        knownAllergies: prev.knownAllergies.filter(a => a !== allergy)
      }));
    } catch (error) {
      setError('Error removing allergy');
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleUpdateProfile('name', e.target.value)}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => handleUpdateProfile('age', e.target.value)}
          />
        </div>
      </div>

      <div className="known-allergies">
        <h3>Known Allergies</h3>
        <ul>
          {profile.knownAllergies.map((allergy, index) => (
            <li key={index}>
              {allergy}
              <button onClick={() => handleRemoveAllergy(allergy)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddAllergy}>Add Allergy</button>
      </div>
    </div>
  );
};

export default UserProfile;