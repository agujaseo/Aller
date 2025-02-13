import React from 'react';
import ReactionList from '../../components/Reactions/ReactionList';
import ReactionForm from '../../components/Reactions/ReactionForm';

const ReactionsPage = () => {
  // TODO: Get userId from authentication context
  const userId = 'current-user-id';

  const handleReactionSubmit = async (reactionData) => {
    try {
      // TODO: Save reaction to database
      console.log('Saving reaction:', reactionData);
    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  return (
    <div className="reactions-page">
      <ReactionForm userId={userId} onSubmit={handleReactionSubmit} />
      <ReactionList userId={userId} />
    </div>
  );
};

export default ReactionsPage;