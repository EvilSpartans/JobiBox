export type ContractOption = {
  value: string;
  label: string;
};

export type ContractType = {
  [country: string]: ContractOption[];
};
