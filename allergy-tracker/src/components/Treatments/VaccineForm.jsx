import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './VaccineForm.css';

const VaccineForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    type: '',
    concentration: '',
    dose: '',
    reactions: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vaccineData = {
        ...formData,
        date: new Date(formData.date + 'T' + formData.time),
        userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'vaccines'), vaccineData);
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        type: '',
        concentration: '',
        dose: '',
        reactions: '',
        notes: '',
      });

      alert('Vacuna registrada con éxito');
    } catch (error) {
      console.error('Error al guardar la vacuna:', error);
      alert('Error al guardar la vacuna');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vaccine-form">
      <h2>Registrar Vacuna/Insensibilización</h2>
      
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
        <label>Tipo de Vacuna/Tratamiento</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Ej: Ácaros, Polen, etc."
          required
        />
      </div>

      <div className="form-group">
        <label>Concentración</label>
        <input
          type="text"
          name="concentration"
          value={formData.concentration}
          onChange={handleChange}
          placeholder="Ej: 100 IR/mL"
        />
      </div>

      <div className="form-group">
        <label>Dosis</label>
        <input
          type="text"
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          placeholder="Ej: 0.5 mL"
          required
        />
      </div>


      <div className="form-group">
        <label>Reacciones</label>
        <textarea
          name="reactions"
          value={formData.reactions}
          onChange={handleChange}
          placeholder="¿Hubo alguna reacción después de la vacuna?"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Notas Adicionales</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Observaciones adicionales..."
          rows="3"
        />
      </div>

      <button type="submit" className="submit-button">
        Registrar Vacuna
      </button>
    </form>
  );
};

export default VaccineForm;