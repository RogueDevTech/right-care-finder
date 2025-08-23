import { create } from "zustand";

interface CounterState {
  openReviewModal: boolean;
  setOpenReviewModal: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  openReviewModal: false,
  setOpenReviewModal: () =>
    set((state) => ({ openReviewModal: !state.openReviewModal })),
}));
