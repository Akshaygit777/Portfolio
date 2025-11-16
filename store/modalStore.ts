import { create } from 'zustand';
import { Project } from '@/constants/contants';

interface ModalState {
  isModalOpen: boolean;
  selectedMedia: Project | null;
  setModalState: (isOpen: boolean, media: Project | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  selectedMedia: null,
  setModalState: (isOpen, media) => set({ isModalOpen: isOpen, selectedMedia: media }),
}));