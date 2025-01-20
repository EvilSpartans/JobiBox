import React from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title }) {

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
              <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                <p className="text-gray-800 text-xl">{title}</p>
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={onConfirm}
                  >
                    Oui
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={onClose}
                  >
                    Non
                  </button>
                </div>
              </div>
            </div>
          )
    );
}
