import { useState, useEffect } from 'react';
import Calendar from '../../components/Calendar';
import EventModal from '../../components/EventModal';
import { useEventContext } from '../../contexts/EventContext';

export default function EventsCalendar() {
  const [events, setEvents] = useState([]);
  const { handleEventClick } = useEventContext();
  const [showTestModal, setShowTestModal] = useState(false);

  // Test modal on page load
  useEffect(() => {
    setTimeout(() => {
      setShowTestModal(true);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Ημερολόγιο Εκδηλώσεων</h1>
          <Calendar 
            isAdmin={false}
            events={events}
          />
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTestModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Test Modal</h2>
            <p className="mb-4">This is a test modal to verify modal functionality.</p>
            <button
              onClick={() => setShowTestModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close Test Modal
            </button>
          </div>
        </div>
      )}

      <EventModal />
    </>
  );
} 