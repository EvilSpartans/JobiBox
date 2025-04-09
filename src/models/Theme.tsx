export interface Theme {
    id: string;
    title: string;
    image: string;
    user: string | null;
    color: string;
    business: string | null;
}
  
export interface ModalThemeProps {
    isOpen: boolean;
    onClose: () => void;
    fetchThemes: () => void;
}