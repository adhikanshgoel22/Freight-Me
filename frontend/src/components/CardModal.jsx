import React, { useState, useEffect } from "react";

export default function EditableCardModal({
  card,
  onClose,
  onSave,
  onDownload,
  EXPORT_COLUMNS,
  ColTitle,
  disableFastCourier = false,
  onCourier,
  onDelete
}) {
  const [editableCard, setEditableCard] = useState({ ...card });

  useEffect(() => {
    setEditableCard({ ...card });
  }, [card]);

  const handleChange = (col, value) => {
    setEditableCard((prev) => ({
      ...prev,
      [col]: value,
    }));
  };

  const handleSave = () => {
    if (!editableCard.Name) {
      alert("Please enter a Name for the card.");
      return;
    }
    onSave(editableCard);
  };

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
          <input
            type="text"
            placeholder="Card Name"
            value={editableCard.Name || ""}
            onChange={(e) => setEditableCard({ ...editableCard, Name: e.target.value })}
            className="text-xl font-semibold text-blue-800 border-b border-blue-300 w-full"
          />
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
              <label className="text-gray-700 font-medium">{ColTitle[i]}</label>
              <input
                type="text"
                value={editableCard[col] || ""}
                onChange={(e) => handleChange(col, e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 mt-1"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this card?")) {
                onDelete && onDelete(editableCard);
                onClose();
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>

            <button
              onClick={() => {
                onDownload && onDownload(editableCard);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connote
            </button>

            {!disableFastCourier && (
              <button
                onClick={() => onCourier && onCourier(editableCard)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                FastCourier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
