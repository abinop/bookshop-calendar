import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Plus, X, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { eventService } from '../services/eventService';

const BookshopCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: '2024-11-05', title: 'Book Signing', description: 'Local author book signing event' },
    { id: 2, date: '2024-11-15', title: 'Reading Club', description: 'Monthly reading club meeting' }
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await eventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const formatDate = (day) => {
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${formattedDay}`;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  const handleAddEvent = async () => {
    try {
      const createdEvent = await eventService.createEvent(newEvent);
      setEvents([...events, createdEvent]);
      setNewEvent({ title: '', description: '', date: '' });
      setIsDialogOpen(false);
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({ ...event });
    setIsDialogOpen(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const updatedEvent = await eventService.updateEvent(editingEvent.id, newEvent);
      setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
      setNewEvent({ title: '', description: '', date: '' });
      setEditingEvent(null);
      setIsDialogOpen(false);
    } catch (err) {
      setError('Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const openNewEventDialog = (date) => {
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date });
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(day);
    const dayEvents = getEventsForDate(date);
    
    days.push(
      <div 
        key={day} 
        className={`p-2 min-h-16 border border-gray-200 relative hover:bg-gray-50 transition-colors
          ${dayEvents.length > 0 ? 'bg-blue-50' : ''}`}
        onClick={() => openNewEventDialog(date)}
      >
        <span className="absolute top-1 left-1 text-sm">{day}</span>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="mt-4 p-1 text-xs bg-blue-100 rounded group relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center gap-1">
              <span className="truncate">{event.title}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="p-1 hover:bg-blue-200 rounded"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-1 hover:bg-blue-200 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-600 truncate">
              {event.description}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
          <Button onClick={() => setError(null)} className="mt-2">Dismiss</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bookshop Events Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium border-b">
              {day}
            </div>
          ))}
          {days}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Λεπτομέρειες</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event description"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Ημερομηνία</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                  {editingEvent ? 'Ενημέρωση' : 'Προσθέσε'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BookshopCalendar;