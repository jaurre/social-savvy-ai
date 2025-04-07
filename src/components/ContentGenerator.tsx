
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Wand, PanelTop, Clock, Image, Edit, Copy, Download, Zap, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile } from './BusinessProfileForm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContentGeneratorProps {
  businessProfile: BusinessProfile;
  postsRemaining: number;
  onGenerateContent: () => void;
}

interface GeneratedPost {
  id: string;
  title: string;
  imageUrl: string;
  text: string;
  network: string;
  objective: string;
  hashtags: string[];
  idea?: string;
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

// Helper function to generate random image from Unsplash based on business and idea
const getRandomImageUrl = (business: BusinessProfile, idea: string, network: string) => {
  const keywords = [
    business.industry,
    idea,
    business.visualStyle,
    network
  ].filter(Boolean).join(',');
  
  const width = 1200;
  const height = 800;
  const imageId = Math.floor(Math.random() * 1000);
  
  return `https://source.unsplash.com/random/${width}x${height}/?${encodeURIComponent(keywords)}&sig=${imageId}`;
};

// Helper function to generate hashtags based on business profile and objective
const generateHashtags = (business: BusinessProfile, objective: string, idea: string) => {
  const baseHashtags = [
    business.name.toLowerCase().replace(/\s/g, ''),
    business.industry.toLowerCase(),
    idea.toLowerCase().replace(/\s/g, '')
  ];
  
  let objectiveHashtags: string[] = [];
  
  switch (objective) {
    case 'sell':
      objectiveHashtags = ['oferta', 'promoción', 'descuento', 'compraahora'];
      break;
    case 'inform':
      objectiveHashtags = ['sabíasque', 'información', 'datos', 'actualidad'];
      break;
    case 'entertain':
      objectiveHashtags = ['diversión', 'humor', 'sonríe', 'momentos'];
      break;
    case 'loyalty':
      objectiveHashtags = ['gracias', 'clientes', 'fidelidad', 'comunidad'];
      break;
    case 'educate':
      objectiveHashtags = ['aprende', 'conocimiento', 'consejos', 'tips'];
      break;
  }
  
  return [...baseHashtags, ...objectiveHashtags].slice(0, 6);
};

// Generate post titles based on objective and business profile
const generatePostTitle = (objective: string, business: BusinessProfile, idea: string) => {
  const titles = {
    sell: [
      `¡OFERTA EXCLUSIVA para ${idea}!`,
      `¡DESCUENTO ESPECIAL en ${idea}!`,
      `¡PROMOCIÓN LIMITADA para ${idea}!`
    ],
    inform: [
      `Todo lo que debes saber sobre ${idea}`,
      `${business.name} te cuenta sobre ${idea}`,
      `¿Sabías esto sobre ${idea}?`
    ],
    entertain: [
      `Momentos divertidos con ${idea}`,
      `¡${idea} como nunca lo imaginaste!`,
      `La cara divertida de ${idea}`
    ],
    loyalty: [
      `Gracias por compartir ${idea} con nosotros`,
      `Celebramos ${idea} junto a ti`,
      `${business.name} valora tu apoyo con ${idea}`
    ],
    educate: [
      `Aprende todo sobre ${idea}`,
      `Guía completa de ${idea}`,
      `Tips profesionales para ${idea}`
    ]
  };
  
  const options = titles[objective as keyof typeof titles] || titles.inform;
  return options[Math.floor(Math.random() * options.length)];
};

// Generate post text based on all parameters
const generatePostText = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  network: string,
  title: string,
  hashtags: string[]
) => {
  let tone = business.tone === 'professional' ? 'formal' : 
             business.tone === 'funny' ? 'divertido' : business.tone;
  
  let intro = '';
  let body = '';
  let cta = '';
  let hashtagText = '';
  
  // Generate intro based on objective
  switch (objective) {
    case 'sell':
      intro = `¡${title} ✨ Solo por tiempo limitado en ${business.name}.`;
      body = `Disfruta de nuestra increíble oferta para ${idea}. ${business.description}`;
      cta = '¡No te lo pierdas! 🛍️ Contáctanos ahora mismo.';
      break;
    case 'inform':
      intro = `${title} 📢`;
      body = `Queremos compartirte información importante sobre ${idea}. En ${business.name} creemos que mantener a nuestra comunidad informada es esencial.`;
      cta = '¿Qué opinas sobre esto? Déjanos tu comentario 👇';
      break;
    case 'entertain':
      intro = `${title} 😄`;
      body = `En ${business.name} también nos gusta divertirnos. ${idea} puede ser una experiencia increíble cuando lo compartes con los mejores.`;
      cta = '¡Etiqueta a alguien con quien disfrutarías esto! 👯‍♂️';
      break;
    case 'loyalty':
      intro = `${title} ❤️`;
      body = `En ${business.name} valoramos enormemente tu confianza y lealtad. Queremos agradecerte por ser parte de nuestra comunidad y compartir ${idea} con nosotros.`;
      cta = '¿Cuál ha sido tu experiencia favorita con nosotros? Cuéntanos 💬';
      break;
    case 'educate':
      intro = `${title} 💡`;
      body = `Hoy queremos compartir nuestro conocimiento sobre ${idea}. ${business.description.split('.')[0]}.`;
      cta = '¿Te resultó útil esta información? Guárdala para consultarla después 📌';
      break;
  }
  
  // Adapt length based on network
  if (network === 'instagram' || network === 'tiktok') {
    body = body.split('.')[0] + '.';
  } else if (network === 'whatsapp') {
    body += ` ${business.slogan || ''}`;
  }
  
  // Add hashtags
  hashtagText = hashtags.map(tag => `#${tag}`).join(' ');
  
  return `${intro}\n\n${body}\n\n${cta}\n\n${hashtagText}`;
};

// Main function to generate posts
const generatePosts = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  network: string,
  count: number
): GeneratedPost[] => {
  const posts: GeneratedPost[] = [];
  
  for (let i = 0; i < count; i++) {
    const hashtags = generateHashtags(business, objective, idea);
    const title = generatePostTitle(objective, business, idea);
    const text = generatePostText(business, idea, objective, network, title, hashtags);
    const imageUrl = getRandomImageUrl(business, idea, network);
    
    posts.push({
      id: `post-${Date.now()}-${i}`,
      title,
      imageUrl,
      text,
      network,
      objective,
      hashtags,
      idea
    });
  }
  
  return posts;
};

const ContentGenerator = ({ businessProfile, postsRemaining, onGenerateContent }: ContentGeneratorProps) => {
  const [idea, setIdea] = useState('');
  const [network, setNetwork] = useState('instagram');
  const [objective, setObjective] = useState('sell');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedPost[]>([]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const handleGenerateContent = () => {
    if (!idea) {
      toast.error('Por favor, ingresa una idea para tu publicación');
      return;
    }

    setIsGenerating(true);
    
    // Generate 3 versions of the content
    setTimeout(() => {
      const newContent = generatePosts(
        businessProfile,
        idea,
        objective,
        network,
        3
      );
      
      setGeneratedContent(newContent);
      setIsGenerating(false);
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
    
    // Generate one piece of quick content with default values
    setTimeout(() => {
      const quickIdea = ['promoción', 'novedades', 'consejo útil', 'agradecimiento'][
        Math.floor(Math.random() * 4)
      ];
      
      const newContent = generatePosts(
        businessProfile,
        quickIdea,
        objective,
        network,
        1
      );
      
      setGeneratedContent(newContent);
      setIsGenerating(false);
      onGenerateContent();
      toast.success('¡Contenido rápido generado!');
    }, 1500);
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
              onClick={handleCreateNew}
            >
              Crear Nuevo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {generatedContent.map((content, index) => (
              <Card key={content.id} className="overflow-hidden card-hover">
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
                  <div className="text-sm text-gray-600 whitespace-pre-line h-32 overflow-y-auto">
                    {content.text}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between border-t">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Editar imagen
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
          </div>
        </div>
      )}

      {/* Schedule Dialog */}
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
    </div>
  );
};

export default ContentGenerator;
