import React from 'react';
import { 
  FaFirstAid,      // Para reacciones 
  FaSyringe,       // Para vacunas
  FaExclamationTriangle  // Para eventos mixtos
} from 'react-icons/fa';
import './Calendar.css';

const CalendarLegend = () => {
  return (
    <div className="calendar-legend">
      <h4>Leyenda de Eventos</h4>
      <div className="legend-items">
        <div className="legend-item">
          <FaFirstAid className="legend-icon reaction-icon" />
          <span>Reacción Alérgica</span>
        </div>
        <div className="legend-item">
          <FaSyringe className="legend-icon vaccine-icon" />
          <span>Vacuna</span>
        </div>
        <div className="legend-item">
          <FaExclamationTriangle className="legend-icon mixed-icon" />
          <span>Evento Mixto</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;