import { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales/el';
import { useEventContext } from '../contexts/EventContext';

export default function Calendar({ isAdmin = false, events = [] }) {
  const { handleEventClick } = useEventContext();
  
  const handleCalendarEventClick = useCallback((clickInfo) => {
    const eventData = {
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      description: clickInfo.event.extendedProps?.description || '',
      id: clickInfo.event.id || ''
    };
    
    handleEventClick(eventData);
  }, [handleEventClick]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="el"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      editable={isAdmin}
      selectable={isAdmin}
      selectMirror={isAdmin}
      dayMaxEvents={true}
      events={events}
      eventClick={handleCalendarEventClick}
    />
  );
} 