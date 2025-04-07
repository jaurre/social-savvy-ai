
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Copy, Download, Calendar, ExternalLink } from 'lucide-react';
import { GeneratedPost } from '@/models/GeneratedPost';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Image } from 'lucide-react';

interface GeneratedPostCardProps {
  post: GeneratedPost;
  index: number;
  onSchedule: (post: GeneratedPost) => void;
  onOpenCanvaEditor: (post: GeneratedPost) => void;
  onCopyContent: (content: string) => void;
  socialNetworks: { value: string; label: string }[];
  objectives: { value: string; label: string }[];
}

const GeneratedPostCard: React.FC<GeneratedPostCardProps> = ({
  post,
  index,
  onSchedule,
  onOpenCanvaEditor,
  onCopyContent,
  socialNetworks,
  objectives
}) => {
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
    <Card className="overflow-hidden card-hover">
      <div className="relative h-52">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image in case of loading errors
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/1200x1200/ff0000/ffffff?text=${encodeURIComponent('Imagen para editar')}`;
            if (!post.requiresEditing) {
              post.requiresEditing = true;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
          <div className="text-white font-bold text-lg line-clamp-2">{post.title}</div>
        </div>
        
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="bg-white/80 text-black text-xs">
            {post.imageProvider}
          </Badge>
          {getFallbackBadge(post)}
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge className="bg-brand-purple text-white capitalize text-xs">
            {socialNetworks.find(n => n.value === post.network)?.label}
          </Badge>
        </div>
        
        {post.requiresEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Button 
              variant="secondary" 
              className="bg-white hover:bg-gray-100"
              onClick={() => onOpenCanvaEditor(post)}
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
              {objectives.find(o => o.value === post.objective)?.label}
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
              onClick={() => onCopyContent(post.text)}
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
          {post.text}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {post.hashtags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {post.hashtags.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{post.hashtags.length - 5}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between border-t">
        <div 
          className={`text-xs flex items-center gap-1 cursor-pointer ${
            post.requiresEditing || post.fallbackLevel === 4 || post.imageProvider === 'canva-fallback' 
              ? 'text-red-500 font-medium' 
              : 'text-gray-500 hover:text-brand-teal'
          }`}
          onClick={() => onOpenCanvaEditor(post)}
        >
          <ExternalLink className="h-3 w-3" />
          {post.requiresEditing || post.fallbackLevel === 4 || post.imageProvider === 'canva-fallback' 
            ? 'Editar imagen (requerido)' 
            : 'Editar en Canva'}
        </div>
        <div 
          className="text-xs text-brand-purple flex items-center gap-1 cursor-pointer hover:underline"
          onClick={() => onSchedule(post)}
        >
          <Calendar className="h-3 w-3" />
          Programar
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneratedPostCard;
