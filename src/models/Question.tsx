export interface Question {
  response: string;
  updateState: any;
  id: string;
  title: string;
  type: string;
  userId: string | null;
  businessId: string | null;
  video: string;
}

export interface ModalQuestionProps {
  isOpen: boolean;
  onClose: () => void;
  fetchQuestions: () => void;
  currentTab: string;
  setSelectedQuestionsCandidat: (questions: any[]) => void;
  setSelectedQuestionsRecruteur: (questions: any[]) => void;
}
