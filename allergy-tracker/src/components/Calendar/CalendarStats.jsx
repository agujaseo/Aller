import React from 'react';
import './Calendar.css';

const CalendarStats = ({ reactions, vaccines, currentDate }) => {
  const getMonthStats = () => {
    const totalReactions = reactions.length;
    const totalVaccines = vaccines.length;
    
    // Calcular severidad promedio de reacciones
    const avgSeverity = reactions.length > 0
      ? (reactions.reduce((sum, r) => sum + parseInt(r.severity), 0) / reactions.length).toFixed(1)
      : 0;

    // Encontrar síntomas más comunes
    const symptomsCount = reactions.reduce((acc, reaction) => {
      if (reaction.symptoms) {
        reaction.symptoms.forEach(symptom => {
          acc[symptom] = (acc[symptom] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const commonSymptoms = Object.entries(symptomsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([symptom]) => symptom);

    return {
      totalReactions,
      totalVaccines,
      avgSeverity,
      commonSymptoms
    };
  };

  const stats = getMonthStats();

  return (
    <div className="calendar-stats">
      <h4>Estadísticas del Mes</h4>
      <div className="stats-grid">
        <div className="stat-item">
          <label>Total Reacciones:</label>
          <span>{stats.totalReactions}</span>
        </div>
        <div className="stat-item">
          <label>Total Vacunas:</label>
          <span>{stats.totalVaccines}</span>
        </div>
        <div className="stat-item">
          <label>Severidad Promedio:</label>
          <span>{stats.avgSeverity}</span>
        </div>
        {stats.commonSymptoms.length > 0 && (
          <div className="stat-item symptoms">
            <label>Síntomas más comunes:</label>
            <ul>
              {stats.commonSymptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarStats;