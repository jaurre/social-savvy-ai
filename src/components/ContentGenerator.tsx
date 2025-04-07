
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Wand, PanelTop, Clock, Image, Edit, Copy, Download, Zap, Calendar, Trash2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile } from './BusinessProfileForm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateImageWithFallback, createImagePrompt, getAspectRatioForNetwork, shouldIncludeTextOnImage, generateOverlayText } from '@/utils/aiImageGenerator';
import { generateText } from '@/utils/aiTextGenerator';
import { GeneratedPost, createCanvaEditUrl, requiresImageEditing } from '@/models/GeneratedPost';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContentGeneratorProps {
  businessProfile: BusinessProfile;
  postsRemaining: number;
  onGenerateContent: () => void;
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

const ContentGenerator = ({ businessProfile, postsRemaining, onGenerateContent }: ContentGeneratorProps) => {
  const [idea, setIdea] = useState('');
  const [network, setNetwork] = useState('instagram');
  const [objective, setObjective] = useState('sell');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedPost[]>([]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isCanvaDialogOpen, setIsCanvaDialogOpen] = useState(false);
  const [canvaPost, setCanvaPost] = useState<GeneratedPost | null>(null);

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

  const ensureVariability = (textResults: any[]): boolean => {
    const titles = textResults.map(r => r.title);
    const uniqueTitles = new Set(titles);
    
    const bodies = textResults.map(r => r.body);
    const uniqueBodies = new Set(bodies);
    
    return uniqueTitles.size === textResults.length && uniqueBodies.size === textResults.length;
  };

  const handleGenerateContent = async () => {
    if (!idea) {
      toast.error('Por favor, ingresa una idea para tu publicación');
      return;
    }

    if (!validateBusinessProfile()) {
      return;
    }

    setIsGenerating(true);
    setProgressValue(0);
    setProgressStatus('Iniciando generación...');
    
    try {
      const newContent: GeneratedPost[] = [];
      let textResults = [];
      
      setProgressValue(10);
      setProgressStatus('Generando textos variados...');
      
      const approaches = [
        { focus: 'urgency', description: 'Enfoque de urgencia y escasez' },
        { focus: 'value', description: 'Enfoque en valor y beneficios' },
        { focus: 'emotion', description: 'Enfoque emocional o de curiosidad' }
      ];
      
      for (let i = 0; i < 3; i++) {
        const textResult = await generateText({
          businessProfile,
          idea,
          objective,
          network,
          approach: approaches[i].focus
        });
        
        textResults.push(textResult);
      }
      
      if (!ensureVariability(textResults)) {
        setProgressStatus('Mejorando variabilidad entre versiones...');
        const indexToRegenerate = Math.floor(Math.random() * 3);
        textResults[indexToRegenerate] = await generateText({
          businessProfile,
          idea,
          objective,
          network,
          approach: 'unique',
          forceUnique: true
        });
      }
      
      setProgressValue(30);
      setProgressStatus('Generando imágenes personalizadas...');
      
      for (let i = 0; i < 3; i++) {
        setProgressValue(30 + i * 20);
        setProgressStatus(`Generando versión ${i+1}...`);
        
        const includeTextOverlay = shouldIncludeTextOnImage(objective);
        const overlayText = includeTextOverlay ? generateOverlayText(objective, idea) : undefined;
        
        const imagePrompt = createImagePrompt(
          businessProfile, 
          idea, 
          objective, 
          overlayText,
          approaches[i].focus
        );
        
        let imageResult;
        try {
          imageResult = await generateImageWithFallback({
            prompt: imagePrompt,
            style: businessProfile.visualStyle,
            colorPalette: businessProfile.colorPalette,
            aspectRatio: getAspectRatioForNetwork(network),
            includedText: overlayText,
            networkFormat: network,
            businessName: businessProfile.name
          }, 4);
          
          if (imageResult.usedFallback) {
            const fallbackMessages = [
              '',
              'Usando proveedor alternativo para generar imagen',
              'Usando segundo proveedor alternativo',
              'Creando imagen de respaldo con marca',
              'Preparando plantilla de Canva'
            ];
            
            const level = imageResult.fallbackLevel || 1;
            
            if (level >= 3) {
              toast.warning(fallbackMessages[level], {
                description: "Se creó una imagen alternativa que puedes editar",
                duration: 5000,
              });
            }
          }
        } catch (error) {
          console.error('Fatal error in image generation:', error);
          // Create absolute fallback image that will never fail
          imageResult = {
            url: `https://via.placeholder.com/1200x1200/${businessProfile.colorPalette[0].replace('#', '')}/${businessProfile.colorPalette[1].replace('#', '')}?text=${encodeURIComponent(businessProfile.name + ': ' + idea)}`,
            prompt: imagePrompt,
            provider: 'error-fallback',
            usedFallback: true,
            fallbackLevel: 4,
            requiresEditing: true
          };
          
          toast.error('Error al generar imagen. Se usó plantilla básica.', {
            description: "Puedes editar esta imagen en Canva",
            duration: 5000,
          });
        }
        
        const canvaUrl = createCanvaEditUrl(imageResult.url, businessProfile.name);
        const requiresEditing = imageResult.requiresEditing || (imageResult.fallbackLevel && imageResult.fallbackLevel >= 3);
        
        const fullText = `${textResults[i].title}\n\n${textResults[i].body}\n\n${textResults[i].callToAction}\n\n${textResults[i].hashtags.map(tag => `#${tag}`).join(' ')}`;
        
        newContent.push({
          id: `post-${Date.now()}-${i}`,
          title: textResults[i].title,
          imageUrl: imageResult.url,
          text: fullText,
          network,
          objective,
          hashtags: textResults[i].hashtags,
          idea,
          createdAt: new Date(),
          imagePrompt: imagePrompt,
          imageProvider: imageResult.provider,
          textProvider: textResults[i].provider,
          imageOverlayText: overlayText,
          canvaEditUrl: canvaUrl,
          usedFallback: imageResult.usedFallback,
          fallbackLevel: imageResult.fallbackLevel,
          requiresEditing
        });
        
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setProgressValue(95);
      setProgressStatus('Finalizando...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedContent(newContent);
      setProgressValue(100);
      setProgressStatus('¡Generación completada!');
      onGenerateContent();
      toast.success('¡Contenido de alta calidad generado con éxito!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Hubo un error al generar el contenido. Por favor, intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickMode = async () => {
    toast('Generando contenido de alta calidad...', {
      duration: 1500,
      icon: <Zap className="w-4 h-4 text-brand-teal" />,
    });
    
    setIsGenerating(true);
    setProgressValue(0);
    setProgressStatus('Iniciando modo rápido...');
    
    try {
      const quickIdeas = [
        'promoción del mes',
        'novedades importantes',
        'consejo profesional',
        'agradecimiento especial'
      ];
      const quickIdea = quickIdeas[Math.floor(Math.random() * quickIdeas.length)];
      
      const quickObjectives = ['sell', 'inform', 'educate'];
      const quickObjective = quickObjectives[Math.floor(Math.random() * quickObjectives.length)];
      
      setProgressValue(20);
      setProgressStatus('Generando texto optimizado...');
      
      const textResult = await generateText({
        businessProfile,
        idea: quickIdea,
        objective: quickObjective,
        network
      });
      
      setProgressValue(50);
      setProgressStatus('Creando imagen profesional...');
      
      const includeTextOverlay = shouldIncludeTextOnImage(quickObjective);
      const overlayText = includeTextOverlay ? generateOverlayText(quickObjective, quickIdea) : undefined;
      
      const imagePrompt = createImagePrompt(businessProfile, quickIdea, quickObjective, overlayText);
      let imageResult;
      
      try {
        imageResult = await generateImageWithFallback({
          prompt: imagePrompt,
          style: businessProfile.visualStyle,
          colorPalette: businessProfile.colorPalette,
          aspectRatio: getAspectRatioForNetwork(network),
          includedText: overlayText,
          networkFormat: network,
          businessName: businessProfile.name
        }, 4);
        
        if (imageResult.usedFallback && imageResult.fallbackLevel && imageResult.fallbackLevel >= 3) {
          toast.warning('Se utilizó un método alternativo para la imagen', {
            description: "Puedes editar esta imagen en Canva",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Fatal error in quick mode image generation:', error);
        // Create absolute fallback image that will never fail
        imageResult = {
          url: `https://via.placeholder.com/1200x1200/${businessProfile.colorPalette[0].replace('#', '')}/${businessProfile.colorPalette[1].replace('#', '')}?text=${encodeURIComponent(businessProfile.name)}`,
          prompt: imagePrompt,
          provider: 'error-fallback',
          usedFallback: true,
          fallbackLevel: 4,
          requiresEditing: true
        };
        
        toast.error('Error al generar imagen. Se usó plantilla básica.');
      }
      
      setProgressValue(80);
      setProgressStatus('Optimizando resultado...');
      
      const canvaUrl = createCanvaEditUrl(imageResult.url, businessProfile.name);
      const requiresEditing = imageResult.requiresEditing || (imageResult.fallbackLevel && imageResult.fallbackLevel >= 3);
      
      const fullText = `${textResult.title}\n\n${textResult.body}\n\n${textResult.callToAction}\n\n${textResult.hashtags.map(tag => `#${tag}`).join(' ')}`;
      
      const newContent = [{
        id: `post-${Date.now()}-0`,
        title: textResult.title,
        imageUrl: imageResult.url,
        text: fullText,
        network,
        objective: quickObjective,
        hashtags: textResult.hashtags,
        idea: quickIdea,
        createdAt: new Date(),
        imagePrompt: imagePrompt,
        imageProvider: imageResult.provider,
        textProvider: textResult.provider,
        imageOverlayText: overlayText,
        canvaEditUrl: canvaUrl,
        usedFallback: imageResult.usedFallback,
        fallbackLevel: imageResult.fallbackLevel,
        requiresEditing
      }];
      
      setProgressValue(100);
      setProgressStatus('¡Listo!');
      
      setGeneratedContent(newContent);
      onGenerateContent();
      toast.success('¡Contenido de alta calidad generado en modo rápido!');
    } catch (error) {
      console.error('Error in quick mode:', error);
      toast.error('Hubo un error en el modo rápido. Por favor, intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Contenido copiado al portapapeles');
  };

  const handleSchedulePost = (post: GeneratedPost) => {
    setSelectedPost(post);
    setIsScheduleDialogOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate) {
      toast.error('Por favor selecciona una fecha para programar');
      return;
    }
    
    toast.success(`Publicación programada para ${scheduleDate}`);
    setIsScheduleDialogOpen(false);
    setScheduleDate('');
  };

  const handleCreateNew = () => {
    setGeneratedContent([]);
    setIdea('');
    setNetwork('instagram');
    setObjective('sell');
  };

  const openCanvaEditor = (post: GeneratedPost) => {
    if (post.fallbackLevel === 4 || post.imageProvider === 'canva-fallback' || post.requiresEditing) {
      setCanvaPost(post);
      setIsCanvaDialogOpen(true);
    } else {
      window.open(post.canvaEditUrl, '_blank', 'noopener,noreferrer');
      toast.success('Abriendo editor de imagen en Canva');
    }
  };

  const getFallbackBadge = (post: GeneratedPost) => {
    if (!post.usedFallback) return null;
    
    const level = post.fallbackLevel || 1;
    
    if (level <= 2) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                <Image className="h-3 w-3 mr-1" /> Alt. IA
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Imagen generada con proveedor alternativo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (level === 3) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" /> Plantilla
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Imagen plantilla generada - Editable en Canva</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">
                <Edit className="h-3 w-3 mr-1" /> Editar
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Requiere edición - Haz clic en "Editar en Canva"</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
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
                onClick={handleGenerateContent}
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
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <PanelTop className="w-5 h-5 text-brand-purple" />
              <h2 className="text-2xl font-bold text-gray-800">Contenido Generado</h2>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleCreateNew}
            >
              Crear Nuevo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {generatedContent.map((content, index) => (
              <Card key={content.id} className="overflow-hidden card-hover">
                <div className="relative h-52">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image in case of loading errors
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/1200x1200/${businessProfile.colorPalette[0].replace('#', '')}/${businessProfile.colorPalette[1].replace('#', '')}?text=${encodeURIComponent('Imagen para editar')}`;
                      if (!content.requiresEditing) {
                        content.requiresEditing = true;
                        toast.error('Error al cargar la imagen. Por favor, edita en Canva', { duration: 3000 });
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div className="text-white font-bold text-lg line-clamp-2">{content.title}</div>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="secondary" className="bg-white/80 text-black text-xs">
                      {content.imageProvider}
                    </Badge>
                    {getFallbackBadge(content)}
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-brand-purple text-white capitalize text-xs">
                      {SOCIAL_NETWORKS.find(n => n.value === content.network)?.label}
                    </Badge>
                  </div>
                  
                  {content.requiresEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Button 
                        variant="secondary" 
                        className="bg-white hover:bg-gray-100"
                        onClick={() => openCanvaEditor(content)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar imagen en Canva
                      </Button>
                    </div>
                  )}
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      Versión {index + 1}
                      <Badge variant="outline" className="capitalize text-xs">
                        {OBJECTIVES.find(o => o.value === content.objective)?.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        title="Copiar"
                        onClick={() => handleCopyContent(content.text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-gray-600 whitespace-pre-line h-36 overflow-y-auto">
                    {content.text}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {content.hashtags.slice(0, 5).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {content.hashtags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{content.hashtags.length - 5}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between border-t">
                  <div 
                    className={`text-xs flex items-center gap-1 cursor-pointer ${
                      content.requiresEditing || content.fallbackLevel === 4 || content.imageProvider === 'canva-fallback' 
                        ? 'text-red-500 font-medium' 
                        : 'text-gray-500 hover:text-brand-teal'
                    }`}
                    onClick={() => openCanvaEditor(content)}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {content.requiresEditing || content.fallbackLevel === 4 || content.imageProvider === 'canva-fallback' 
                      ? 'Editar imagen (requerido)' 
                      : 'Editar en Canva'}
                  </div>
                  <div 
                    className="text-xs text-brand-purple flex items-center gap-1 cursor-pointer hover:underline"
                    onClick={() => handleSchedulePost(content)}
                  >
                    <Calendar className="h-3 w-3" />
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
                <span className="block truncate">{generatedContent[0]?.idea || idea || 'Generación rápida'}</span>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-xs font-medium text-gray-500 block">Canal</span>
                <span className="block capitalize">{
                  SOCIAL_NETWORKS.find(n => n.value === generatedContent[0]?.network)?.label || 
                  SOCIAL_NETWORKS.find(n => n.value === network)?.label
                }</span>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-xs font-medium text-gray-500 block">Objetivo</span>
                <span className="block capitalize">{
                  OBJECTIVES.find(o => o.value === generatedContent[0]?.objective)?.label || 
                  OBJECTIVES.find(o => o.value === objective)?.label
                }</span>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                <Wand className="w-3.5 h-3.5 text-brand-purple" />
                Contenido generado con inteligencia artificial avanzada utilizando datos de tu negocio
              </p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleConfirmSchedule}>
              Programar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCanvaDialogOpen} onOpenChange={setIsCanvaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar imagen en Canva</DialogTitle>
            <DialogDescription>
              {canvaPost?.fallbackLevel === 4 || canvaPost?.imageProvider === 'canva-fallback' 
                ? 'No fue posible generar una imagen con IA. Te ofrecemos opciones para crear una imagen profesional.'
                : 'Personaliza tu imagen para hacerla única'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(canvaPost?.fallbackLevel === 4 || canvaPost?.imageProvider === 'canva-fallback') && (
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
                onClick={() => {
                  if (canvaPost?.canvaEditUrl) {
                    window.open(canvaPost.canvaEditUrl, '_blank', 'noopener,noreferrer');
                    toast.success('Abriendo editor de Canva con tu plantilla');
                    setIsCanvaDialogOpen(false);
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Editar en Canva con plantilla
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsCanvaDialogOpen(false)}
              >
                Volver al contenido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentGenerator;
