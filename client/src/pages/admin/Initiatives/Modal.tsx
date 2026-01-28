import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: {
    type: string;
    data: {
      id?: string;
      title?: string;
      tagLine?: string;
      description?: string;
      goal?: string;
      metrics?: [];
      endorsement?: string;
    };
  };
}

const labelForType = {
  view: "View",
  edit: "Update",
  create: "Create",
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, input }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    tagLine: "",
    description: "",
    goal: "",
    metrics: [],
    endorsement: "",
  });

  // Effect to set initial values from content when the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        title: input.data.title || "",
        tagLine: input.data.tagLine || "",
        description: input.data.description || "",
        goal: input.data.goal || "",
        metrics: input.data.metrics || [],
        endorsement: input.data.endorsement || "",
      });
    }
  }, [isOpen, input]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value, status: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-5xl relative">
        <div>
          <h2 className="text-xl font-bold mb-6">
            {labelForType[input.type]} Initiative
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500"
          >
            Close
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formValues.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Title"
            />
          </div>
          <div>
            <label
              htmlFor="tagLine"
              className="block text-sm font-medium text-gray-700"
            >
              Tag Line
            </label>
            <input
              type="text"
              id="tagLine"
              value={formValues.tagLine}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Tag Line"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formValues.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Tag Line"
            />
          </div>
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700"
            >
              Goal
            </label>
            <textarea
              id="goal"
              value={formValues.goal}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Goal"
            />
          </div>
          <div>
            <label
              htmlFor="metrics"
              className="block text-sm font-medium text-gray-700"
            >
              Metrics/Statistics
            </label>
            <textarea
              id="metrics"
              value={formValues.metrics}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Metrics/Statistics"
            />
          </div>
          <div className="flex justify-end">
            {input.type == "view" ? (
              <button
                onClick={onClose}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="bg-blue-500 mr-4 text-white p-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  {labelForType[input.type]}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
