import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEventContext } from '../contexts/EventContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export default function Calendar({ isAdmin = false, events = [] }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { handleEventClick: contextHandleEventClick } = useEventContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleEventClick = (event) => {
    contextHandleEventClick({
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description,
      id: event.id
    });
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow">
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: el })}
          </h2>
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            →
          </button>
        </div>

        <div className="space-y-2">
          {events
            .filter(event => {
              const eventDate = new Date(event.start);
              return eventDate.getMonth() === currentMonth.getMonth() &&
                     eventDate.getFullYear() === currentMonth.getFullYear();
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .map(event => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {format(new Date(event.start), 'EEEE, d MMMM', { locale: el })}
                </div>
                {event.description && (
                  <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={({ event }) => handleEventClick({
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.extendedProps.description,
        id: event.id
      })}
      // ... rest of your existing FullCalendar props
    />
  );
} 