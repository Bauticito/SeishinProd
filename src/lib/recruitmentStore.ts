import { create } from 'zustand';

type RecruitmentState = {
  isOpen: boolean;
  selectedJobId: string | number | null;
  open: () => void;
  openWithJob: (jobId: string | number) => void;
  close: () => void;
};

export const useRecruitmentStore = create<RecruitmentState>((set) => ({
  isOpen: false,
  selectedJobId: null,
  open: () => set({ isOpen: true, selectedJobId: null }),
  openWithJob: (jobId) => set({ isOpen: true, selectedJobId: jobId }),
  close: () => set({ isOpen: false, selectedJobId: null }),
}));
