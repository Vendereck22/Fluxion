"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDeleteDialog({
  open,
  title = "Confirmer la suppression",
  description = "Cette action est définitive. Voulez-vous vraiment continuer ?",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  isLoading = false,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isLoading && onOpenChange(nextOpen)}>
      <DialogContent className="overflow-hidden p-0" showCloseButton={!isLoading}>
        <div className="bg-gradient-to-br from-red-50 to-white px-6 py-5">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-500">
              <Trash2 size={18} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-heading text-xl font-black uppercase tracking-tight text-slate-950">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-slate-600">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <DialogFooter className="gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading} className="h-10 px-5">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="h-10 bg-red-600 px-5 text-white hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Suppression...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
