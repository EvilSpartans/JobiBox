import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { recordMicrophoneWav } from '../../utils/wavEncoder';

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function CareerInputBar({ onSendMessage, onSendAudio, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordingRef = useRef(null);
  const recordButtonRef = useRef(null);
  const isKeyPressed = useRef(false);
  const isRecordingRef = useRef(false);

  const handleSendText = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startRecording = () => {
    if (disabled || isRecording) return;
    if (!navigator.mediaDevices?.getUserMedia) return;
    setRecordSeconds(0);
    setIsRecording(true);
    isRecordingRef.current = true;
    recordMicrophoneWav({
      onTick: (seconds) => setRecordSeconds(seconds),
    })
      .then((rec) => {
        recordingRef.current = rec;
      })
      .catch(() => {
        setIsRecording(false);
        isRecordingRef.current = false;
      });
  };

  const stopRecording = () => {
    if (!recordingRef.current) return;
    recordingRef.current
      .stop()
      .then((file) => {
        onSendAudio(file);
      })
      .finally(() => {
        recordingRef.current = null;
        setIsRecording(false);
        isRecordingRef.current = false;
        setRecordSeconds(0);
      });
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const fromInput = /^(INPUT|TEXTAREA)$/.test(event.target?.tagName) || event.target?.isContentEditable;
      if (fromInput) return;
      if (isKeyPressed.current) return;
      if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)) {
        isKeyPressed.current = true;
        if (!isRecordingRef.current && recordButtonRef.current && !recordButtonRef.current.disabled) {
          recordButtonRef.current.click();
        }
      }
    };

    const handleKeyUp = () => {
      isKeyPressed.current = false;
      if (isRecordingRef.current && recordButtonRef.current) {
        recordButtonRef.current.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-dark_bg_3 rounded-xl border border-dark_border_2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question..."
          disabled={disabled}
          className="input flex-1 min-w-0 text-sm sm:text-base placeholder:text-dark_text_1 placeholder:opacity-80"
        />
        <button
          type="button"
          onClick={handleSendText}
          disabled={disabled || !inputValue.trim()}
          className="btn_secondary text-green_1 disabled:opacity-50 disabled:cursor-not-allowed active:opacity-80"
          title="Envoyer"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        <button
          ref={recordButtonRef}
          type="button"
          onClick={handleRecordClick}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium min-w-[3rem] justify-center active:opacity-90 ${
            isRecording
              ? 'text-red_1 bg-red_1/20'
              : 'text-red_1 bg-dark_bg_4'
          }`}
          title={isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement'}
        >
          {isRecording ? (
            <span className="font-mono tabular-nums">{formatTimer(recordSeconds)}</span>
          ) : (
            <FontAwesomeIcon icon={faMicrophone} />
          )}
        </button>
      </div>
    </>
  );
}
