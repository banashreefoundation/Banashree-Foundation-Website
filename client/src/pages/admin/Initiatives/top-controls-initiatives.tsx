"use client"
import { useState } from "react";
import Modal from "./Modal";

export function TopControlsInitiatives() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const addInitiatives = () => {
    setModalContent({type: 'create', data: {}});
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mt-10 pr-4">
            <button onClick={() => addInitiatives()} className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400 btn" >Create Initiative</button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        input={modalContent}
      /> 
    </>
  );
}
