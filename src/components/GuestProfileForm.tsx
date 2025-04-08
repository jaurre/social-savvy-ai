
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { BusinessProfile } from './BusinessProfileForm';
import { InfoIcon } from 'lucide-react';

interface GuestProfileFormProps {
  onComplete: (profile: BusinessProfile) => void;
  onRegisterInstead: () => void;
}

const INDUSTRIES = [
  "Gastronomía", "Tienda de ropa", "Estética y belleza", "Servicios profesionales", 
  "Educación", "Salud y bienestar", "Tecnología", "Hogar y decoración", 
  "Automotriz", "Turismo", "Construcción", "Otro"
];

const TONES = [
  "Profesional", "Conversacional", "Divertido", "Inspirador", 
  "Informativo", "Emocional", "Formal", "Minimalista"
];

const VISUAL_STYLES = [
  "Moderno", "Minimalista", "Vibrante", "Elegante", 
  "Retro/Vintage", "Corporativo", "Artístico", "Natural"
];

const COLOR_PALETTES = {
  "Azules": ["#1E3A8A", "#3B82F6", "#93C5FD"],
  "Verdes": ["#065F46", "#10B981", "#A7F3D0"],
  "Cálidos": ["#9A3412", "#F59E0B", "#FDE68A"],
  "Morados": ["#5B21B6", "#8B5CF6", "#DDD6FE"],
  "Rosados": ["#9D174D", "#EC4899", "#FBCFE8"],
  "Grises": ["#374151", "#9CA3AF", "#F3F4F6"],
};

const GuestProfileForm: React.FC<GuestProfileFormProps> = ({ onComplete, onRegisterInstead }) => {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const [visualStyle, setVisualStyle] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('');
  const [slogan, setSlogan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!businessName || !industry || !description || !tone || !visualStyle || !selectedPalette) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    const newProfile: BusinessProfile = {
      name: businessName,
      industry,
      description,
      tone,
      visualStyle,
      colorPalette: COLOR_PALETTES[selectedPalette as keyof typeof COLOR_PALETTES] || [],
      slogan: slogan || '',
      logo: ''
    };
    
    // Guardar en localStorage
    localStorage.setItem('guestProfile', JSON.stringify(newProfile));
    
    onComplete(newProfile);
    
    toast.success('¡Perfil creado con éxito!');
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Cuéntanos sobre tu negocio</CardTitle>
          <p className="text-gray-500">Personaliza el contenido que generaremos para ti</p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Modo Invitado</AlertTitle>
            <AlertDescription>
              Estás usando el modo invitado. Podrás crear hasta 3 publicaciones pero tus datos 
              no se guardarán permanentemente.
              <Button 
                className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={onRegisterInstead}
              >
                Registrarme ahora
              </Button>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-name">Nombre de tu negocio *</Label>
                <Input 
                  id="business-name" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej: Café Aromático"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Rubro o sector *</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Selecciona un rubro" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">
                  Breve descripción (máx. 300 caracteres) *
                </Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe brevemente tu negocio, productos o servicios..."
                  maxLength={300}
                  required
                  className="resize-none h-24"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {description.length}/300 caracteres
                </p>
              </div>
              
              <div>
                <Label htmlFor="tone">Tono de voz *</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="visual-style">Estilo visual *</Label>
                <Select value={visualStyle} onValueChange={setVisualStyle}>
                  <SelectTrigger id="visual-style">
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISUAL_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="color-palette">Paleta de colores *</Label>
                <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                  <SelectTrigger id="color-palette">
                    <SelectValue placeholder="Selecciona una paleta" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(COLOR_PALETTES).map((paletteName) => (
                      <SelectItem key={paletteName} value={paletteName}>
                        {paletteName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedPalette && (
                  <div className="flex mt-2 gap-2">
                    {COLOR_PALETTES[selectedPalette as keyof typeof COLOR_PALETTES].map((color, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="slogan">
                  Frase o slogan (opcional)
                </Label>
                <Input 
                  id="slogan" 
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ej: El mejor sabor en cada taza"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple-dark">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestProfileForm;
