import { useEventContext } from '../contexts/EventContext';

export default function EventModal() {
  const { isModalOpen, selectedEvent, closeModal } = useEventContext();

  console.log('EventModal rendering:', { isModalOpen, selectedEvent });

  if (!isModalOpen || !selectedEvent) {
    return null;
  }

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
            <div className="mb-4">
              <p className="mb-2">
                <span className="font-semibold">Start:</span> {selectedEvent.start}
              </p>
              <p className="mb-2">
                <span className="font-semibold">End:</span> {selectedEvent.end}
              </p>
              {selectedEvent.description && (
                <div>
                  <span className="font-semibold">Description:</span>
                  <div dangerouslySetInnerHTML={{ __html: selectedEvent.description }} />
                </div>
              )}
            </div>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} 