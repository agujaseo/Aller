import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar/Calendar';
import ReactionForm from '../components/Reactions/ReactionForm';
import VaccineForm from '../components/Treatments/VaccineForm';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeForm, setActiveForm] = useState('reaction'); // 'reaction' or 'vaccine'

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <Calendar userId={currentUser.uid} />
      </div>
      
      <div className="dashboard-right">
        <div className="form-selector">
          <button
            className={`selector-button ${activeForm === 'reaction' ? 'active' : ''}`}
            onClick={() => setActiveForm('reaction')}
          >
            Reacciones
          </button>
          <button
            className={`selector-button ${activeForm === 'vaccine' ? 'active' : ''}`}
            onClick={() => setActiveForm('vaccine')}
          >
            Vacunas
          </button>
        </div>

        <div className="form-container">
          {activeForm === 'reaction' ? (
            <ReactionForm userId={currentUser.uid} />
          ) : (
            <VaccineForm userId={currentUser.uid} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;