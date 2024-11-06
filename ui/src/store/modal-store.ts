import { ModalFormState } from "@/interfaces/common.interface";
import { create } from "zustand";

export const useModalStore = create<ModalFormState>((set) => ({
  isOpen: false,
  CustomFormComponent: () => (""),
  title: "",
  subtitle: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCustomFormComponent: (component) =>
    set({ CustomFormComponent: component }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
}));
