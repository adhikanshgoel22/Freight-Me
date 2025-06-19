import React from "react";

export default function ClientCardModal({
  card,
  onClose,
  onDownload,
  EXPORT_COLUMNS,
  ColTitle,
  disableFastCourier = false,
  onCourier
}) {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full transform transition-all scale-100 hover:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-800">
            {card.Name || "Untitled"}
          </h3>
          <button
            onClick={onClose}
            className="text-red-600 text-2xl font-bold hover:text-red-800 ml-4"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-sm">
          {EXPORT_COLUMNS.map((col, i) => (
            <div key={col} className="flex flex-col">
              <label className="text-gray-700 font-medium">
                {ColTitle[i]}
              </label>
              <input
                type="text"
                value={card[col] || ""}
                readOnly
                className="border border-gray-300 rounded px-3 py-1 mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => {
              onDownload && onDownload(card);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connote
          </button>

          {!disableFastCourier && (
            <button
              onClick={() => onCourier && onCourier(card)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              FastCourier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
