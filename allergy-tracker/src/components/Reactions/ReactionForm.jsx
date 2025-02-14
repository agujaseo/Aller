import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './ReactionForm.css';

const ReactionForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    symptoms: [],
    severity: '1',
    notes: '',
    medication: '',
  });

  const symptoms = [
    'Picazón',
    'Urticaria',
    'Hinchazón',
    'Dificultad para respirar',
    'Estornudos',
    'Congestión nasal',
    'Ojos llorosos',
    'Náuseas',
    'Dolor abdominal',
    'Mareos'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedSymptoms = checked
        ? [...formData.symptoms, value]
        : formData.symptoms.filter(symptom => symptom !== value);
      
      setFormData(prev => ({
        ...prev,
        symptoms: updatedSymptoms
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reactionData = {
        ...formData,
        date: new Date(formData.date + 'T' + formData.time),
        userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'reactions'), reactionData);
      
      // Resetear el formulario
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        symptoms: [],
        severity: '1',
        notes: '',
        medication: '',
      });

      alert('Reacción registrada con éxito');
    } catch (error) {
      console.error('Error al guardar la reacción:', error);
      alert('Error al guardar la reacción');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reaction-form">
      <h2>Registrar Nueva Reacción</h2>
      
      <div className="form-group">
        <label>Fecha y Hora</label>
        <div className="datetime-group">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Síntomas</label>
        <div className="symptoms-grid">
          {symptoms.map(symptom => (
            <label key={symptom} className="symptom-checkbox">
              <input
                type="checkbox"
                name="symptoms"
                value={symptom}
                checked={formData.symptoms.includes(symptom)}
                onChange={handleChange}
              />
              {symptom}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Severidad</label>
        <input
          type="range"
          name="severity"
          min="1"
          max="5"
          value={formData.severity}
          onChange={handleChange}
          className="severity-slider"
        />
        <div className="severity-labels">
          <span>Leve</span>
          <span>Moderada</span>
          <span>Severa</span>
        </div>
      </div>

      <div className="form-group">
        <label>Medicación Tomada</label>
        <input
          type="text"
          name="medication"
          value={formData.medication}
          onChange={handleChange}
          placeholder="Medicamentos utilizados"
        />
      </div>

      <div className="form-group">
        <label>Notas Adicionales</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Observaciones adicionales..."
          rows="4"
        />
      </div>

      <button type="submit" className="submit-button">
        Registrar Reacción
      </button>
    </form>
  );
};

export default ReactionForm;