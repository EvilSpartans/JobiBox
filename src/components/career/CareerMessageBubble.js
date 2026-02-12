import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
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

export function CareerMessageBot({ text, audioBase64, autoPlay = false, avatar, initial = '?' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioBase64]);

  useEffect(() => {
    if (!autoPlay || !audioBase64 || hasAutoPlayed.current || !audioRef.current) return;
    hasAutoPlayed.current = true;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [autoPlay, audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const dataUrl = audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : null;

  return (
    <div className="flex justify-start gap-2 items-end mb-1">
      <div className="w-9 h-9 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center overflow-hidden ring-2 ring-amber-400/20">
        {avatar ? (
          <img src={avatar} alt="" className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-amber-400 font-semibold text-sm">{initial}</span>
        )}
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] bg-dark_bg_5 border border-dark_border_2 text-dark_text_1 px-4 py-3 rounded-2xl rounded-bl-md shadow">
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{text}</p>
        {dataUrl && (
          <>
            <audio ref={audioRef} src={dataUrl} preload="metadata" />
            <button
              type="button"
              onClick={togglePlay}
              className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm font-medium active:opacity-90"
              title={isPlaying ? 'Pause' : 'Écouter la réponse'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-xs" />
              <span>{isPlaying ? 'Pause' : 'Écouter'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function CareerMessageBotLoading({ avatar, initial = '?' }) {
  return (
    <div className="flex justify-start gap-2 items-end mb-1">
      <div className="w-9 h-9 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center overflow-hidden ring-2 ring-amber-400/20">
        {avatar ? (
          <img src={avatar} alt="" className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-amber-400 font-semibold text-sm">{initial}</span>
        )}
      </div>
      <div className="bg-dark_bg_5 border border-dark_border_2 text-dark_text_2 px-4 py-3 rounded-2xl rounded-bl-md shadow flex items-center gap-2 min-h-[48px]">
        <PulseLoader color="#F59E0B" size={8} />
        <span className="text-sm">L'assistant prépare sa réponse...</span>
      </div>
    </div>
  );
}
