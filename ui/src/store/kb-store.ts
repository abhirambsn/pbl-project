import { KnowledgeBaseState } from "@/interfaces/common.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useKnowledgeBaseStore = create(
  persist<KnowledgeBaseState>(
    (set) => ({
      knowledgeBaseList: [],
      currentPage: 1,
      totalPages: 1,
      entriesPerPage: 10,
      setKnowledgeBaseList: (knowledgeBaseList) =>
        set((state) => ({ ...state, knowledgeBaseList })),
      setCurrentPage: (currentPage) =>
        set((state) => ({ ...state, currentPage })),
      setEntriesPerPage: (entriesPerPage) =>
        set((state) => ({ ...state, entriesPerPage })),
      setTotalPages: (totalPages) => set((state) => ({ ...state, totalPages })),
      te: () => set({ knowledgeBaseList: [], currentPage: 1, totalPages: 1 }),
      clearState: () =>
        set({ knowledgeBaseList: [], currentPage: 1, totalPages: 1, entriesPerPage: 10 }),
    }),
    { name: "knowledge-base-store" }
  )
);
