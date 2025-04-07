
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PanelTop } from 'lucide-react';
import { toast } from 'sonner';
import { GeneratedPost } from '@/models/GeneratedPost';
import { BusinessProfile } from './BusinessProfileForm';
import { generateImageWithFallback, createImagePrompt, getAspectRatioForNetwork, shouldIncludeTextOnImage, generateOverlayText } from '@/utils/aiImageGenerator';
import { generateText } from '@/utils/aiTextGenerator';

// Import refactored components
import ContentGeneratorForm from './content-generator/ContentGeneratorForm';
import GeneratedPostCard from './content-generator/GeneratedPostCard';
import GeneratedContentSummary from './content-generator/GeneratedContentSummary';
import SchedulePostDialog from './content-generator/SchedulePostDialog';
import CanvaEditorDialog from './content-generator/CanvaEditorDialog';
import { SOCIAL_NETWORKS, OBJECTIVES } from './content-generator/constants';

interface ContentGeneratorProps {
  businessProfile: BusinessProfile;
  postsRemaining: number;
  onGenerateContent: () => void;
}

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

  const handleGenerateContent = async (ideaText: string, networkValue: string, objectiveValue: string) => {
    setIdea(ideaText);
    setNetwork(networkValue);
    setObjective(objectiveValue);
    
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
          idea: ideaText,
          objective: objectiveValue,
          network: networkValue,
          approach: approaches[i].focus
        });
        
        textResults.push(textResult);
      }
      
      if (!ensureVariability(textResults)) {
        setProgressStatus('Mejorando variabilidad entre versiones...');
        const indexToRegenerate = Math.floor(Math.random() * 3);
        textResults[indexToRegenerate] = await generateText({
          businessProfile,
          idea: ideaText,
          objective: objectiveValue,
          network: networkValue,
          approach: 'unique',
          forceUnique: true
        });
      }
      
      setProgressValue(30);
      setProgressStatus('Generando imágenes personalizadas...');
      
      for (let i = 0; i < 3; i++) {
        setProgressValue(30 + i * 20);
        setProgressStatus(`Generando versión ${i+1}...`);
        
        const includeTextOverlay = shouldIncludeTextOnImage(objectiveValue);
        const overlayText = includeTextOverlay ? generateOverlayText(objectiveValue, ideaText) : undefined;
        
        const imagePrompt = createImagePrompt(
          businessProfile, 
          ideaText, 
          objectiveValue, 
          overlayText,
          approaches[i].focus
        );
        
        let imageResult;
        try {
          imageResult = await generateImageWithFallback({
            prompt: imagePrompt,
            style: businessProfile.visualStyle,
            colorPalette: businessProfile.colorPalette,
            aspectRatio: getAspectRatioForNetwork(networkValue),
            includedText: overlayText,
            networkFormat: networkValue,
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
            url: `https://via.placeholder.com/1200x1200/${businessProfile.colorPalette[0].replace('#', '')}/${businessProfile.colorPalette[1].replace('#', '')}?text=${encodeURIComponent(businessProfile.name + ': ' + ideaText)}`,
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
        
        const fullText = `${textResults[i].title}\n\n${textResults[i].body}\n\n${textResults[i].callToAction}\n\n${textResults[i].hashtags.map(tag => `#${tag}`).join(' ')}`;
        
        newContent.push({
          id: `post-${Date.now()}-${i}`,
          title: textResults[i].title,
          imageUrl: imageResult.url,
          text: fullText,
          network: networkValue,
          objective: objectiveValue,
          hashtags: textResults[i].hashtags,
          idea: ideaText,
          createdAt: new Date(),
          imagePrompt: imagePrompt,
          imageProvider: imageResult.provider,
          textProvider: textResults[i].provider,
          imageOverlayText: overlayText,
          canvaEditUrl: createCanvaEditUrl(imageResult.url, businessProfile.name),
          usedFallback: imageResult.usedFallback,
          fallbackLevel: imageResult.fallbackLevel,
          requiresEditing: imageResult.requiresEditing || (imageResult.fallbackLevel && imageResult.fallbackLevel >= 3)
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
      icon: null,
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
        canvaEditUrl: createCanvaEditUrl(imageResult.url, businessProfile.name),
        usedFallback: imageResult.usedFallback,
        fallbackLevel: imageResult.fallbackLevel,
        requiresEditing: imageResult.requiresEditing || (imageResult.fallbackLevel && imageResult.fallbackLevel >= 3)
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

  const handleConfirmSchedule = (date: string) => {
    if (!date) {
      toast.error('Por favor selecciona una fecha para programar');
      return;
    }
    
    toast.success(`Publicación programada para ${date}`);
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

  // Function from the original GeneratedPost model
  const createCanvaEditUrl = (imageUrl: string, businessName: string): string => {
    const encodedImage = encodeURIComponent(imageUrl);
    const encodedBusiness = encodeURIComponent(businessName);
    
    return `https://www.canva.com/design/new?template=true&imageUrl=${encodedImage}&businessName=${encodedBusiness}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {generatedContent.length === 0 ? (
        <ContentGeneratorForm 
          businessProfile={businessProfile}
          postsRemaining={postsRemaining}
          isGenerating={isGenerating}
          progressValue={progressValue}
          progressStatus={progressStatus}
          onGenerate={handleGenerateContent}
          onQuickMode={handleQuickMode}
        />
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
              <GeneratedPostCard
                key={content.id}
                post={content}
                index={index}
                onSchedule={handleSchedulePost}
                onOpenCanvaEditor={openCanvaEditor}
                onCopyContent={handleCopyContent}
                socialNetworks={SOCIAL_NETWORKS}
                objectives={OBJECTIVES}
              />
            ))}
          </div>
          
          <GeneratedContentSummary
            generatedPost={generatedContent[0] || null}
            idea={idea}
            network={network}
            objective={objective}
            socialNetworks={SOCIAL_NETWORKS}
            objectives={OBJECTIVES}
          />
        </div>
      )}

      <SchedulePostDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        selectedPost={selectedPost}
        onConfirmSchedule={handleConfirmSchedule}
      />

      <CanvaEditorDialog
        open={isCanvaDialogOpen}
        onOpenChange={setIsCanvaDialogOpen}
        post={canvaPost}
      />
    </div>
  );
};

export default ContentGenerator;
