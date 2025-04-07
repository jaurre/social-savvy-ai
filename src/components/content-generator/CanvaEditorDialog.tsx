
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GeneratedPost } from '@/models/GeneratedPost';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface CanvaEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: GeneratedPost | null;
}

const CanvaEditorDialog: React.FC<CanvaEditorDialogProps> = ({
  open,
  onOpenChange,
  post
}) => {
  const handleOpenCanva = () => {
    if (post?.canvaEditUrl) {
      window.open(post.canvaEditUrl, '_blank', 'noopener,noreferrer');
      toast.success('Abriendo editor de Canva con tu plantilla');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar imagen en Canva</DialogTitle>
          <DialogDescription>
            {post?.fallbackLevel === 4 || post?.imageProvider === 'canva-fallback' 
              ? 'No fue posible generar una imagen con IA. Te ofrecemos opciones para crear una imagen profesional.'
              : 'Personaliza tu imagen para hacerla única'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {(post?.fallbackLevel === 4 || post?.imageProvider === 'canva-fallback') && (
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-sm">
              <p className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Imagen requiere edición</span>
              </p>
              <p className="mt-1">Nuestros motores de IA no pudieron generar una imagen adecuada para tu contenido. Puedes:</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-brand-purple" 
              onClick={handleOpenCanva}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Editar en Canva con plantilla
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => onOpenChange(false)}
            >
              Volver al contenido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanvaEditorDialog;
