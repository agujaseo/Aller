import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useReactions } from '../../contexts/ReactionsContext';
import CalendarLegend from './CalendarLegend';
import CalendarStats from './CalendarStats';
import { 
  FaFirstAid,      // Para reacciones 
  FaSyringe,       // Para vacunas
  FaExclamationTriangle  // Para eventos mixtos
} from 'react-icons/fa';
import './Calendar.css';

const EventModal = ({ event, onClose, onSave, onDelete }) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(editedEvent);
    onClose();
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <h2>Editar {event.type === 'reaction' ? 'Reacción' : 'Vacuna'}</h2>
        
        {event.type === 'reaction' && (
          <>
            <div className="modal-form-group">
              <label>Severidad</label>
              <input
                type="range"
                name="severity"
                min="1"
                max="5"
                value={editedEvent.severity}
                onChange={handleChange}
              />
              <span>{editedEvent.severity}/5</span>
            </div>
            <div className="modal-form-group">
              <label>Desencadenante</label>
              <input
                type="text"
                name="trigger"
                value={editedEvent.trigger || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {event.type === 'vaccine' && (
          <>
            <div className="modal-form-group">
              <label>Tipo de Vacuna</label>
              <input
                type="text"
                name="type"
                value={editedEvent.type || ''}
                onChange={handleChange}
              />
            </div>
            <div className="modal-form-group">
              <label>Concentración</label>
              <input
                type="text"
                name="concentration"
                value={editedEvent.concentration || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="modal-form-group">
          <label>Notas</label>
          <textarea
            name="notes"
            value={editedEvent.notes || ''}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => onDelete(event)} className="delete-button">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>Confirmar Eliminación</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Sí, eliminar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const Calendar = ({ userId }) => {
  const { shouldRefreshCalendar } = useReactions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reactions, setReactions] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [view, setView] = useState('month'); // 'month' o 'week'
  const [filters, setFilters] = useState({
    showReactions: true,
    showVaccines: true
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      console.log('Fetching events for:', { 
        userId, 
        start: start.toISOString(), 
        end: end.toISOString(),
        shouldRefreshCalendar 
      });
      
      // Fetch Reactions
      const reactionRef = collection(db, 'reactions');
      const reactionQuery = query(
        reactionRef,
        where('userId', '==', userId),
        where('date', '>=', start),
        where('date', '<=', end)
      );
      const reactionSnapshot = await getDocs(reactionQuery);
      const reactionDates = reactionSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Reaction data:', data);
        return {
          ...data,
          id: doc.id,
          type: 'reaction',
          date: data.date
        };
      });

      // Fetch Vaccines
      const vaccineRef = collection(db, 'vaccines');
      const vaccineQuery = query(
        vaccineRef,
        where('userId', '==', userId),
        where('date', '>=', start),
        where('date', '<=', end)
      );
      const vaccineSnapshot = await getDocs(vaccineQuery);
      const vaccineDates = vaccineSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Vaccine data:', data);
        return {
          ...data,
          id: doc.id,
          type: 'vaccine',
          date: data.date
        };
      });

      console.log('Reactions:', reactionDates);
      console.log('Vaccines:', vaccineDates);

      setReactions(reactionDates);
      setVaccines(vaccineDates);
    };

    fetchEvents();
  }, [currentDate, userId, shouldRefreshCalendar]);

  const getMonthName = (month) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isSameDay = (firestoreDate, comparisonDate) => {
    // Convertir la fecha de Firestore a un objeto Date si es necesario
    const date1 = firestoreDate instanceof Date ? firestoreDate : firestoreDate.toDate();
    
    return date1.getDate() === comparisonDate.getDate() &&
           date1.getMonth() === comparisonDate.getMonth() &&
           date1.getFullYear() === comparisonDate.getFullYear();
  };

  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        currentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      const dayReactions = reactions.filter(r => isSameDay(r.date.toDate(), currentDay));
      const dayVaccines = vaccines.filter(v => isSameDay(v.date.toDate(), currentDay));

      days.push({
        date: currentDay,
        currentMonth: true,
        hasReaction: dayReactions.length > 0,
        hasVaccine: dayVaccines.length > 0
      });
    }

    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        currentMonth: false
      });
    }

    return days;
  };

  const handleEditEvent = async (editedEvent) => {
    try {
      const collectionName = editedEvent.type === 'reaction' ? 'reactions' : 'vaccines';
      const eventRef = doc(db, collectionName, editedEvent.id);
      
      // Eliminar campos que no deben actualizarse
      const updateData = { ...editedEvent };
      delete updateData.id;
      delete updateData.type;
      delete updateData.date;

      await updateDoc(eventRef, updateData);

      // Actualizar el estado local
      if (editedEvent.type === 'reaction') {
        setReactions(prev => 
          prev.map(r => r.id === editedEvent.id ? { ...r, ...updateData } : r)
        );
      } else {
        setVaccines(prev => 
          prev.map(v => v.id === editedEvent.id ? { ...v, ...updateData } : v)
        );
      }

      // Actualizar eventos del día seleccionado
      setSelectedDayEvents(prev => 
        prev.map(event => 
          event.id === editedEvent.id ? { ...event, ...updateData } : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
      alert("No se pudo actualizar el evento");
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      const collectionName = event.type === 'reaction' ? 'reactions' : 'vaccines';
      await deleteDoc(doc(db, collectionName, event.id));
      
      // Actualizar eventos del día
      setSelectedDayEvents(selectedDayEvents.filter(e => e.id !== event.id));
      
      // Actualizar listas principales
      if (event.type === 'reaction') {
        setReactions(reactions.filter(r => r.id !== event.id));
      } else {
        setVaccines(vaccines.filter(v => v.id !== event.id));
      }

      // Cerrar modales
      setConfirmDelete(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("No se pudo eliminar el evento");
    }
  };

  const handleDayClick = (day) => {
    if (day.currentMonth) {
      setSelectedDate(day.date);
      const dayReactions = reactions.filter(r => isSameDay(r.date.toDate(), day.date));
      const dayVaccines = vaccines.filter(v => isSameDay(v.date.toDate(), day.date));
      setSelectedDayEvents([...dayReactions, ...dayVaccines]);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: endOfWeek(start, { weekStartsOn: 1 }) });
  };

  const exportData = () => {
    const data = {
      reactions: reactions.map(r => ({
        ...r,
        date: r.date.toDate().toISOString(),
      })),
      vaccines: vaccines.map(v => ({
        ...v,
        date: v.date.toDate().toISOString(),
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allertrack-export-${format(currentDate, 'yyyy-MM')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="week-view">
        <div className="time-header"></div>
        {weekDays.map(day => (
          <div key={day.toString()} className="day-header">
            {format(day, 'EEE d', { locale: es })}
          </div>
        ))}
        
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="time-slot">
              {`${hour}:00`}
            </div>
            {weekDays.map(day => {
              const dayEvents = [...reactions, ...vaccines].filter(event => {
                const eventDate = event.date.toDate();
                return eventDate.getDate() === day.getDate() &&
                       eventDate.getMonth() === day.getMonth() &&
                       eventDate.getHours() === hour;
              });

              return (
                <div key={day.toString()} className="week-slot">
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`week-event ${event.type}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.type === 'reaction' ? 'Reacción' : 'Vacuna'}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <div className="view-selector">
          <button
            className={view === 'month' ? 'active' : ''}
            onClick={() => setView('month')}
          >
            Vista Mensual
          </button>
          <button
            className={view === 'week' ? 'active' : ''}
            onClick={() => setView('week')}
          >
            Vista Semanal
          </button>
        </div>

        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={filters.showReactions}
              onChange={(e) => setFilters(prev => ({ ...prev, showReactions: e.target.checked }))}
            />
            Reacciones
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.showVaccines}
              onChange={(e) => setFilters(prev => ({ ...prev, showVaccines: e.target.checked }))}
            />
            Vacunas
          </label>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={view === 'month' ? previousMonth : previousWeek}>&lt;</button>
          <h2>
            {view === 'month'
              ? `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`
              : `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })}`
            }
          </h2>
          <button onClick={view === 'month' ? nextMonth : nextWeek}>&gt;</button>
        </div>

        {view === 'month' ? (
          <div className="calendar-grid">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {getDaysArray().map(({ date, currentMonth, hasReaction, hasVaccine }) => {
              // Aplicar filtros
              const showDay = (hasReaction && filters.showReactions) || 
                            (hasVaccine && filters.showVaccines) ||
                            (!hasReaction && !hasVaccine);

              const dayEvents = [...reactions, ...vaccines].filter(event => 
                isSameDay(event.date.toDate(), date)
              );

              return (
                <div
                  key={date.toString()}
                  className={`calendar-day 
                    ${!currentMonth ? 'different-month' : ''} 
                    ${showDay && hasReaction && hasVaccine ? 'has-mixed-event' : ''}
                    ${showDay && hasReaction && !hasVaccine ? 'has-reaction' : ''}
                    ${showDay && !hasReaction && hasVaccine ? 'has-vaccine' : ''}`}
                  onClick={() => handleDayClick({ date, currentMonth })}
                >
                  {date.getDate()}
                  {dayEvents.length > 0 && (
                    <div className="event-indicator">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        event.type === 'reaction' ? (
                          <FaFirstAid key={index} className="event-icon reaction-icon" />
                        ) : (
                          <FaSyringe key={index} className="event-icon vaccine-icon" />
                        )
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="multiple-events-indicator">
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderWeekView()
        )}
      </div>

      <CalendarLegend />
      <CalendarStats
        reactions={reactions}
        vaccines={vaccines}
        currentDate={currentDate}
      />

      <button className="export-button" onClick={exportData}>
        Exportar Datos
      </button>

      {selectedDate && (
        <div className="day-events">
          <h3>Eventos del {selectedDate.getDate()} de {getMonthName(selectedDate.getMonth())} {selectedDate.getFullYear()}</h3>
          {selectedDayEvents.length === 0 ? (
            <p>No hay eventos para este día</p>
          ) : (
            <div className="events-list">
              {selectedDayEvents.map((event, index) => (
                <div key={index} className={`event-item ${event.type}`}>
                  <div className="event-details">
                    <p>
                      {event.type === 'reaction' ? 'Reacción' : 'Vacuna'}
                      {event.type === 'reaction' && ` - Severidad: ${event.severity}`}
                    </p>
                    <p>{event.trigger || event.type}</p>
                    <p>{event.notes}</p>
                  </div>
                  <div className="event-actions">
                    <button onClick={() => setSelectedEvent(event)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleEditEvent}
          onDelete={(event) => setConfirmDelete(event)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`¿Estás seguro de eliminar este ${confirmDelete.type === 'reaction' ? 'registro de reacción' : 'registro de vacuna'}?`}
          onConfirm={() => handleDeleteEvent(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default Calendar;