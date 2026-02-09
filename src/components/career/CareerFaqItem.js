import React from 'react';

export default function CareerFaqItem({ question, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(question)}
      className="w-full text-left px-4 py-3 rounded-xl bg-dark_bg_5 border border-dark_border_2 text-dark_text_1 active:bg-dark_hover_1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue_1"
    >
      {question}
    </button>
  );
}
