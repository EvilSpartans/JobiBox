import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const GoBack = ({ itemToRemove }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);

        if (itemToRemove) {
            localStorage.removeItem(itemToRemove);
        }
    };

    return (
        <div className="fixed top-4 left-4">
            <button
                className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                onClick={handleBack}
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Retour
            </button>
        </div>
    );
};

export default GoBack;
