export interface GreenFilter {
    id: string;
    title: string;
    image: string;
    user: string | null;
    business: string | null;
}
  
export interface ModalGreenFilterProps {
    isOpen: boolean;
    onClose: () => void;
    fetchGreenFilters: () => void;
}