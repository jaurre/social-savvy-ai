
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserIcon } from 'lucide-react';

interface GuestBannerProps {
  postsRemaining: number;
  onRegister: () => void;
}

const GuestBanner: React.FC<GuestBannerProps> = ({ postsRemaining, onRegister }) => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
      <UserIcon className="h-4 w-4" />
      <AlertTitle className="font-medium">Modo Invitado</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          {postsRemaining > 0 ? (
            <span>Te quedan <b>{postsRemaining}</b> publicaciones gratuitas.</span>
          ) : (
            <span>Has usado tus 3 publicaciones gratuitas.</span>
          )}
          <p className="text-sm mt-1">
            Regístrate para guardar tu progreso y desbloquear todas las funciones.
          </p>
        </div>
        <Button 
          className="mt-2 sm:mt-0 bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
          onClick={onRegister}
        >
          Registrarme ahora
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GuestBanner;
