import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './Calendar.css';

// Funciones auxiliares para reemplazar date-fns
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

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const Calendar = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    const fetchReactions = async () => {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const reactionRef = collection(db, 'reactions');
      const q = query(
        reactionRef,
        where('userId', '==', userId),
        where('date', '>=', start),
        where('date', '<=', end)
      );

      const querySnapshot = await getDocs(q);
      const reactionDates = querySnapshot.docs.map(doc => doc.data().date.toDate());
      setReactions(reactionDates);
    };

    fetchReactions();
  }, [currentDate, userId]);

  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Ajustar el primer día de la semana (0 = Domingo, 1 = Lunes)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Días del mes anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        currentMonth: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length; // 6 semanas * 7 días = 42
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={previousMonth}>&lt;</button>
        <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {getDaysArray().map(({ date, currentMonth }) => (
          <div
            key={date.toString()}
            className={`calendar-day ${
              !currentMonth ? 'different-month' : ''
            } ${reactions.some(reaction => isSameDay(reaction, date)) ? 'has-reaction' : ''}`}
          >
            {date.getDate()}
            {reactions.some(reaction => isSameDay(reaction, date)) && (
              <span className="reaction-indicator">🔴</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;