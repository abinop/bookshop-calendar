import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales/el';

export default function Calendar({ 
  isAdmin = false, 
  events, 
  onEventDrop, 
  onEventResize,
  onSelect,
  onEventClick
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="el"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      buttonText={{
        today: 'Σήμερα',
        month: 'Μήνας',
        week: 'Εβδομάδα',
        day: 'Ημέρα'
      }}
      editable={isAdmin}
      selectable={isAdmin}
      selectMirror={isAdmin}
      dayMaxEvents={true}
      events={events}
      eventDrop={onEventDrop}
      eventResize={onEventResize}
      select={onSelect}
      eventClick={isAdmin ? onEventClick : undefined}
      locales={allLocales}
    />
  );
} 