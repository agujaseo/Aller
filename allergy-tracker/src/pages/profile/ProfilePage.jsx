import React from 'react';
import UserProfile from '../../components/Profile/UserProfile';

const ProfilePage = () => {
  // TODO: Get userId from authentication context
  const userId = 'current-user-id';

  return (
    <div className="profile-page">
      <UserProfile userId={userId} />
    </div>
  );
};

export default ProfilePage;