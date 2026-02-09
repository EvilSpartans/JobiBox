import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { recordMicrophoneWav } from '../../utils/wavEncoder';

const COUNTDOWN_STEPS = [3, 2, 1, 'Parlez !'];
const COUNTDOWN_INTERVAL_MS = 700;

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function CareerInputBar({ onSendMessage, onSendAudio, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const recordingRef = useRef(null);
  const recordButtonRef = useRef(null);
  const isKeyPressed = useRef(false);
  const isRecordingRef = useRef(false);
  const countdownRef = useRef(null);
  countdownRef.current = countdown;

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

  const startCountdownAndRecord = () => {
    if (disabled || isRecording || countdown !== null) return;
    if (!navigator.mediaDevices?.getUserMedia) return;

    let stepIndex = 0;
    setCountdown(COUNTDOWN_STEPS[0]);

    const interval = setInterval(() => {
      stepIndex += 1;
      if (stepIndex >= COUNTDOWN_STEPS.length) {
        clearInterval(interval);
        setCountdown(null);
        doStartRecording();
        return;
      }
      setCountdown(COUNTDOWN_STEPS[stepIndex]);
    }, COUNTDOWN_INTERVAL_MS);
  };

  const doStartRecording = () => {
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
    if (countdown !== null) return;
    if (isRecording) {
      stopRecording();
    } else {
      startCountdownAndRecord();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const fromInput = /^(INPUT|TEXTAREA)$/.test(event.target?.tagName) || event.target?.isContentEditable;
      if (fromInput) return;
      if (isKeyPressed.current) return;
      if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)) {
        isKeyPressed.current = true;
        if (!isRecordingRef.current && countdownRef.current === null && recordButtonRef.current && !recordButtonRef.current.disabled) {
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
          disabled={disabled || countdown !== null}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium min-w-[3rem] justify-center active:opacity-90 ${
            isRecording
              ? 'text-red_1 bg-red_1/20'
              : 'text-red_1 bg-dark_bg_4'
          }`}
          title={isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement (3-2-1 Parlez)'}
        >
          {isRecording ? (
            <span className="font-mono tabular-nums">{formatTimer(recordSeconds)}</span>
          ) : (
            <FontAwesomeIcon icon={faMicrophone} />
          )}
        </button>
      </div>

      {countdown !== null && (
        <div
          className="fixed z-[9999] bg-black/95 flex items-center justify-center m-0 p-0"
          style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', minWidth: '100vw', minHeight: '100vh' }}
        >
          <span className="text-[120px] sm:text-[160px] font-extrabold text-amber-400 animate-pulse">
            {countdown}
          </span>
        </div>
      )}
    </>
  );
}
