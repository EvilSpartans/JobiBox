export type EducationOption = {
  value: string;
  label: string;
};

export type EducationLevel = {
  [country: string]: EducationOption[];
};
