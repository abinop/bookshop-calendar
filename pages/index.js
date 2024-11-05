import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import { useEventContext } from '../contexts/EventContext';

export default function Home() {
  const [events, setEvents] = useState([]);
  const { isModalOpen, selectedEvent, closeModal } = useEventContext();

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('el-GR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ημερολόγιο Εκδηλώσεων</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Calendar 
            isAdmin={false}
            events={events}
          />
        </div>

        {/* Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {selectedEvent.title}
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="font-medium">Start:</span> {formatDate(selectedEvent.start)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">End:</span> {formatDate(selectedEvent.end)}
                </p>
                {selectedEvent.description && (
                  <div className="text-gray-700">
                    <span className="font-medium">Description:</span>
                    <div 
                      className="mt-2 prose prose-sm max-w-none prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800" 
                      dangerouslySetInnerHTML={{ __html: selectedEvent.description }} 
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 