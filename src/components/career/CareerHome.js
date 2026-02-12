import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { CAREER_AGENTS } from '../../utils/careerGuideConstants';
import { getRandomFaqQuestions } from '../../utils/careerGuideFaq';
import CareerAgentCard from './CareerAgentCard';
import CareerFaqItem from './CareerFaqItem';
import CareerInputBar from './CareerInputBar';

export default function CareerHome({
  onAgentClick,
  onFaqClick,
  onSendMessage,
  onSendAudio,
  sendLoading,
  coachSpeaks = false,
  onCoachSpeaksChange,
}) {
  const faqQuestions = useMemo(() => getRandomFaqQuestions(3), []);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-10 sm:space-y-12 pb-10">
      {/* En-tête */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 flex items-center justify-center mb-5 ring-1 ring-amber-400/20 shadow-lg">
          <FontAwesomeIcon icon={faStar} className="text-2xl text-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark_text_1 tracking-tight">
          Guide Carrière
        </h1>
        <p className="mt-2 text-sm sm:text-base text-dark_text_2 max-w-md leading-relaxed">
          Choisissez un expert ou posez votre question. Nos coachs vous accompagnent.
        </p>
        {onCoachSpeaksChange && (
          <button
            type="button"
            onClick={() => onCoachSpeaksChange(!coachSpeaks)}
            className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
              coachSpeaks
                ? 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                : 'bg-dark_bg_3 text-dark_text_2 border-dark_border_2'
            }`}
            title={coachSpeaks ? 'Désactiver la voix du coach' : 'Le coach lit ses réponses à voix haute'}
          >
            <FontAwesomeIcon icon={coachSpeaks ? faVolumeHigh : faVolumeXmark} />
            <span>{coachSpeaks ? 'Voix activée' : 'Coach parle'}</span>
          </button>
        )}
      </div>

      {/* Grille agents – design premium */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-dark_svg_2 mb-4 px-0.5">
          Vos coachs
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CAREER_AGENTS.map((agent) => (
            <CareerAgentCard key={agent.id} agent={agent} onClick={onAgentClick} />
          ))}
        </div>
      </div>

      {/* Questions fréquentes */}
      <div>
        <h2 className="flex items-center gap-2 text-dark_text_2 font-semibold mb-3">
          <FontAwesomeIcon icon={faComment} className="text-dark_svg_2" />
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {faqQuestions.map((q) => (
            <CareerFaqItem key={q} question={q} onClick={onFaqClick} />
          ))}
        </div>
      </div>

      {/* Saisie libre */}
      <CareerInputBar
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        disabled={sendLoading}
      />
    </div>
  );
}
