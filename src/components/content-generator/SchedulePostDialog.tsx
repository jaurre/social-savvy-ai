
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GeneratedPost } from '@/models/GeneratedPost';

interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: GeneratedPost | null;
  onConfirmSchedule: (date: string) => void;
}

const SchedulePostDialog: React.FC<SchedulePostDialogProps> = ({
  open,
  onOpenChange,
  selectedPost,
  onConfirmSchedule
}) => {
  const [scheduleDate, setScheduleDate] = useState('');

  const handleConfirm = () => {
    onConfirmSchedule(scheduleDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar publicación</DialogTitle>
          <DialogDescription>
            Selecciona la fecha y hora para publicar este contenido
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="schedule-date">Fecha y hora</Label>
            <Input
              id="schedule-date"
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Vista previa</Label>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="font-medium">{selectedPost?.title}</p>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{selectedPost?.text}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleConfirm}>
            Programar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePostDialog;
