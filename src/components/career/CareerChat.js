import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CareerMessageUser, CareerMessageBot, CareerMessageBotLoading } from './CareerMessageBubble';
import CareerInputBar from './CareerInputBar';
import CareerHistorySidebar from './CareerHistorySidebar';

export default function CareerChat({
  agents,
  messages,
  selectedAgent,
  historyCounts,
  onBackToTopics,
  onSwitchAgent,
  onSendMessage,
  onSendAudio,
  sendLoading,
  onClearHistory,
}) {
  const scrollRef = useRef(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    scrollToBottom();
    requestAnimationFrame(scrollToBottom);
  }, [messages, sendLoading]);

  const selectedAgentLabel = selectedAgent
    ? (selectedAgent.firstName ? `${selectedAgent.firstName} · ${selectedAgent.title}` : selectedAgent.title)
    : null;

  return (
    <div className="flex flex-1 min-w-0 min-h-0 rounded-2xl border border-dark_border_1 overflow-hidden shadow-xl bg-dark_bg_2">
      {/* Panneau Historique avec animation - pleine hauteur à gauche */}
      <div
        className={`overflow-hidden transition-[width] duration-300 ease-in-out flex-shrink-0 h-full ${
          isHistoryOpen ? 'w-44 md:w-52' : 'w-0'
        }`}
      >
        <div className="w-44 md:w-52 min-h-full h-full min-w-0">
          <CareerHistorySidebar
            agents={agents}
            selectedAgent={selectedAgent}
            historyCounts={historyCounts || {}}
            onSelectAgent={onSwitchAgent}
            onClose={() => setIsHistoryOpen(false)}
            onClearHistory={onClearHistory}
          />
        </div>
      </div>
      {/* Bouton rouvrir : icône seule quand l'historique est fermé (couleur distincte du Retour) */}
      <button
        type="button"
        onClick={() => setIsHistoryOpen(true)}
        className={`flex-shrink-0 flex items-center justify-center w-10 bg-dark_bg_4 text-dark_text_1 border-r border-dark_border_2 active:bg-dark_hover_1 transition-all duration-300 ease-in-out overflow-hidden ${
          isHistoryOpen ? 'w-0 min-w-0 opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        title="Ouvrir l'historique"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-sm flex-shrink-0" />
      </button>
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 py-3 px-3 border-b border-dark_border_1 bg-dark_bg_2">
          <button
            type="button"
            onClick={onBackToTopics}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-amber-500/25 text-amber-300 border border-amber-400/40 active:bg-amber-500/40 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Retour aux sujets</span>
          </button>
          <div className="flex-1 flex justify-center items-center gap-2 flex-wrap min-w-0">
            <FontAwesomeIcon icon={faStar} className="text-amber-400 text-sm flex-shrink-0" />
            <span className="font-semibold dark:text-dark_text_1 truncate">
              Guide Carrière
              {selectedAgentLabel && (
                <span className="text-amber-400 font-medium ml-1">· {selectedAgentLabel}</span>
              )}
            </span>
          </div>
          <div className="w-28" aria-hidden />
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-8 px-4 convos"
        >
          <div className="min-h-full space-y-5 pb-4">
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <CareerMessageUser key={`u-${i}`} text={msg.text} />
              ) : (
                <CareerMessageBot key={`b-${i}`} text={msg.text} />
              )
            )}
            {sendLoading && <CareerMessageBotLoading />}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-dark_border_1 bg-dark_bg_1">
          <CareerInputBar
            onSendMessage={onSendMessage}
            onSendAudio={onSendAudio}
            disabled={sendLoading}
          />
        </div>
      </div>
    </div>
  );
}
