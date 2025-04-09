import { QuestionVideo } from "./QuestionVideo";
import { User } from "./User";

export interface QuestionList {
    id: string;
    title: string;
    mainQuestionVideo: QuestionVideo;
    users: User[]
  }