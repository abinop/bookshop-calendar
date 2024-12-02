import { useState, useEffect } from 'react';
import { useEventContext } from '../../contexts/EventContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const { closeModal } = useEventContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: ''
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        description: editor.getHTML()
      }));
    }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editingEvent && editor) {
      // Format dates for datetime-local input
      const formatDateForInput = (dateStr) => {
        const date = new Date(dateStr);
        // Format date to local datetime string
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, 16);
      };

      editor.commands.setContent(editingEvent.description || '');
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || '',
        start: formatDateForInput(editingEvent.start),
        end: formatDateForInput(editingEvent.end)
      });
    } else if (editor) {
      // Clear form for new event
      editor.commands.setContent('');
      setFormData({
        title: '',
        description: '',
        start: '',
        end: ''
      });
    }
  }, [editingEvent, editor]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('el-GR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Athens'
    });
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchEvents();
        } else {
          console.error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const formatTimeForInput = (date) => {
    if (!date) return '';
    // Ensure date is treated as local time
    const d = new Date(date);
    return d.toLocaleTimeString('el-GR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingEvent 
        ? `/api/events/${editingEvent._id}`
        : '/api/events';
      
      const method = editingEvent ? 'PUT' : 'POST';

      // Create dates in local timezone
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.end);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchEvents();
      } else {
        console.error('Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    const setLink = () => {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    return (
      <div className="border-b border-gray-200 pb-2 mb-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Bullet List
        </button>
        <button
          onClick={setLink}
          className={`px-2 py-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          type="button"
        >
          Link
        </button>
        {editor.isActive('link') && (
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="px-2 py-1 rounded hover:bg-gray-100"
            type="button"
          >
            Unlink
          </button>
        )}
      </div>
    );
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
                setEditingEvent(null);
                setShowEditModal(true);
              }}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              Νέα Εκδήλωση
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white shadow-sm rounded-lg">
          <ul className="divide-y divide-gray-200">
            {events
              .sort((a, b) => new Date(b.start) - new Date(a.start))
              .map((event) => (
                <li key={event._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(event.start)} - {formatDate(event.end)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setShowEditModal(true);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Event Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="prose prose-sm mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <MenuBar />
                    <EditorContent editor={editor} className="min-h-[200px] p-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 