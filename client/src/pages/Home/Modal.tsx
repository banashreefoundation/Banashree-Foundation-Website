import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto max-h-[90vh]">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 absolute top-2 right-2"
          >
            &times;
          </button>
          <div className="overflow-y-auto max-h-[80vh]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
