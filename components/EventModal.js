import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export default function EventModal({ event, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
    ],
    content: '',
  });

  useEffect(() => {
    if (event && editor) {
      setTitle(event.title || '');
      setStartDate(event.start ? new Date(event.start).toISOString().slice(0, 16) : '');
      setEndDate(event.end ? new Date(event.end).toISOString().slice(0, 16) : '');
      editor.commands.setContent(event.description || '');
    }
  }, [event, editor]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: event?._id,
      title,
      description: editor.getHTML(),
      start: new Date(startDate),
      end: new Date(endDate),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {event?._id ? 'Επεξεργασία Εκδήλωσης' : 'Νέα Εκδήλωση'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Τίτλος:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Από:</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (!endDate || new Date(endDate) < new Date(e.target.value)) {
                    setEndDate(e.target.value);
                  }
                }}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Έως:</label>
              <input
                type="datetime-local"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Περιγραφή:</label>
            <div className="border rounded p-2">
              <div className="mb-2 border-b pb-2">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 mr-1 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 mr-1 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt('URL:');
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  className={`p-1 mr-1 ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
                >
                  Link
                </button>
              </div>
              <EditorContent editor={editor} className="min-h-[200px] prose max-w-none" />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Αποθήκευση
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 