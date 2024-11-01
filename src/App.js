// src/App.js
import React from 'react';
import './App.css';
import BookshopCalendar from './components/BookshopCalendar';

function App() {
  return (
    <div className="App">
      <div className="p-4">
        <BookshopCalendar />
      </div>
    </div>
  );
}

export default App;