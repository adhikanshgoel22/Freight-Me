import React from 'react';

export default function CardModal({ card, onClose, onDownload, disableFastCourier, EXPORT_COLUMNS, ColTitle }) {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full transform transition-all scale-100 hover:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-800">{card.Name || 'Untitled'}</h3>
          <button
            onClick={onClose}
            className="text-red-600 text-2xl font-bold hover:text-red-800"
          >
            &times;
          </button>
        </div>

        <div className="space-y-2 text-sm">
          {EXPORT_COLUMNS.map((col, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span className="font-medium text-gray-600">{ColTitle[i]}</span>
              <span className="text-gray-800 text-right max-w-[50%] break-words">
                {card[col] || '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => {
              onDownload(card);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Connote
          </button>
          
{!disableFastCourier && (
  <button
    // onClick={() => redirectToFastCourier(card)}
    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
  >
    FastCourier
  </button>
)}
{/* 
{disableFastCourier && (
  <p className="text-xs text-red-500 mt-1 hidden" ></p>
)} */}

        </div>
      </div>
    </div>
  );
}
