import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
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
}) {
  const faqQuestions = useMemo(() => getRandomFaqQuestions(3), []);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto space-y-8 pb-8">
      {/* Logo + titre */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-dark_bg_3 flex items-center justify-center mb-4 ring-2 ring-amber-400/30 shadow-lg star-twinkle">
          <FontAwesomeIcon icon={faStar} className="text-3xl text-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-dark_text_1 tracking-tight">
          Bienvenue sur le Guide Carrière
        </h1>
        <p className="mt-3 text-sm sm:text-base text-dark_text_2 max-w-md leading-relaxed">
          Je suis votre assistant IA dédié à votre réussite professionnelle. Choisissez un sujet ou
          posez-moi directement votre question.
        </p>
      </div>

      {/* Grille agents */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {CAREER_AGENTS.map((agent) => (
          <CareerAgentCard key={agent.id} agent={agent} onClick={onAgentClick} />
        ))}
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
