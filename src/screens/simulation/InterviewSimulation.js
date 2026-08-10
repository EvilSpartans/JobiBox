import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { AuthPageShell } from "../../components/core/AuthLayout";
import SimStepper from "../../components/simulation/v2/SimStepper";
import { getCategories } from "../../store/slices/categorySlice";
import {
  answerInterviewSimulation,
  clearInterviewSimulation,
  completeInterviewSimulation,
  createInterviewSimulation,
} from "../../store/slices/interviewSimulationSlice";
import {
  isMicSupported,
  mergeQuestionsPreservingAudio,
  speakText,
  startMicRecording,
  stopMicRecording,
} from "../../utils/simulationSpeech";

import beginnerImg from "../../../assets/images/beginner.png";
import intermediateImg from "../../../assets/images/intermediate.png";
import expertImg from "../../../assets/images/expert.png";
import modelVideo1 from "../../../assets/videos/simulation/model-simulation.mp4";
import modelVideo2 from "../../../assets/videos/simulation/model-simulation-2.mp4";
import modelVideo3 from "../../../assets/videos/simulation/model-simulation-3.mp4";

const THEMES = [
  { value: "motivation", label: "Motivation" },
  { value: "comportemental", label: "Comportemental" },
  { value: "technique", label: "Technique" },
];

const LEVELS = [
  {
    id: "beginner",
    title: "Débutant",
    badge: "Facile",
    tagline: "Pour démarrer en confiance, à ton rythme.",
    lead: "Idéal pour t’entraîner sans pression : tu contrôles le rythme.",
    color: "#0d9488",
    soft: "rgba(13, 148, 136, 0.16)",
    img: beginnerImg,
    bullets: ["Questions générales", "Relire & recommencer", "Validation manuelle"],
  },
  {
    id: "intermediate",
    title: "Intermédiaire",
    badge: "Ciblé",
    tagline: "Thématique + métier, enchaînement plus dynamique.",
    lead:
      "Avant de commencer, choisis la thématique que tu veux travailler, puis sélectionne un domaine d’activité ou renseigne un métier / poste cible. Une réponse par question, puis suite automatique.",
    color: "#2563eb",
    soft: "rgba(37, 99, 235, 0.16)",
    img: intermediateImg,
    bullets: ["Questions ciblées", "Pas de recommencer", "Suite automatique"],
  },
  {
    id: "expert",
    title: "Expert",
    badge: "Intensif",
    tagline: "Rythme soutenu, sans répit entre les questions.",
    lead:
      "Avant de commencer, sélectionne un domaine d’activité ou renseigne un métier / poste cible pour cadrer l’entretien. Conditions proches d’un vrai entretien : micro auto, enchaînement sans pause.",
    color: "#c2410c",
    soft: "rgba(194, 65, 12, 0.16)",
    img: expertImg,
    bullets: ["Scénario exigeant", "Micro auto", "Enchaînement auto"],
  },
];

const EMPTY_SKIP_SECONDS = 5;

function levelRules(level) {
  if (level === "beginner") {
    return {
      allowed: [
        "Relire la question à tout moment",
        "Recommencer ta réponse micro",
        "Valider manuellement avant de passer à la suite",
        "Avancer à ton rythme",
      ],
      forbidden: [],
    };
  }
  if (level === "intermediate") {
    return {
      allowed: [
        "Choisir une thématique et un domaine ou métier",
        "Répondre au micro une seule fois par question",
        "Enchaînement automatique dès que tu arrêtes le micro",
      ],
      forbidden: [
        "Relire la question",
        "Recommencer une réponse déjà enregistrée",
      ],
    };
  }
  return {
    allowed: [
      "Choisir un domaine ou un métier",
      "Micro qui démarre automatiquement après la question",
      "Enchaînement automatique sans pause",
    ],
    forbidden: [
      "Relire la question",
      "Recommencer une réponse",
      "Prendre ton temps entre les questions",
    ],
  };
}

export default function InterviewSimulation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const categoriesFromStore = useSelector(
    (state) => state.category.categories?.items || [],
  );

  const [step, setStep] = useState("level-select");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [targetMode, setTargetMode] = useState("domain");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [simulation, setSimulation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [expectedQuestionsCount, setExpectedQuestionsCount] = useState(0);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [preparingNext, setPreparingNext] = useState(false);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [listenSeconds, setListenSeconds] = useState(0);
  const [toast, setToast] = useState("");

  const videoRef = useRef(null);
  const stopSpeakRef = useRef(null);
  const recognitionRef = useRef(null); // holds WAV recorder { stop }
  const audioAnswerRef = useRef(null); // File WAV en attente d’envoi (débutant)
  const sessionTokenRef = useRef(0);
  const userStoppedRef = useRef(false);
  const listenTimerRef = useRef(null);
  const listenSecondsRef = useRef(0);
  const micAutoRetryRef = useRef(0);
  const questionsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const expectedCountRef = useRef(0);
  const simulationRef = useRef(null);
  const selectedLevelRef = useRef(null);
  const hasAnsweredRef = useRef(false);
  const transcriptRef = useRef("");
  const interimRef = useRef("");
  const tokenRef = useRef(token);
  const stepRef = useRef(step);
  const micButtonRef = useRef(null);
  const isKeyPressedRef = useRef(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [openEvalQuestionIndex, setOpenEvalQuestionIndex] = useState(0);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);
  useEffect(() => {
    expectedCountRef.current = expectedQuestionsCount;
  }, [expectedQuestionsCount]);
  useEffect(() => {
    simulationRef.current = simulation;
  }, [simulation]);
  useEffect(() => {
    selectedLevelRef.current = selectedLevel;
  }, [selectedLevel]);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    hasAnsweredRef.current = hasAnsweredCurrent;
  }, [hasAnsweredCurrent]);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  useEffect(() => {
    interimRef.current = interimTranscript;
  }, [interimTranscript]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Sync options depuis le store Redux (même source que Intermediate / Skills)
  useEffect(() => {
    setCategoryOptions(
      (categoriesFromStore || [])
        .map((c) => ({
          value: String(c?.name || "").trim(),
          label: String(c?.name || "").trim(),
        }))
        .filter((c) => c.value),
    );
  }, [categoriesFromStore]);

  // GET /api/categories — même appel que Intermediate / Expert
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    setCategoriesLoading(true);

    (async () => {
      try {
        const response = await dispatch(getCategories(token));
        if (cancelled) return;
        const categoriesData = response.payload?.items || [];
        setCategoryOptions(
          categoriesData
            .map((category) => ({
              value: category.name,
              label: category.name,
            }))
            .filter((c) => c.value),
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des catégories :",
          error,
        );
        if (!cancelled) setCategoryOptions([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);

  // Pad / clavier : toggle micro (comme Film) — débutant & intermédiaire uniquement
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isKeyPressedRef.current) return;

      const active = document.activeElement;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.tagName === "SELECT" ||
        active?.isContentEditable;
      if (isTyping) return;

      if (stepRef.current !== "interview") return;
      const level = selectedLevelRef.current;
      if (level !== "beginner" && level !== "intermediate") return;

      if (
        /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)
      ) {
        isKeyPressedRef.current = true;
        const btn = micButtonRef.current;
        if (btn && !btn.disabled) {
          btn.click();
        }
      }
    };

    const handleKeyUp = () => {
      isKeyPressedRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      bumpSession();
      stopAllMedia();
      dispatch(clearInterviewSimulation());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modelVideoSrc =
    selectedLevel === "intermediate"
      ? modelVideo2
      : selectedLevel === "expert"
        ? modelVideo3
        : modelVideo1;

  const autoAdvance =
    selectedLevel === "intermediate" || selectedLevel === "expert";
  const autoStartMic = selectedLevel === "expert";
  const canReplay = selectedLevel === "beginner";
  const canRedo = selectedLevel === "beginner";

  const expectedTotal =
    expectedQuestionsCount || questions.length || 0;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const displayTranscript = [transcript, interimTranscript]
    .filter(Boolean)
    .join(" ")
    .trim();

  const canStartLevel = useMemo(() => {
    if (!selectedLevel) return false;
    if (selectedLevel === "beginner") return true;
    if (selectedLevel === "intermediate" && !selectedTheme) return false;
    if (targetMode === "domain") return !!selectedActivity.trim();
    return !!jobTitle.trim();
  }, [
    selectedLevel,
    selectedTheme,
    targetMode,
    selectedActivity,
    jobTitle,
  ]);

  const startBlockedHint = useMemo(() => {
    if (!selectedLevel || selectedLevel === "beginner" || canStartLevel) {
      return null;
    }
    if (selectedLevel === "intermediate" && !selectedTheme) {
      return "Choisis une thématique et un domaine ou un métier pour commencer.";
    }
    return targetMode === "domain"
      ? "Sélectionne un domaine d’activité pour commencer."
      : "Indique le métier, le poste visé ou l’entreprise pour commencer.";
  }, [selectedLevel, canStartLevel, selectedTheme, targetMode]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  function bumpSession() {
    sessionTokenRef.current += 1;
  }

  function stopAllMedia() {
    stopSpeakRef.current?.();
    stopSpeakRef.current = null;
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    if (rec?.stop) {
      void stopMicRecording(rec);
    }
    audioAnswerRef.current = null;
    clearListenTimer();
    setIsSpeaking(false);
    setIsListening(false);
    pauseModelVideo();
  }

  function playModelVideo() {
    const v = videoRef.current;
    if (!v) return;
    v.play?.().catch(() => {});
  }

  function pauseModelVideo() {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
    } catch {
      /* ignore */
    }
  }

  function clearListenTimer() {
    if (listenTimerRef.current) {
      clearInterval(listenTimerRef.current);
      listenTimerRef.current = null;
    }
  }

  function startListenTimer() {
    clearListenTimer();
    setListenSeconds(0);
    listenSecondsRef.current = 0;
    listenTimerRef.current = setInterval(() => {
      listenSecondsRef.current += 1;
      setListenSeconds(listenSecondsRef.current);
    }, 1000);
  }

  const speakCurrentQuestion = useCallback(
    (opts = {}) => {
      const token = sessionTokenRef.current;
      const q = questionsRef.current[currentIndexRef.current];
      if (!q) return;
      stopSpeakRef.current?.();
      stopSpeakRef.current = speakText({
        text: q.text || "",
        audioBase64: q.audioBase64 || null,
        rate: 0.88,
        onStart: () => {
          if (token !== sessionTokenRef.current) return;
          setIsSpeaking(true);
          playModelVideo();
        },
        onEnd: () => {
          if (token !== sessionTokenRef.current) return;
          setIsSpeaking(false);
          pauseModelVideo();
          if (opts.onEnded) {
            opts.onEnded();
            return;
          }
          if (
            selectedLevelRef.current === "expert" &&
            !hasAnsweredRef.current
          ) {
            setTimeout(() => {
              if (token !== sessionTokenRef.current) return;
              startListening(true);
            }, 350);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const speakClosing = useCallback((speech, audioBase64, onDone) => {
    const token = sessionTokenRef.current;
    stopSpeakRef.current?.();
    stopSpeakRef.current = speakText({
      text: speech || "",
      audioBase64: audioBase64 || null,
      rate: 0.9,
      onStart: () => {
        if (token !== sessionTokenRef.current) return;
        setIsSpeaking(true);
        playModelVideo();
      },
      onEnd: () => {
        if (token !== sessionTokenRef.current) return;
        setIsSpeaking(false);
        pauseModelVideo();
        onDone?.();
      },
    });
  }, []);

  function clearTranscript() {
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
    interimRef.current = "";
    audioAnswerRef.current = null;
  }

  async function startListening(fromAuto = false) {
    if (!isMicSupported()) {
      if (!fromAuto) showToast("Micro non disponible sur cet appareil.");
      return;
    }
    if (savingAnswer || preparingNext) return;
    if (!canRedo && (audioAnswerRef.current || hasAnsweredRef.current)) {
      return;
    }

    const token = sessionTokenRef.current;
    stopSpeakRef.current?.();
    stopSpeakRef.current = null;
    setIsSpeaking(false);
    pauseModelVideo();

    const prev = recognitionRef.current;
    recognitionRef.current = null;
    if (prev?.stop) {
      void stopMicRecording(prev);
    }

    userStoppedRef.current = false;
    clearListenTimer();
    audioAnswerRef.current = null;
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
    interimRef.current = "";

    try {
      const recording = await startMicRecording({
        onTick: (seconds) => {
          if (token !== sessionTokenRef.current) return;
          listenSecondsRef.current = seconds;
          setListenSeconds(seconds);
        },
      });
      if (token !== sessionTokenRef.current) {
        void stopMicRecording(recording);
        return;
      }
      recognitionRef.current = recording;
      setIsListening(true);
      micAutoRetryRef.current = 0;
      listenSecondsRef.current = 0;
      setListenSeconds(0);
    } catch (e) {
      setIsListening(false);
      if (!fromAuto) {
        showToast("Impossible d’accéder au micro.");
      } else if (
        selectedLevelRef.current === "expert" &&
        micAutoRetryRef.current < 2
      ) {
        micAutoRetryRef.current += 1;
        setTimeout(() => {
          if (token !== sessionTokenRef.current) return;
          void startListening(true);
        }, 500);
      }
    }
  }

  async function finishRecordingAndHandle() {
    const token = sessionTokenRef.current;
    const recording = recognitionRef.current;
    recognitionRef.current = null;
    clearListenTimer();
    setIsListening(false);

    const file = await stopMicRecording(recording);
    if (token !== sessionTokenRef.current) return;

    const level = selectedLevelRef.current;
    const auto = level === "intermediate" || level === "expert";
    const seconds = listenSecondsRef.current;
    const hasAudio = !!(file && file.size > 44);

    if (userStoppedRef.current && auto && !savingAnswer) {
      if (hasAudio && seconds > 0) {
        setHasAnsweredCurrent(true);
        hasAnsweredRef.current = true;
        audioAnswerRef.current = file;
        setTranscript("Réponse enregistrée");
        transcriptRef.current = "Réponse enregistrée";
        void submitAnswer({ audio: file });
      } else if (seconds >= EMPTY_SKIP_SECONDS) {
        setHasAnsweredCurrent(true);
        hasAnsweredRef.current = true;
        void submitAnswer({ skipped: true });
      } else if (level === "expert") {
        showToast(
          "Parle au moins quelques secondes, ou laisse 5 s puis arrête.",
        );
        setTimeout(() => {
          if (token !== sessionTokenRef.current) return;
          if (hasAnsweredRef.current) return;
          void startListening(true);
        }, 400);
      }
      return;
    }

    // Débutant (ou stop non-auto) : garder l’audio pour « Question suivante »
    if (hasAudio) {
      audioAnswerRef.current = file;
      setHasAnsweredCurrent(true);
      hasAnsweredRef.current = true;
      setTranscript("Réponse enregistrée — appuie sur « Question suivante »");
      transcriptRef.current =
        "Réponse enregistrée — appuie sur « Question suivante »";
      return;
    }

    if (
      level === "expert" &&
      !userStoppedRef.current &&
      !hasAnsweredRef.current
    ) {
      setTimeout(() => {
        if (token !== sessionTokenRef.current) return;
        if (userStoppedRef.current || hasAnsweredRef.current) return;
        void startListening(true);
      }, 250);
    }
  }

  function toggleListening() {
    if (isListening) {
      userStoppedRef.current = true;
      void finishRecordingAndHandle();
      return;
    }
    if (!canRedo && hasAnsweredCurrent) return;
    if (!canRedo && audioAnswerRef.current) return;
    void startListening(false);
  }

  async function submitAnswer(opts = {}) {
    const sim = simulationRef.current;
    if (!sim?.id || savingAnswer) return;
    const skipped = !!opts.skipped;
    const audio = opts.audio || audioAnswerRef.current || null;

    if (!audio && !skipped) {
      showToast("Réponds d’abord avec le micro.");
      return;
    }

    const rec = recognitionRef.current;
    recognitionRef.current = null;
    if (rec?.stop) {
      void stopMicRecording(rec);
    }
    stopSpeakRef.current?.();
    setSavingAnswer(true);
    setPreparingNext(true);
    setErrorMsg("");

    try {
      const result = await dispatch(
        answerInterviewSimulation({
          token: tokenRef.current,
          id: sim.id,
          audio: skipped ? null : audio,
          body: {
            answer: skipped ? "" : "",
            questionIndex: currentIndexRef.current,
            skipped,
          },
        }),
      ).unwrap();

      audioAnswerRef.current = null;

      // Affiche la réponse transcrite si l’API la renvoie
      const answered =
        result.questions?.[currentIndexRef.current]?.answer || "";
      if (answered) {
        setTranscript(answered);
        transcriptRef.current = answered;
      }

      const merged = mergeQuestionsPreservingAudio(
        questionsRef.current,
        result.questions || [],
      );
      setSimulation(result);
      simulationRef.current = result;
      setQuestions(merged);
      questionsRef.current = merged;
      const exp =
        result.expectedQuestionsCount ??
        expectedCountRef.current ??
        merged.length;
      setExpectedQuestionsCount(exp);
      expectedCountRef.current = exp;

      const idx = currentIndexRef.current;
      const hasNext = idx < merged.length - 1;
      const moreExpected = idx + 1 < exp;

      if (hasNext || moreExpected) {
        if (!hasNext) {
          showToast("La question suivante n’a pas pu être générée.");
          return;
        }
        const nextIdx = idx + 1;
        setCurrentQuestionIndex(nextIdx);
        currentIndexRef.current = nextIdx;
        clearTranscript();
        setHasAnsweredCurrent(false);
        hasAnsweredRef.current = false;
        setTimeout(() => speakCurrentQuestion(), autoAdvance ? 100 : 350);
      } else {
        await finishInterview(result);
      }
    } catch (e) {
      showToast(typeof e === "string" ? e : "Erreur lors de l’enregistrement.");
    } finally {
      setSavingAnswer(false);
      setPreparingNext(false);
    }
  }

  async function finishInterview(simOverride) {
    const sim = simOverride || simulationRef.current;
    if (!sim?.id) return;
    setStatusLoading(true);
    try {
      const result = await dispatch(
        completeInterviewSimulation({ token: tokenRef.current, id: sim.id }),
      ).unwrap();
      const merged = mergeQuestionsPreservingAudio(
        questionsRef.current,
        result.questions || [],
      );
      setSimulation(result);
      simulationRef.current = result;
      setQuestions(merged);
      questionsRef.current = merged;

      const closingSpeech = result.feedback?.closingSpeech?.trim() || "";
      const closingAudio = result.feedback?.closingAudioBase64?.trim() || "";
      if (closingSpeech || closingAudio) {
        setStep("closing");
        setTimeout(() => {
          speakClosing(closingSpeech, closingAudio, () => {
            setOpenEvalQuestionIndex(0);
            setStep("evaluation");
          });
        }, 200);
      } else {
        setOpenEvalQuestionIndex(0);
        setStep("evaluation");
      }
    } catch (e) {
      showToast(typeof e === "string" ? e : "Échec de l’évaluation.");
      setOpenEvalQuestionIndex(0);
      setStep("evaluation");
    } finally {
      setStatusLoading(false);
    }
  }

  async function startLevel() {
    if (!selectedLevel || !canStartLevel) return;
    if (!tokenRef.current) {
      setErrorMsg("Session expirée. Reconnecte-toi.");
      return;
    }
    setStatusLoading(true);
    setErrorMsg("");
    bumpSession();
    stopAllMedia();

    const businessIdRaw = localStorage.getItem("businessId");
    const businessId = businessIdRaw ? Number(businessIdRaw) : null;

    const payload = {
      level: selectedLevel,
      adaptive: true,
      businessId: Number.isFinite(businessId) ? businessId : null,
    };
    if (selectedLevel === "intermediate") {
      payload.theme = selectedTheme;
    }
    if (selectedLevel !== "beginner") {
      if (targetMode === "domain") {
        payload.domain = selectedActivity.trim();
        payload.jobTitle = null;
      } else {
        payload.jobTitle = jobTitle.trim();
        payload.domain = null;
      }
    }

    try {
      const result = await dispatch(
        createInterviewSimulation({ token: tokenRef.current, payload }),
      ).unwrap();
      const qs = result.questions || [];
      setSimulation(result);
      simulationRef.current = result;
      setQuestions(qs);
      questionsRef.current = qs;
      setCurrentQuestionIndex(0);
      currentIndexRef.current = 0;
      setExpectedQuestionsCount(
        result.expectedQuestionsCount ?? qs.length,
      );
      expectedCountRef.current =
        result.expectedQuestionsCount ?? qs.length;
      clearTranscript();
      setHasAnsweredCurrent(false);
      hasAnsweredRef.current = false;
      setStep("interview");
      setTimeout(() => speakCurrentQuestion(), 400);
    } catch (e) {
      setErrorMsg(typeof e === "string" ? e : "Impossible de démarrer.");
    } finally {
      setStatusLoading(false);
    }
  }

  function selectLevel(level) {
    bumpSession();
    stopAllMedia();
    setSelectedLevel(level);
    selectedLevelRef.current = level;
    setSelectedTheme(null);
    setSelectedActivity("");
    setJobTitle("");
    setTargetMode("domain");
    setStep("level-intro");
    setErrorMsg("");
  }

  function restart() {
    bumpSession();
    stopAllMedia();
    dispatch(clearInterviewSimulation());
    setSimulation(null);
    simulationRef.current = null;
    setQuestions([]);
    questionsRef.current = [];
    setCurrentQuestionIndex(0);
    setExpectedQuestionsCount(0);
    setSelectedLevel(null);
    selectedLevelRef.current = null;
    setSelectedTheme(null);
    setStep("level-select");
    clearTranscript();
    setErrorMsg("");
  }

  /** Retour haut : navigation interne entre étapes, sortie du module seulement depuis le choix de niveau */
  function handleTopBack() {
    if (step === "level-select") {
      navigate("/");
      return;
    }
    if (step === "level-intro") {
      bumpSession();
      stopAllMedia();
      setSelectedLevel(null);
      selectedLevelRef.current = null;
      setSelectedTheme(null);
      setSelectedActivity("");
      setJobTitle("");
      setErrorMsg("");
      setStep("level-select");
      return;
    }
    // interview / closing / evaluation → retour à la présentation du niveau (ou choix si rien)
    bumpSession();
    stopAllMedia();
    dispatch(clearInterviewSimulation());
    setSimulation(null);
    simulationRef.current = null;
    setQuestions([]);
    questionsRef.current = [];
    setCurrentQuestionIndex(0);
    setExpectedQuestionsCount(0);
    clearTranscript();
    setHasAnsweredCurrent(false);
    hasAnsweredRef.current = false;
    setErrorMsg("");
    setStatusLoading(false);
    setSavingAnswer(false);
    setPreparingNext(false);
    if (selectedLevel) {
      setStep("level-intro");
    } else {
      setStep("level-select");
    }
  }

  const rules = selectedLevel ? levelRules(selectedLevel) : null;
  const listenLabel = `${String(Math.floor(listenSeconds / 60)).padStart(2, "0")}:${String(listenSeconds % 60).padStart(2, "0")}`;
  const progressPct = expectedTotal
    ? ((currentQuestionIndex + 1) / expectedTotal) * 100
    : 0;
  const progressLabel = `Question ${currentQuestionIndex + 1} sur ${expectedTotal || "—"}`;
  const nextButtonLabel =
    currentQuestionIndex < expectedTotal - 1
      ? "Question suivante"
      : "Terminer";
  const showNextButton =
    selectedLevel === "beginner" &&
    hasAnsweredCurrent &&
    !isListening &&
    !isSpeaking &&
    !savingAnswer;
  const micSupported = isMicSupported();
  const isInterviewFlow = step === "interview" || step === "closing";

  return (
    <div className="h-screen dark:bg-dark_bg_1 overflow-hidden">
      <GoBack onBack={handleTopBack} />
      <Logout />
      <AuthPageShell outerClassName="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 min-h-0 flex-1">
          {!isInterviewFlow && (
            <div className="text-center space-y-2 shrink-0">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Simulation d&apos;entretien
              </h1>
              <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed">
                Entraîne-toi à l&apos;oral : l&apos;IA pose les questions, tu
                réponds au micro, puis tu reçois un{" "}
                <span className="text-gray-200 font-medium">
                  bilan personnalisé
                </span>
                .
              </p>
            </div>
          )}

          <SimStepper currentStep={step} />

          {toast && (
            <div className="rounded-xl bg-amber-500/15 text-amber-200 text-base px-3 py-2.5 ring-1 ring-amber-500/30 text-center shrink-0">
              {toast}
            </div>
          )}
          {errorMsg && (
            <div className="rounded-xl bg-red-500/15 text-red-200 text-base px-3 py-2.5 ring-1 ring-red-500/30 text-center shrink-0">
              {errorMsg}
            </div>
          )}

          {step === "level-select" && (
            <div className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto pb-2">
              <div className="text-center shrink-0 px-1">
                <h2 className="text-2xl font-bold text-white m-0">
                  Choisis ton niveau
                </h2>
                <p className="text-base text-gray-400 mt-2 leading-relaxed max-w-sm mx-auto">
                  Chaque niveau a ses règles : rythme, relecture, enchaînement.
                  Choisis celui qui te convient.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => selectLevel(lvl.id)}
                    className="group relative w-full text-center rounded-[18px] px-[18px] pt-[22px] pb-5 transition active:scale-[0.99]"
                    style={{
                      border: `2px solid ${lvl.color}47`,
                      background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, ${lvl.soft} 140%)`,
                      boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
                    }}
                  >
                    <span
                      className="inline-block text-[1.1rem] font-bold uppercase tracking-wide rounded-full px-2.5 py-1 mb-2.5"
                      style={{
                        color: lvl.color,
                        background: "rgba(255,255,255,0.92)",
                        border: `1px solid ${lvl.color}59`,
                      }}
                    >
                      {lvl.badge}
                    </span>
                    <img
                      src={lvl.img}
                      alt={lvl.title}
                      className="block w-24 h-24 object-contain mx-auto mb-2.5"
                    />
                    <h3 className="text-[1.35rem] font-bold text-white m-0 mb-1.5">
                      {lvl.title}
                    </h3>
                    <p className="text-[1.05rem] text-gray-300 leading-snug m-0 mb-3.5 min-h-[2.6em] px-1">
                      {lvl.tagline}
                    </p>
                    <ul className="list-none m-0 mb-[18px] p-0 text-left flex flex-col gap-1.5 w-full self-stretch">
                      {lvl.bullets.map((b) => (
                        <li
                          key={b}
                          className="relative pl-[18px] text-[1rem] text-gray-200"
                        >
                          <span
                            className="absolute left-0 top-[0.45em] h-[7px] w-[7px] rounded-full"
                            style={{ background: lvl.color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span
                      className="inline-flex items-center justify-center min-w-[120px] px-[18px] py-2.5 rounded-full text-[1.05rem] font-bold text-white"
                      style={{ background: lvl.color }}
                    >
                      Choisir
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "level-intro" && selectedLevel && (
            <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pb-2">
              {(() => {
                const lvl = LEVELS.find((l) => l.id === selectedLevel);
                return (
                  <div className="rounded-[20px] space-y-[18px] max-w-[720px] mx-auto w-full">
                    {/* Hero — comme le web (empilé en portrait) */}
                    <div
                      className="flex flex-col gap-3 items-center text-center rounded-2xl px-5 py-[18px]"
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.08), ${lvl.soft})`,
                        border: `1px solid ${lvl.color}40`,
                      }}
                    >
                      <img
                        src={lvl.img}
                        alt={lvl.title}
                        className="h-[88px] w-[88px] object-contain flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span
                          className="inline-block text-[1rem] font-bold uppercase tracking-wider mb-1"
                          style={{ color: lvl.color }}
                        >
                          Niveau
                        </span>
                        <h2 className="font-bold text-2xl text-white m-0 mb-1.5">
                          {lvl.title}
                        </h2>
                        <p className="m-0 text-base text-gray-300 leading-relaxed">
                          {lvl.lead}
                        </p>
                      </div>
                    </div>

                    {/* Règles Tu peux / Tu ne peux pas */}
                    <div
                      className={`grid gap-3 ${
                        rules.forbidden.length > 0
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      <div className="rounded-[14px] px-4 py-3.5 text-left bg-emerald-500/10 ring-1 ring-emerald-500/25">
                        <h4 className="flex items-center gap-1.5 m-0 mb-2.5 text-[1.1rem] font-semibold text-emerald-300">
                          <span aria-hidden="true">✓</span> Tu peux
                        </h4>
                        <ul className="m-0 pl-[18px] text-[1.05rem] text-gray-200 leading-snug space-y-1">
                          {rules.allowed.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      {rules.forbidden.length > 0 && (
                        <div className="rounded-[14px] px-4 py-3.5 text-left bg-red-500/[0.08] ring-1 ring-red-500/20">
                          <h4 className="flex items-center gap-1.5 m-0 mb-2.5 text-[1.1rem] font-semibold text-red-300">
                            <span aria-hidden="true">⊘</span> Tu ne peux pas
                          </h4>
                          <ul className="m-0 pl-[18px] text-[1.05rem] text-gray-300 leading-snug space-y-1">
                            {rules.forbidden.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Formulaire cible — intermédiaire / expert */}
                    {(selectedLevel === "intermediate" ||
                      selectedLevel === "expert") && (
                      <div className="text-left space-y-4">
                        <p className="m-0 px-3.5 py-3 rounded-lg bg-white/[0.06] text-[1.05rem] text-gray-300 leading-relaxed">
                          {selectedLevel === "intermediate" ? (
                            <>
                              Sélectionne une thématique, puis un domaine
                              d&apos;activité{" "}
                              <span className="font-semibold text-white">
                                ou
                              </span>{" "}
                              un métier cible.
                            </>
                          ) : (
                            <>
                              Sélectionne un domaine d&apos;activité{" "}
                              <span className="font-semibold text-white">
                                ou
                              </span>{" "}
                              renseigne un métier / poste cible.
                            </>
                          )}
                        </p>

                        {selectedLevel === "intermediate" && (
                          <div>
                            <label className="block font-semibold text-[1.05rem] text-gray-200 mb-2">
                              Thématique
                            </label>
                            <div className="grid grid-cols-1 gap-2.5">
                              {THEMES.map((th) => {
                                const selected = selectedTheme === th.value;
                                return (
                                  <button
                                    key={th.value}
                                    type="button"
                                    onClick={() => setSelectedTheme(th.value)}
                                    className={`w-full text-left rounded-xl px-3.5 py-3 flex items-center justify-between transition ${
                                      selected
                                        ? "bg-[#1976d2]/15 ring-2 ring-[#1976d2] text-white"
                                        : "bg-white/[0.04] ring-1 ring-white/15 text-gray-200"
                                    }`}
                                  >
                                    <span className="text-base font-medium">
                                      {th.label}
                                    </span>
                                    {selected && (
                                      <span
                                        className="text-[#60a5fa] text-xl leading-none"
                                        aria-hidden="true"
                                      >
                                        ✓
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block font-semibold text-[1.05rem] text-gray-200 mb-2">
                            Cible
                          </label>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setTargetMode("domain");
                                setJobTitle("");
                              }}
                              className={`flex-1 text-left rounded-xl px-3 py-3 flex items-center gap-2.5 transition ${
                                targetMode === "domain"
                                  ? "bg-[#1976d2]/15 ring-2 ring-[#1976d2]"
                                  : "bg-white/[0.04] ring-1 ring-white/15"
                              }`}
                            >
                              <span
                                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  targetMode === "domain"
                                    ? "border-[#1976d2]"
                                    : "border-white/30"
                                }`}
                              >
                                {targetMode === "domain" && (
                                  <span className="h-2 w-2 rounded-full bg-[#1976d2]" />
                                )}
                              </span>
                              <span className="text-base text-gray-100 leading-tight">
                                Domaine d&apos;activité
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetMode("job");
                                setSelectedActivity("");
                              }}
                              className={`flex-1 text-left rounded-xl px-3 py-3 flex items-center gap-2.5 transition ${
                                targetMode === "job"
                                  ? "bg-[#1976d2]/15 ring-2 ring-[#1976d2]"
                                  : "bg-white/[0.04] ring-1 ring-white/15"
                              }`}
                            >
                              <span
                                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  targetMode === "job"
                                    ? "border-[#1976d2]"
                                    : "border-white/30"
                                }`}
                              >
                                {targetMode === "job" && (
                                  <span className="h-2 w-2 rounded-full bg-[#1976d2]" />
                                )}
                              </span>
                              <span className="text-base text-gray-100 leading-tight">
                                Métier (saisie libre)
                              </span>
                            </button>
                          </div>
                        </div>

                        {targetMode === "domain" ? (
                          <div>
                            <label className="block font-semibold text-[1.05rem] text-gray-200 mb-2">
                              Domaine d&apos;activité
                            </label>
                            {categoriesLoading ? (
                              <div className="flex justify-center py-3">
                                <PulseLoader color="#93c5fd" size={8} />
                              </div>
                            ) : (
                              <select
                                className="w-full rounded-xl bg-[#1a1f2e] border border-white/15 text-white p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1976d2]/50 appearance-none"
                                value={selectedActivity}
                                onChange={(e) =>
                                  setSelectedActivity(e.target.value)
                                }
                                disabled={categoryOptions.length === 0}
                              >
                                <option value="">
                                  {categoryOptions.length === 0
                                    ? "Aucun domaine disponible"
                                    : "Sélectionne un domaine"}
                                </option>
                                {categoryOptions.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : (
                          <div>
                            <label className="block font-semibold text-[1.05rem] text-gray-200 mb-2">
                              Métier / poste visé / entreprise
                            </label>
                            <input
                              className="w-full rounded-xl bg-white/[0.04] border border-white/15 text-white p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1976d2]/50 placeholder:text-gray-500"
                              placeholder="Ex. Développeur web chez Decathlon…"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("level-select");
                          setSelectedLevel(null);
                        }}
                        className="min-w-[120px] py-3 px-4 rounded-xl ring-1 ring-white/20 text-gray-200 font-medium"
                      >
                        ← Retour
                      </button>
                      <button
                        type="button"
                        disabled={!canStartLevel || statusLoading}
                        onClick={() => void startLevel()}
                        className="min-w-[200px] py-3 px-5 rounded-xl bg-[#1976d2] text-white font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-45 disabled:cursor-not-allowed"
                      >
                        {statusLoading ? (
                          <PulseLoader color="#fff" size={8} />
                        ) : (
                          "Commencer l'entretien"
                        )}
                      </button>
                    </div>
                    {startBlockedHint && (
                      <p className="m-0 text-center text-[1rem] text-gray-400">
                        {startBlockedHint}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {(step === "interview" || step === "closing") && (
            <div className="relative flex flex-col flex-1 min-h-0">
              {(statusLoading || preparingNext) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 rounded-xl bg-dark_bg_2/85 backdrop-blur-[2px]">
                  <PulseLoader color="#93c5fd" size={10} />
                  <p className="text-base text-gray-200 px-4 text-center">
                    {statusLoading && step === "closing"
                      ? "Analyse de vos réponses…"
                      : preparingNext
                        ? "Transcription et préparation…"
                        : "Chargement…"}
                  </p>
                </div>
              )}

              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                {step === "interview" && questions.length > 0 && (
                  <div className="mb-3 shrink-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[1.1rem] font-medium text-gray-400">
                        {progressLabel}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-sm bg-white/10 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={currentQuestionIndex + 1}
                      aria-valuemin={1}
                      aria-valuemax={expectedTotal || questions.length}
                    >
                      <div
                        className="h-full bg-[#1976d2] transition-all duration-300 rounded-sm"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {step === "interview" && currentQuestion && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3.5 mb-4 rounded-xl bg-[#1976d2]/10 ring-1 ring-[#1976d2]/20 shrink-0">
                    <span
                      className="text-[#60a5fa] text-xl leading-none mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      ?
                    </span>
                    <span className="text-[1.1rem] font-medium text-white leading-snug">
                      {currentQuestion.text}
                    </span>
                  </div>
                )}

                {step === "closing" && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3.5 mb-4 rounded-xl bg-[#1976d2]/10 ring-1 ring-[#1976d2]/20 shrink-0">
                    <span
                      className="text-[#60a5fa] text-xl leading-none mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      ◉
                    </span>
                    <span className="text-[1.1rem] font-medium text-white leading-snug">
                      {simulation?.feedback?.closingSpeech ||
                        "Conclusion de l’entretien…"}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center flex-1 min-h-0">
                  {/* Lecteur responsive — même logique que le web */}
                  <div
                    className="relative mx-auto mb-4 bg-black rounded-xl overflow-hidden shrink-0"
                    style={{
                      width:
                        "min(100%, calc((100vh - 280px) * 9 / 16))",
                      maxHeight: "min(70vh, calc(100vh - 280px))",
                      aspectRatio: "9 / 16",
                    }}
                  >
                    <video
                      ref={videoRef}
                      key={modelVideoSrc}
                      src={modelVideoSrc}
                      className="absolute inset-0 h-full w-full object-cover block"
                      loop
                      muted
                      playsInline
                      preload="auto"
                    />
                    {isSpeaking && (
                      <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/70 text-white text-[1.1rem] font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
                        L&apos;IA parle…
                      </div>
                    )}
                    {isListening && step === "interview" && (
                      <div className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/70 text-white text-[1.1rem] font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Écoute active</span>
                        <strong className="tabular-nums tracking-wide">
                          {listenLabel}
                        </strong>
                      </div>
                    )}
                  </div>

                  {step === "interview" && (
                    <>
                      <div className="flex flex-wrap items-center justify-center gap-3 mt-1 w-full">
                        {canReplay && (
                          <button
                            type="button"
                            disabled={
                              isSpeaking ||
                              savingAnswer ||
                              isListening ||
                              preparingNext
                            }
                            onClick={() => speakCurrentQuestion()}
                            className="min-h-[48px] px-4 rounded-xl ring-1 ring-white/20 text-base font-medium text-white disabled:opacity-40"
                          >
                            Relire
                          </button>
                        )}

                        {!isListening && !hasAnsweredCurrent && (
                          <button
                            ref={micButtonRef}
                            type="button"
                            disabled={
                              savingAnswer ||
                              isSpeaking ||
                              preparingNext ||
                              !micSupported
                            }
                            onClick={toggleListening}
                            className="min-h-[48px] min-w-[150px] px-6 rounded-xl bg-[#1976d2] text-white text-lg font-bold shadow-lg shadow-blue-500/25 disabled:opacity-40"
                          >
                            Répondre
                          </button>
                        )}

                        {isListening && (
                          <button
                            ref={micButtonRef}
                            type="button"
                            onClick={toggleListening}
                            className="min-h-[48px] min-w-[150px] px-6 rounded-xl bg-red-500 text-white text-lg font-bold shadow-[0_0_0_4px_rgba(239,68,68,0.18)] animate-pulse"
                          >
                            Arrêter
                          </button>
                        )}

                        {canRedo &&
                          hasAnsweredCurrent &&
                          !isListening &&
                          !isSpeaking && (
                            <button
                              type="button"
                              disabled={savingAnswer}
                              onClick={() => {
                                clearTranscript();
                                setHasAnsweredCurrent(false);
                                hasAnsweredRef.current = false;
                                void startListening(false);
                              }}
                              className="min-h-[48px] px-4 rounded-xl bg-amber-500/20 ring-1 ring-amber-400/40 text-amber-200 text-base font-semibold disabled:opacity-40"
                            >
                              Recommencer
                            </button>
                          )}

                        {showNextButton && (
                          <button
                            type="button"
                            disabled={savingAnswer}
                            onClick={() => void submitAnswer()}
                            className="min-h-[48px] px-5 rounded-xl bg-[#1976d2] text-white text-base font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-40"
                          >
                            {savingAnswer ? (
                              <PulseLoader color="#fff" size={8} />
                            ) : (
                              nextButtonLabel
                            )}
                          </button>
                        )}
                      </div>

                      {!micSupported && (
                        <p className="mt-3 text-center text-[1rem] text-amber-400">
                          La reconnaissance vocale n&apos;est pas disponible.
                        </p>
                      )}
                      {micSupported &&
                        !displayTranscript.trim() &&
                        !isListening &&
                        !isSpeaking &&
                        !autoStartMic && (
                          <p className="mt-3 text-center text-[1rem] text-gray-400">
                            Appuie sur « Répondre » pour parler au micro.
                          </p>
                        )}
                      {autoAdvance && isListening && (
                        <p className="mt-3 text-center text-[1rem] text-gray-400">
                          Arrêtez le micro pour enchaîner automatiquement.
                        </p>
                      )}
                      {autoStartMic &&
                        !isListening &&
                        !isSpeaking &&
                        !hasAnsweredCurrent &&
                        !displayTranscript.trim() && (
                          <p className="mt-3 text-center text-[1rem] text-gray-400">
                            Le micro démarre automatiquement après la question.
                            Vous pouvez aussi appuyer sur « Répondre ».
                          </p>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "evaluation" && simulation && (
            <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
              <div className="flex items-center gap-4 rounded-[18px] bg-gradient-to-br from-[#1976d2]/20 to-white/[0.03] ring-1 ring-[#1976d2]/25 p-5">
                <div className="h-[4.5rem] w-[4.5rem] rounded-full bg-[#1976d2]/25 ring-2 ring-[#1976d2]/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-3xl font-bold text-white leading-none">
                    {simulation.globalScore ?? "—"}
                  </span>
                  <span className="text-sm text-blue-200 mt-0.5">/10</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white m-0">
                    Bilan de ton entretien
                  </h2>
                  <p className="text-base text-gray-300 mt-1 leading-snug">
                    {LEVELS.find((l) => l.id === simulation.level)?.title ||
                      simulation.level}
                    {simulation.theme ? ` · ${simulation.theme}` : ""}
                    {simulation.domain ? ` · ${simulation.domain}` : ""}
                    {simulation.jobTitle ? ` · ${simulation.jobTitle}` : ""}
                  </p>
                </div>
              </div>

              {simulation.feedback?.summary && (
                <div className="rounded-[18px] bg-white/[0.04] ring-1 ring-white/10 p-4">
                  <h3 className="text-base font-bold text-emerald-300 mb-2 m-0">
                    Retour global
                  </h3>
                  <p className="text-base text-gray-200 leading-relaxed m-0">
                    {simulation.feedback.summary}
                  </p>
                </div>
              )}

              {(() => {
                const evalQuestions =
                  questions.length ? questions : simulation.questions || [];
                const count = evalQuestions.length;
                return (
                  <div className="space-y-2.5">
                    <p className="text-sm text-gray-400 m-0 px-0.5">
                      Parcours question par question — clique pour ouvrir ou
                      fermer.
                    </p>
                    {evalQuestions.map((q, i) => {
                      const open = openEvalQuestionIndex === i;
                      return (
                        <div
                          key={i}
                          id={`qa-card-${i}`}
                          className={`rounded-[18px] ring-1 overflow-hidden transition ${
                            open
                              ? "bg-white/[0.06] ring-[#1976d2]/35"
                              : "bg-white/[0.04] ring-white/10"
                          }`}
                        >
                          <button
                            type="button"
                            className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left"
                            aria-expanded={open}
                            onClick={() =>
                              setOpenEvalQuestionIndex(open ? -1 : i)
                            }
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-bold uppercase tracking-wide text-gray-400">
                                Question {i + 1}
                              </span>
                              {!open && (
                                <p className="text-base text-gray-300 m-0 mt-1 line-clamp-2 italic leading-snug">
                                  « {q.text} »
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                              {q.score != null && (
                                <span
                                  className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                                    q.score >= 7
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : q.score >= 4
                                        ? "bg-amber-500/20 text-amber-200"
                                        : "bg-red-500/20 text-red-300"
                                  }`}
                                >
                                  {q.score}/10
                                </span>
                              )}
                              <span
                                className="text-gray-400 text-xl leading-none"
                                aria-hidden="true"
                              >
                                {open ? "▴" : "▾"}
                              </span>
                            </div>
                          </button>

                          {open && (
                            <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                              <blockquote className="m-0 pl-3 border-l-2 border-[#1976d2]/50">
                                <p className="text-base font-medium text-white m-0 leading-snug italic">
                                  {q.text}
                                </p>
                              </blockquote>
                              <QaBlock
                                tone="blue"
                                label="Ce qui a été dit"
                                text={q.answer}
                              />
                              <QaBlock
                                tone="amber"
                                label="Ce qui était attendu"
                                text={q.expected}
                              />
                              <QaBlock
                                tone="green"
                                label="Retour de l’IA"
                                text={q.feedback}
                              />
                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                                <button
                                  type="button"
                                  disabled={i <= 0}
                                  onClick={() => {
                                    const prev = i - 1;
                                    setOpenEvalQuestionIndex(prev);
                                    requestAnimationFrame(() => {
                                      document
                                        .getElementById(`qa-card-${prev}`)
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "start",
                                        });
                                    });
                                  }}
                                  className="min-h-[44px] px-3 rounded-xl ring-1 ring-white/15 text-base text-gray-200 disabled:opacity-35"
                                >
                                  ← Précédente
                                </button>
                                <span className="text-sm text-gray-500 font-medium tabular-nums">
                                  {i + 1} / {count}
                                </span>
                                <button
                                  type="button"
                                  disabled={i >= count - 1}
                                  onClick={() => {
                                    const next = i + 1;
                                    setOpenEvalQuestionIndex(next);
                                    requestAnimationFrame(() => {
                                      document
                                        .getElementById(`qa-card-${next}`)
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "start",
                                        });
                                    });
                                  }}
                                  className="min-h-[44px] px-3 rounded-xl ring-1 ring-white/15 text-base text-gray-200 disabled:opacity-35"
                                >
                                  Suivante →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="flex gap-3 pt-1 pb-4 shrink-0">
                <button
                  type="button"
                  onClick={restart}
                  className="flex-1 py-3.5 rounded-2xl ring-1 ring-white/15 text-gray-200 font-medium"
                >
                  Nouvelle simulation
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 py-3.5 rounded-2xl bg-[#1976d2] text-white font-semibold shadow-lg shadow-blue-500/25"
                >
                  Quitter
                </button>
              </div>
            </div>
          )}
        </div>
      </AuthPageShell>
    </div>
  );
}

function QaBlock({ tone, label, text }) {
  const tones = {
    blue: "bg-blue-500/10 ring-blue-400/20 text-blue-100",
    amber: "bg-amber-500/10 ring-amber-400/20 text-amber-100",
    green: "bg-emerald-500/10 ring-emerald-400/20 text-emerald-100",
  };
  return (
    <div className={`rounded-xl p-3 ring-1 ${tones[tone]}`}>
      <p className="text-sm uppercase tracking-wide opacity-80 mb-1">
        {label}
      </p>
      <p className="text-base leading-relaxed">{text || "—"}</p>
    </div>
  );
}
