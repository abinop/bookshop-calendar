import { createContext, useContext, useState, useCallback } from 'react';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    event: null
  });

  const handleEventClick = useCallback((eventData) => {
    console.log('handleEventClick called with:', eventData);
    
    // Force synchronous update
    setModalState({
      isOpen: true,
      event: eventData
    });
    
    console.log('Modal state updated');
  }, []);

  const closeModal = useCallback(() => {
    console.log('closeModal called');
    setModalState({
      isOpen: false,
      event: null
    });
  }, []);

  const value = {
    isModalOpen: modalState.isOpen,
    selectedEvent: modalState.event,
    handleEventClick,
    closeModal
  };

  console.log('Provider rendering with:', value);

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
}
