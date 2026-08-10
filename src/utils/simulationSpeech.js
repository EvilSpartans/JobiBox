import { recordMicrophoneWav } from "./wavEncoder";

const FEMALE_VOICE_KEYWORDS = [
  "amélie",
  "amelie",
  "hortense",
  "marie",
  "alice",
  "audrey",
  "virginie",
  "elsa",
  "emma",
  "julie",
  "sophie",
  "samantha",
];

export function isMicSupported() {
  return !!(
    typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia
  );
}

export function isTtsSupported() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

function pickFrenchFemaleVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices?.() || [];
  const fr = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("fr"));
  const female =
    fr.find((v) =>
      FEMALE_VOICE_KEYWORDS.some((k) =>
        (v.name || "").toLowerCase().includes(k),
      ),
    ) || fr[0];
  return female || null;
}

/**
 * Play Google TTS base64 (mp3) or fallback to speechSynthesis.
 * Returns a stop() function. Guarantees at most one utterance after stop.
 */
export function speakText({
  text,
  audioBase64,
  rate = 0.9,
  onStart,
  onEnd,
}) {
  let googleAudio = null;
  let utterance = null;
  let stopped = false;
  let finished = false;
  let voicesTimer = null;
  let voicesHandler = null;
  let fallbackUsed = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    cleanupVoicesWait();
    onEnd?.();
  };

  const cleanupVoicesWait = () => {
    if (voicesTimer) {
      clearTimeout(voicesTimer);
      voicesTimer = null;
    }
    if (voicesHandler && window.speechSynthesis) {
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch {
        /* ignore */
      }
      voicesHandler = null;
    }
  };

  const stop = () => {
    stopped = true;
    finished = true;
    cleanupVoicesWait();
    try {
      googleAudio?.pause();
      if (googleAudio) googleAudio.src = "";
    } catch {
      /* ignore */
    }
    googleAudio = null;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    utterance = null;
  };

  const speakBrowser = () => {
    if (stopped) return;
    if (!text || !window.speechSynthesis) {
      finish();
      return;
    }

    const startUtterance = () => {
      if (stopped) return;
      window.speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = rate;
      const voice = pickFrenchFemaleVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "fr-FR";
      }
      utterance.onstart = () => {
        if (!stopped) onStart?.();
      };
      utterance.onend = () => {
        if (!stopped) finish();
      };
      utterance.onerror = () => {
        if (!stopped) finish();
      };
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) {
      voicesHandler = () => {
        if (stopped) return;
        cleanupVoicesWait();
        startUtterance();
      };
      window.speechSynthesis.onvoiceschanged = voicesHandler;
      voicesTimer = setTimeout(() => {
        if (stopped) return;
        cleanupVoicesWait();
        startUtterance();
      }, 250);
      return;
    }

    startUtterance();
  };

  const tryBrowserFallback = () => {
    if (stopped || fallbackUsed) return;
    fallbackUsed = true;
    speakBrowser();
  };

  const trimmedAudio =
    typeof audioBase64 === "string" ? audioBase64.trim() : "";

  if (trimmedAudio) {
    googleAudio = new Audio(`data:audio/mpeg;base64,${trimmedAudio}`);
    googleAudio.onplay = () => {
      if (!stopped) onStart?.();
    };
    googleAudio.onended = () => {
      if (!stopped) finish();
    };
    googleAudio.onerror = () => tryBrowserFallback();
    void googleAudio.play().catch(() => tryBrowserFallback());
    return stop;
  }

  speakBrowser();
  return stop;
}

/** Démarre un enregistrement micro WAV (Electron-safe). */
export function startMicRecording(opts = {}) {
  return recordMicrophoneWav(opts);
}

/** Arrête l’enregistrement et retourne le File WAV (ou null). */
export async function stopMicRecording(recording) {
  if (!recording?.stop) return null;
  try {
    return await recording.stop();
  } catch {
    return null;
  }
}

export function mergeQuestionsPreservingAudio(prev = [], next = []) {
  return (next || []).map((q, i) => {
    const old = prev[i];
    if (old?.audioBase64 && !q?.audioBase64) {
      return { ...q, audioBase64: old.audioBase64 };
    }
    return q;
  });
}
