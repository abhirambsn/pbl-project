import { useModalStore } from "@/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEffect } from "react";

const DialogForm = () => {
  const { isOpen, onClose, title, subtitle, CustomFormComponent } =
    useModalStore();

  useEffect(() => {
    console.log("DEBUG: isOpen", isOpen, title, subtitle, CustomFormComponent);
  }, [isOpen, title, subtitle, CustomFormComponent]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={isOpen} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <CustomFormComponent />
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
