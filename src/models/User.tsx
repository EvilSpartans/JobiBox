export interface User {
  job: string;
  id?: string;
  token: string;
  roles: string[];
  email: string;
  username: string;
  userIdentifier?: string;
  password?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  firstname: string;
  lastname: string;
  avatar: string;
  cover: string;
  questionLists: any[];
}

export type Token = {
  token: string | null;
};