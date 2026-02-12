import React from 'react';

export default function CareerAgentCard({ agent, onClick }) {
  const initial = (agent.firstName || agent.title || '?').charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onClick(agent)}
      className={`${agent.color} rounded-2xl p-5 flex flex-col items-center justify-center text-center w-full min-h-[120px] text-white shadow-lg active:scale-[0.98] transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-dark_bg_1`}
    >
      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 flex-shrink-0 overflow-hidden ring-2 ring-white/30">
        {agent.avatar ? (
          <img
            src={agent.avatar}
            alt={`${agent.firstName || agent.title}, ${agent.title}`}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <span className="font-semibold text-xl select-none">{initial}</span>
        )}
      </div>
      <span className="font-bold text-sm sm:text-base leading-tight block">
        {agent.firstName || agent.title}
      </span>
      <span className="text-xs sm:text-sm text-white/90 mt-0.5 block">
        {agent.title}
      </span>
      <span className="text-xs sm:text-sm text-white/90 mt-1.5 leading-snug block">
        {agent.description}
      </span>
    </button>
  );
}
