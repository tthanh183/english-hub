import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DeleteConfirmationProps = {
  onConfirm: () => void;
  title: string;
  description: string;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export function DeleteConfirmation({
  onConfirm,
  title,
  description,
  trigger,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        {trigger}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
