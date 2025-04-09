export interface Music {
    id: string;
    title: string;
    music: string;
    user: string | null;
    business: string | null;
}
  
export interface ModalMusicProps {
    isOpen: boolean;
    onClose: () => void;
    fetchMusics: () => void;
}