
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Wand, PanelTop, Clock, Image, Edit, Copy, Download, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile } from './BusinessProfileForm';

interface ContentGeneratorProps {
  businessProfile: BusinessProfile;
  postsRemaining: number;
  onGenerateContent: () => void;
}

const POST_EXAMPLES = [
  {
    title: 'Oferta Especial',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    text: '¡OFERTA EXCLUSIVA! ✨ Solo por esta semana, llevate todos nuestros productos con un 25% OFF. ¡No te lo pierdas! 🛍️\n\n#oferta #descuento #compras',
    network: 'instagram',
    objective: 'sell'
  },
  {
    title: 'Nuevo Producto',
    imageUrl: 'https://images.unsplash.com/photo-1561998338-13ad7883b157',
    text: '¡NOVEDAD! 🚀 Presentamos nuestro último lanzamiento que transformará tu experiencia. ¡Descubre todos los detalles haciendo clic en el enlace de nuestra bio! 📱\n\n#nuevo #innovación #tecnología',
    network: 'instagram',
    objective: 'sell'
  },
  {
    title: 'Consejo Útil',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    text: '¿Sabías que...? 💡 Estos 3 consejos prácticos te ayudarán a mejorar tu productividad diaria. ¡Cuéntanos cuál te funcionó mejor! 👇\n\n#consejos #productividad #bienestar',
    network: 'facebook',
    objective: 'educate'
  }
];

const ContentGenerator = ({ businessProfile, postsRemaining, onGenerateContent }: ContentGeneratorProps) => {
  const [idea, setIdea] = useState('');
  const [network, setNetwork] = useState('instagram');
  const [objective, setObjective] = useState('sell');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);

  const handleGenerateContent = () => {
    if (!idea) {
      toast.error('Por favor, ingresa una idea para tu publicación');
      return;
    }

    setIsGenerating(true);
    
    // Simulate content generation
    setTimeout(() => {
      setIsGenerating(false);
      // Use the examples as mock generated content
      setGeneratedContent(POST_EXAMPLES);
      onGenerateContent();
      toast.success('¡Contenido generado con éxito!');
    }, 2000);
  };

  const handleQuickMode = () => {
    toast('Generando contenido rápido...', {
      duration: 1500,
      icon: <Zap className="w-4 h-4 text-brand-teal" />,
    });
    
    setIsGenerating(true);
    
    // Simulate quick content generation
    setTimeout(() => {
      setIsGenerating(false);
      // Use one example as mock generated content
      setGeneratedContent([POST_EXAMPLES[Math.floor(Math.random() * POST_EXAMPLES.length)]]);
      onGenerateContent();
      toast.success('¡Contenido rápido generado!');
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {generatedContent.length === 0 ? (
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
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
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
                  <SelectItem value="sell">Vender</SelectItem>
                  <SelectItem value="inform">Informar</SelectItem>
                  <SelectItem value="entertain">Entretener</SelectItem>
                  <SelectItem value="loyalty">Fidelizar</SelectItem>
                  <SelectItem value="educate">Educar</SelectItem>
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
                onClick={handleGenerateContent}
                disabled={postsRemaining <= 0 || isGenerating}
              >
                {isGenerating ? 'Generando...' : 'Generar Contenido'}
              </Button>
            </div>
          </div>
          
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
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <PanelTop className="w-5 h-5 text-brand-purple" />
              <h2 className="text-2xl font-bold text-gray-800">Contenido Generado</h2>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setGeneratedContent([]);
                setIdea('');
              }}
            >
              Crear Nuevo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {generatedContent.map((content, index) => (
              <Card key={index} className="overflow-hidden card-hover">
                <div className="relative h-48">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div className="text-white font-bold text-lg">{content.title}</div>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-500">
                      Versión {index + 1}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-gray-600 whitespace-pre-line h-32 overflow-y-auto">
                    {content.text}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between border-t">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Editar imagen
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Programar
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Publicación basada en:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-xs font-medium text-gray-500 block">Idea</span>
                <span className="block truncate">{idea || 'Generación rápida'}</span>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-xs font-medium text-gray-500 block">Canal</span>
                <span className="block capitalize">{generatedContent[0]?.network || network}</span>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-xs font-medium text-gray-500 block">Objetivo</span>
                <span className="block capitalize">{generatedContent[0]?.objective || objective}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
