import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faFileLines,
  faUserGroup,
  faEnvelope,
  faMagnifyingGlass,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

const ICON_MAP = {
  target: faBullseye,
  file: faFileLines,
  users: faUserGroup,
  envelope: faEnvelope,
  search: faMagnifyingGlass,
  refresh: faArrowsRotate,
};

export default function CareerAgentCard({ agent, onClick }) {
  const icon = ICON_MAP[agent.icon] || faBullseye;

  return (
    <button
      type="button"
      onClick={() => onClick(agent)}
      className={`${agent.color} rounded-2xl p-5 flex flex-col items-center justify-center text-center w-full min-h-[120px] text-white shadow-lg active:scale-[0.98] transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-dark_bg_1`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 flex-shrink-0">
        <FontAwesomeIcon icon={icon} className="text-xl text-white" />
      </div>
      <span className="font-bold text-sm sm:text-base leading-tight block">
        {agent.title}
      </span>
      <span className="text-xs sm:text-sm text-white/90 mt-1.5 leading-snug block">
        {agent.description}
      </span>
    </button>
  );
}
