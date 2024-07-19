import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

const GoBack = ({ itemsToRemove = [] }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);

        itemsToRemove.forEach(item => {
            localStorage.removeItem(item);
        });
    };

    return (
        <div className="fixed top-4 left-4">
            <button
                className="flex items-center hover:text-blue-700 focus:outline-none text-lg font-bold p-2 blinking"
                onClick={handleBack}
            >
                <FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />
                Retour
            </button>
        </div>
    );
};

export default GoBack;
