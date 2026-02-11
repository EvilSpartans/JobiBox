import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Logout from '../../components/core/Logout';
import GoBack from '../../components/core/GoBack';
import ConfirmModal from '../../components/modals/ConfirmModal';
import CareerHome from '../../components/career/CareerHome';
import CareerChat from '../../components/career/CareerChat';
import { sendCareerGuideRequest } from '../../utils/careerGuideApi';
import { getRandomStarterQuestion } from '../../utils/careerGuideConstants';
import { CAREER_AGENTS } from '../../utils/careerGuideConstants';
import { getHistoryKey, saveHistory, loadHistory, getHistoryCounts, clearHistory } from '../../utils/careerGuideHistory';
import { useSelector } from 'react-redux';

export default function CareerScreen() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;

  const [view, setView] = useState('home');
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);

  const historyCounts = useMemo(() => getHistoryCounts(CAREER_AGENTS), [historyVersion]);

  const addBotMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { role: 'bot', text }]);
  }, []);

  const sendRequest = useCallback(
    async ({ question, audio, agent }) => {
      setSendLoading(true);
      try {
        const data = await sendCareerGuideRequest({ question, audio, agent }, token);
        addBotMessage(data.response || '');
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.details ||
          err.message ||
          'Une erreur est survenue.';
        addBotMessage(`Désolé, une erreur s'est produite : ${msg}`);
      } finally {
        setSendLoading(false);
      }
    },
    [token, addBotMessage]
  );

  useEffect(() => {
    if (view !== 'chat') return;
    const key = getHistoryKey(selectedAgent);
    saveHistory(key, messages);
    setHistoryVersion((v) => v + 1);
  }, [view, selectedAgent, messages]);

  const handleAgentClick = useCallback(
    (agent) => {
      setSelectedAgent(agent);
      setView('chat');
      const loaded = loadHistory(agent.id);
      if (loaded.length === 0) {
        const question = getRandomStarterQuestion(agent);
        setMessages([{ role: 'user', text: question }]);
        sendRequest({ question, agent: agent.id });
      } else {
        setMessages(loaded);
      }
    },
    [sendRequest]
  );

  const handleFaqClick = useCallback(
    (question) => {
      setSelectedAgent(null);
      setView('chat');
      const loaded = loadHistory('general');
      setMessages([...loaded, { role: 'user', text: question }]);
      sendRequest({ question });
    },
    [sendRequest]
  );

  const handleSwitchAgent = useCallback((agent) => {
    const key = getHistoryKey(agent);
    const loaded = loadHistory(key);
    setSelectedAgent(agent);
    setMessages(loaded);
  }, []);

  const handleSendMessage = useCallback(
    (text) => {
      if (view === 'home') {
        setView('chat');
        setSelectedAgent(null);
        const loaded = loadHistory('general');
        setMessages([...loaded, { role: 'user', text }]);
        sendRequest({ question: text });
        return;
      }
      setMessages((prev) => [...prev, { role: 'user', text }]);
      sendRequest({
        question: text,
        agent: selectedAgent ? selectedAgent.id : undefined,
      });
    },
    [view, selectedAgent, sendRequest]
  );

  const handleSendAudio = useCallback(
    (file) => {
      if (view === 'home') {
        setView('chat');
        setSelectedAgent(null);
        const loaded = loadHistory('general');
        setMessages([...loaded, { role: 'user', text: '[Message vocal]' }]);
        sendRequest({ audio: file });
        return;
      }
      setMessages((prev) => [...prev, { role: 'user', text: '[Message vocal]' }]);
      sendRequest({
        audio: file,
        agent: selectedAgent ? selectedAgent.id : undefined,
      });
    },
    [view, selectedAgent, sendRequest]
  );

  const handleBackToTopics = useCallback(() => {
    setView('home');
    setSelectedAgent(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    setShowClearHistoryModal(true);
  }, []);

  const handleConfirmClearHistory = useCallback(() => {
    clearHistory();
    setMessages([]);
    setHistoryVersion((v) => v + 1);
    setShowClearHistoryModal(false);
  }, []);

  const handleCancelClearHistory = useCallback(() => {
    setShowClearHistoryModal(false);
  }, []);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex flex-col overflow-hidden">
      <GoBack itemsToRemove={[]} />
      <Logout />
      <div
        className={`flex-1 flex flex-col min-h-0 w-full overflow-hidden ${view === 'chat' ? 'pt-14' : ''}`}
      >
        {view === 'home' ? (
          <div className="flex w-full mx-auto h-full">
            <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
              <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl overflow-y-auto max-h-[90vh]">
                <CareerHome
                  onAgentClick={handleAgentClick}
                  onFaqClick={handleFaqClick}
                  onSendMessage={handleSendMessage}
                  onSendAudio={handleSendAudio}
                  sendLoading={sendLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden px-2 py-4 gap-2">
            <CareerChat
              agents={CAREER_AGENTS}
              messages={messages}
              selectedAgent={selectedAgent}
              historyCounts={historyCounts}
              onBackToTopics={handleBackToTopics}
              onSwitchAgent={handleSwitchAgent}
              onSendMessage={handleSendMessage}
              onSendAudio={handleSendAudio}
              sendLoading={sendLoading}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearHistoryModal}
        title="Vider l'historique"
        message="Voulez-vous vraiment vider tout l'historique du guide carrière ? Les discussions avec tous les coachs seront supprimées."
        onConfirm={handleConfirmClearHistory}
        onCancel={handleCancelClearHistory}
        confirmText="Vider"
        confirmClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
