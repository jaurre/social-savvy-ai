
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Wand, Loader2, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { BusinessProfile } from '../BusinessProfileForm';

interface ContentGeneratorFormProps {
  businessProfile: BusinessProfile;
  postsRemaining: number;
  isGenerating: boolean;
  progressValue: number;
  progressStatus: string;
  onGenerate: (idea: string, network: string, objective: string) => void;
  onQuickMode: () => void;
}

const SOCIAL_NETWORKS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'email', label: 'Email' }
];

const OBJECTIVES = [
  { value: 'sell', label: 'Vender' },
  { value: 'inform', label: 'Informar' },
  { value: 'entertain', label: 'Entretener' },
  { value: 'loyalty', label: 'Fidelizar' },
  { value: 'educate', label: 'Educar' }
];

const ContentGeneratorForm: React.FC<ContentGeneratorFormProps> = ({
  businessProfile,
  postsRemaining,
  isGenerating,
  progressValue,
  progressStatus,
  onGenerate,
  onQuickMode
}) => {
  const [idea, setIdea] = useState('');
  const [network, setNetwork] = useState('instagram');
  const [objective, setObjective] = useState('sell');

  const validateBusinessProfile = (): boolean => {
    if (!businessProfile.name || !businessProfile.industry || !businessProfile.description || 
        !businessProfile.tone || !businessProfile.visualStyle || !businessProfile.colorPalette || 
        businessProfile.colorPalette.length === 0) {
      toast.error('Perfil de negocio incompleto', {
        description: 'Por favor completa todos los campos requeridos en tu perfil de negocio antes de generar contenido.'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!idea) {
      toast.error('Por favor, ingresa una idea para tu publicación');
      return;
    }

    if (!validateBusinessProfile()) {
      return;
    }

    onGenerate(idea, network, objective);
  };

  const handleQuickMode = () => {
    if (!validateBusinessProfile()) {
      return;
    }
    
    onQuickMode();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Wand className="w-5 h-5 text-brand-purple" />
        <h2 className="text-2xl font-bold text-gray-800">Generador de Contenido</h2>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="content-idea" className="text-base font-medium">
          ¿Qué querés comunicar hoy?
        </Label>
        <Textarea 
          id="content-idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Ejemplo: Nuevo descuento en productos de temporada, Lanzamiento de servicio, Consejo útil para clientes..."
          className="mt-1 resize-none h-24"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="network" className="text-base font-medium">
            Canal
          </Label>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger id="network" className="mt-1">
              <SelectValue placeholder="Selecciona un canal" />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_NETWORKS.map(network => (
                <SelectItem key={network.value} value={network.value}>
                  {network.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="objective" className="text-base font-medium">
            Objetivo
          </Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger id="objective" className="mt-1">
              <SelectValue placeholder="Selecciona un objetivo" />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map(objective => (
                <SelectItem key={objective.value} value={objective.value}>
                  {objective.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="text-sm text-gray-500">
          {postsRemaining > 0 ? (
            <span>Te quedan <b>{postsRemaining}</b> publicaciones gratuitas</span>
          ) : (
            <span>Has utilizado todas tus publicaciones gratuitas</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="text-brand-teal border-brand-teal hover:bg-brand-teal hover:text-white"
            onClick={handleQuickMode}
            disabled={postsRemaining <= 0 || isGenerating}
          >
            <Zap className="w-4 h-4 mr-2" />
            Modo Rápido
          </Button>
          
          <Button 
            className="bg-brand-purple hover:bg-brand-purple-dark"
            onClick={handleSubmit}
            disabled={postsRemaining <= 0 || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : 'Generar Contenido'}
          </Button>
        </div>
      </div>
      
      {isGenerating && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{progressStatus}</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
      
      {postsRemaining <= 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <p className="font-medium">Has alcanzado el límite de publicaciones gratuitas</p>
          <p>Regístrate para continuar generando contenido increíble para tu negocio.</p>
          <Button className="mt-2 bg-amber-600 hover:bg-amber-700 text-white">
            Registrarme ahora
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentGeneratorForm;
