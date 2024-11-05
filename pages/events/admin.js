import { useState, useEffect } from 'react';
import EventModal from '../../components/EventModal';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      console.log('All events:', data.map(event => ({
        _id: event._id,
        title: event.title
      })));
      setEvents(Array.isArray(data) ? data : []);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of events but got:', data);
      }
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη των εκδηλώσεων:', error);
      setEvents([]);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εκδήλωση;')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEvents();
        }
      } catch (error) {
        console.error('Σφάλμα κατά τη διαγραφή της εκδήλωσης:', error);
      }
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const method = eventData._id ? 'PUT' : 'POST';
      const url = eventData._id ? `/api/events/${eventData._id}` : '/api/events';
      
      const formattedEventData = {
        ...eventData,
        start: new Date(eventData.start).toISOString(),
        end: new Date(eventData.end).toISOString()
      };

      console.log('Event data before save:', {
        id: formattedEventData._id,
        title: formattedEventData.title,
        start: formattedEventData.start,
        end: formattedEventData.end
      });

      const body = method === 'POST' ? 
        { ...formattedEventData, _id: undefined } : 
        formattedEventData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save event:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          eventId: eventData._id,
          method,
          requestBody: body
        });
        alert('Failed to save event. Please try again.');
        return;
      }

      fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Σφάλμα κατά την αποθήκευση της εκδήλωσης:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('el-GR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Διαχείριση Εκδηλώσεων
            </h2>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={() => {
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              Νέα Εκδήλωση
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Τίτλος
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Από
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Έως
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Περιγραφή
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ενέργειες
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.start)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.end)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        <div dangerouslySetInnerHTML={{ __html: event.description }} className="prose prose-sm max-w-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Επεξεργασία
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Διαγραφή
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {events.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Δεν υπάρχουν εκδηλώσεις</h3>
                <p className="mt-1 text-sm text-gray-500">Ξεκινήστε δημιουργώντας μια νέα εκδήλωση.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
      />
    </div>
  );
} 