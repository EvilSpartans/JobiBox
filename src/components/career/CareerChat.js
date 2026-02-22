import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
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
  coachSpeaks = false,
  onCoachSpeaksChange,
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
        <div className="flex-shrink-0 flex flex-col gap-2 py-3 px-3 border-b border-dark_border_1 bg-dark_bg_2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBackToTopics}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-amber-500/25 text-amber-300 border border-amber-400/40 active:bg-amber-500/40 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Retour aux sujets</span>
            </button>
            {onCoachSpeaksChange && (
              <button
                type="button"
                onClick={() => onCoachSpeaksChange(!coachSpeaks)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition-colors ${
                  coachSpeaks
                    ? 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                    : 'bg-dark_bg_4 text-dark_text_2 border-dark_border_2'
                }`}
                title={coachSpeaks ? 'Désactiver la voix du coach' : 'Le coach lit ses réponses à voix haute'}
              >
                <FontAwesomeIcon icon={coachSpeaks ? faVolumeHigh : faVolumeXmark} />
                <span className="hidden sm:inline">{coachSpeaks ? 'Voix activée' : 'Coach parle'}</span>
              </button>
            )}
            {!onCoachSpeaksChange && <div className="w-28" aria-hidden />}
          </div>
          {selectedAgent && (
            <div className="flex items-center gap-2 min-w-0">
              {selectedAgent.avatar ? (
                <img
                  src={selectedAgent.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-amber-400/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400 font-semibold text-sm">
                  {(selectedAgent.firstName || selectedAgent.title || '?').charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-dark_text_1 truncate">{selectedAgent.firstName || selectedAgent.title}</span>
                <span className="text-base font-medium text-amber-400 truncate">{selectedAgent.title}</span>
              </div>
            </div>
          )}
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
                <CareerMessageBot
                  key={`b-${i}`}
                  text={msg.text}
                  audioBase64={msg.audioBase64}
                  autoPlay={coachSpeaks && msg.audioBase64 && i === messages.length - 1}
                  avatar={selectedAgent?.avatar}
                  initial={(selectedAgent?.firstName || selectedAgent?.title || '?').charAt(0)}
                />
              )
            )}
            {sendLoading && <CareerMessageBotLoading avatar={selectedAgent?.avatar} initial={(selectedAgent?.firstName || selectedAgent?.title || '?').charAt(0)} />}
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
