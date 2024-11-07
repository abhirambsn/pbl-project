import { useModalStore } from "@/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const DialogForm = () => {
  const { isOpen, onClose, title, subtitle, CustomFormComponent } =
    useModalStore();

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
