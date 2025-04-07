
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';

export interface BusinessProfile {
  name: string;
  industry: string;
  description: string;
  tone: string;
  colorPalette: string[];
  visualStyle: string;
  logo?: string;
  slogan?: string;
}

interface BusinessProfileFormProps {
  onComplete: (profile: BusinessProfile) => void;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Profesional' },
  { value: 'informal', label: 'Informal' },
  { value: 'funny', label: 'Divertido' },
  { value: 'elegant', label: 'Elegante' },
  { value: 'inspiring', label: 'Inspirador' }
];

const VISUAL_STYLE_OPTIONS = [
  { value: 'modern', label: 'Moderno' },
  { value: 'minimalist', label: 'Minimalista' },
  { value: 'colorful', label: 'Colorido' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'bold', label: 'Audaz' }
];

const INDUSTRY_OPTIONS = [
  { value: 'retail', label: 'Comercio Minorista' },
  { value: 'food', label: 'Gastronomía' },
  { value: 'tech', label: 'Tecnología' },
  { value: 'health', label: 'Salud y Bienestar' },
  { value: 'education', label: 'Educación' },
  { value: 'services', label: 'Servicios Profesionales' },
  { value: 'beauty', label: 'Belleza y Cosmética' },
  { value: 'fashion', label: 'Moda y Accesorios' },
  { value: 'other', label: 'Otro' }
];

const COLOR_PALETTES = {
  modern: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'],
  minimalist: ['#111827', '#374151', '#6B7280', '#9CA3AF', '#F3F4F6'],
  colorful: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
  vintage: ['#92400E', '#B45309', '#D97706', '#F59E0B', '#FBBF24'],
  bold: ['#7C3AED', '#4338CA', '#1D4ED8', '#0369A1', '#0891B2']
};

const BusinessProfileForm = ({ onComplete }: BusinessProfileFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfile>({
    name: '',
    industry: '',
    description: '',
    tone: '',
    colorPalette: [],
    visualStyle: '',
    logo: '',
    slogan: ''
  });

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Set default color palette based on visual style
    if (field === 'visualStyle' && value in COLOR_PALETTES) {
      const style = value as keyof typeof COLOR_PALETTES;
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        colorPalette: COLOR_PALETTES[style]
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.industry || !formData.description)) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (step === 2 && (!formData.tone || !formData.visualStyle)) {
      toast.error('Por favor selecciona un tono y estilo visual');
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
      toast.success('¡Perfil creado con éxito!');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-full h-2 rounded-full mx-1 ${i + 1 <= step ? 'bg-brand-purple' : 'bg-gray-200'}`} 
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {step === 1 ? 'Información Básica' : 
           step === 2 ? 'Personalidad de Marca' : 
           'Detalles Adicionales'}
        </h2>
        <p className="text-gray-600">
          {step === 1 ? 'Cuéntanos sobre tu negocio' : 
           step === 2 ? 'Define el tono y estilo de tu marca' : 
           'Añade elementos visuales a tu perfil'}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="business-name">Nombre del Negocio *</Label>
            <Input 
              id="business-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nombre de tu negocio"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business-industry">Rubro o Sector *</Label>
            <Select 
              value={formData.industry} 
              onValueChange={(value) => handleChange('industry', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un rubro" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="business-description">Descripción Breve *</Label>
            <Textarea 
              id="business-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe tu negocio en pocas palabras (máx. 300 caracteres)"
              className="mt-1 resize-none"
              maxLength={300}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/300 caracteres
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Label className="text-base">Tono de Voz *</Label>
            <RadioGroup 
              value={formData.tone} 
              onValueChange={(value) => handleChange('tone', value)}
              className="grid grid-cols-2 gap-2 mt-2"
            >
              {TONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tone-${option.value}`} />
                  <Label htmlFor={`tone-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-base">Estilo Visual *</Label>
            <RadioGroup 
              value={formData.visualStyle} 
              onValueChange={(value) => handleChange('visualStyle', value)}
              className="grid grid-cols-2 gap-2 mt-2"
            >
              {VISUAL_STYLE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`style-${option.value}`} />
                  <Label htmlFor={`style-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {formData.visualStyle && (
            <div>
              <Label className="text-base">Paleta de Colores</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.colorPalette.map((color, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Paleta sugerida basada en tu estilo visual
              </p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="business-slogan">Eslogan o Frase de Marca</Label>
            <Input 
              id="business-slogan"
              value={formData.slogan || ''}
              onChange={(e) => handleChange('slogan', e.target.value)}
              placeholder="Opcional: Una frase que represente a tu marca"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="business-logo">Logo</Label>
            <p className="text-sm text-gray-500 mb-2">Opcional: Puedes añadir un logo más adelante</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">
                Arrastra y suelta tu logo aquí o 
                <Button variant="link" className="px-1">selecciona un archivo</Button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            Atrás
          </Button>
        ) : (
          <div></div>
        )}
        <Button type="button" onClick={handleNext} className="bg-brand-purple hover:bg-brand-purple-dark">
          {step < 3 ? 'Siguiente' : 'Completar Perfil'}
        </Button>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
