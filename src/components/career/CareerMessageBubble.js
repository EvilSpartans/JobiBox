import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PulseLoader from 'react-spinners/PulseLoader';

export function CareerMessageUser({ text }) {
  return (
    <div className="flex justify-end gap-2 items-end mb-1">
      <div className="max-w-[85%] sm:max-w-[75%] bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow">
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{text}</p>
      </div>
      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-dark_bg_4 flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} className="text-dark_text_2 text-sm" />
      </div>
    </div>
  );
}

export function CareerMessageBot({ text }) {
  return (
    <div className="flex justify-start gap-2 items-end mb-1">
      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
        <FontAwesomeIcon icon={faStar} className="text-amber-400 text-sm" />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] bg-dark_bg_5 border border-dark_border_2 text-dark_text_1 px-4 py-3 rounded-2xl rounded-bl-md shadow">
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}

export function CareerMessageBotLoading() {
  return (
    <div className="flex justify-start gap-2 items-end mb-1">
      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
        <FontAwesomeIcon icon={faStar} className="text-amber-400 text-sm" />
      </div>
      <div className="bg-dark_bg_5 border border-dark_border_2 text-dark_text_2 px-4 py-3 rounded-2xl rounded-bl-md shadow flex items-center gap-2 min-h-[48px]">
        <PulseLoader color="#F59E0B" size={8} />
        <span className="text-sm">L'assistant prépare sa réponse...</span>
      </div>
    </div>
  );
}
