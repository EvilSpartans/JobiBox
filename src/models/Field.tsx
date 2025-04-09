import { UseFormRegister } from "react-hook-form";
import { MultiValue } from "react-select";

export interface Option {
    label: string;
    value: string;
}

export interface CheckboxProps {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    error?: string;
    style?: React.CSSProperties;
}

export interface FileInputProps {
    name: string;
    accept?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  style?: React.CSSProperties;
  toggleVisibility?: () => void;
  isPasswordVisible?: boolean;
  className?: string;
}

export interface SelectProps {
  name: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: string;
  options: Option[];
  className?: string;
}

export interface SelectMultipleProps {
    name: string;
    placeholder: string;
    options: Option[];
    value: MultiValue<Option>;
    onChange: (value: MultiValue<Option>) => void;
    register: UseFormRegister<any>;
    error?: string;
    style?: React.CSSProperties;
    className?: string;
}

export interface TextareaProps {
    name: string;
    type?: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
}