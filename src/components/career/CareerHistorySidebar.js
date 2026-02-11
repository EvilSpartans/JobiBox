import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
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

export default function CareerHistorySidebar({ agents, selectedAgent, historyCounts, onSelectAgent, onClose, onClearHistory }) {
  return (
    <div className="flex-shrink-0 w-full sm:w-44 md:w-52 h-full border-r border-dark_border_1 bg-dark_bg_3 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-dark_border_1">
        <p className="text-xs font-semibold text-dark_text_2 uppercase tracking-wider truncate">
          Historique
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium bg-dark_bg_4 text-dark_text_1 border border-dark_border_2 active:bg-dark_hover_1 transition-colors"
          title="Fermer l'historique"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          <span>Fermer</span>
        </button>
      </div>
      <div className="overflow-y-auto flex-1 py-2">
        <button
          type="button"
          onClick={() => onSelectAgent(null)}
          className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue_1 ${
            selectedAgent === null
              ? 'bg-dark_hover_1 text-dark_text_1 font-medium'
              : 'text-dark_text_2 active:bg-dark_bg_4'
          }`}
        >
          <FontAwesomeIcon icon={faCommentDots} className="flex-shrink-0 text-dark_svg_2" />
          <span className="truncate">Discussion générale</span>
          {historyCounts.general > 0 && (
            <span className="ml-auto text-xs text-dark_svg_2 tabular-nums">{historyCounts.general}</span>
          )}
        </button>
        {agents.map((agent) => {
          const Icon = ICON_MAP[agent.icon];
          const isSelected = selectedAgent && selectedAgent.id === agent.id;
          const count = historyCounts[agent.id] || 0;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue_1 ${
                isSelected ? 'bg-dark_hover_1 text-dark_text_1 font-medium' : 'text-dark_text_2 active:bg-dark_bg_4'
              }`}
            >
              {Icon && <FontAwesomeIcon icon={Icon} className="flex-shrink-0 text-dark_svg_2" />}
              <span className="truncate flex-1">{agent.firstName ? `${agent.firstName} · ${agent.title}` : agent.title}</span>
              {count > 0 && (
                <span className="text-xs text-dark_svg_2 tabular-nums flex-shrink-0">{count}</span>
              )}
            </button>
          );
        })}
      </div>
      {onClearHistory && (
        <div className="flex-shrink-0 p-2 border-t border-dark_border_1">
          <button
            type="button"
            onClick={onClearHistory}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red_1 bg-red_1/10 border border-red_1/30 active:bg-red_1/20 transition-colors"
            title="Supprimer tout l'historique des discussions"
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
            <span>Vider l'historique</span>
          </button>
        </div>
      )}
    </div>
  );
}
