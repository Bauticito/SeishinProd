import { create } from 'zustand';

type RecruitmentState = {
  isOpen: boolean;
  selectedJobId: string;
  openWithJob: (jobId: string) => void;
  close: () => void;
};

export const useRecruitmentStore = create<RecruitmentState>((set) => ({
  isOpen: false,
  selectedJobId: '',
  openWithJob: (jobId) => set({ isOpen: true, selectedJobId: jobId }),
  close: () => set({ isOpen: false, selectedJobId: '' }),
}));
