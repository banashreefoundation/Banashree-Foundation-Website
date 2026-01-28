import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title?: string;
    email?: string;
    donation?: string;
    status?: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    donation: "",
    status: "",
  });

  // Effect to set initial values from content when the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: content.title || "",
        email: content.email || "",
        donation: content.donation || "",
        status: content.status || "",
      });
    }
  }, [isOpen, content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value, status: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500"
        >
          Close
        </button>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formValues.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label
              htmlFor="donation"
              className="block text-sm font-medium text-gray-700"
            >
              Donation
            </label>
            <input
              type="text"
              id="donation"
              value={formValues.donation}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter donation"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={formValues.status}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={formValues.status}>{formValues.status}</option>
              <option value="Processing">Processing</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md btn"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
