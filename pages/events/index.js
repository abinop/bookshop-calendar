import { useState, useEffect } from 'react';
import Calendar from '../../components/Calendar';

export default function EventsCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη των εκδηλώσεων:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ημερολόγιο Εκδηλώσεων</h1>
      <Calendar 
        isAdmin={false}
        events={events}
      />
    </div>
  );
} 