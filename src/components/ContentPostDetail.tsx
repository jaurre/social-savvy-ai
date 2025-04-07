
import React, { useState } from 'react';
import { Calendar, Pencil, Share2, Trash2, Copy, Save, Sparkles, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  date: Date;
  network: string;
  objective: string;
  status: string;
  imageUrl: string;
  content: string;
}

interface ContentPostDetailProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => void;
  onDelete: (postId: number) => void;
  onDuplicate: (post: Post) => void;
}

const ContentPostDetail: React.FC<ContentPostDetailProps> = ({
  post,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onDuplicate
}) => {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Update editingPost when post changes
  React.useEffect(() => {
    if (post) {
      setEditingPost({...post});
    }
  }, [post]);
  
  if (!post || !editingPost) return null;
  
  const renderNetworkIcon = (network: string) => {
    switch (network) {
      case 'instagram':
        return <Badge className="bg-pink-600">Instagram</Badge>;
      case 'facebook':
        return <Badge className="bg-blue-600">Facebook</Badge>;
      case 'whatsapp':
        return <Badge className="bg-green-600">WhatsApp</Badge>;
      default:
        return <Badge className="bg-gray-600">{network}</Badge>;
    }
  };
  
  const renderObjectiveBadge = (objective: string) => {
    switch (objective) {
      case 'sell':
        return <Badge variant="outline" className="border-amber-600 text-amber-600">Vender</Badge>;
      case 'inform':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Informar</Badge>;
      case 'educate':
        return <Badge variant="outline" className="border-purple-600 text-purple-600">Educar</Badge>;
      case 'entertain':
        return <Badge variant="outline" className="border-pink-600 text-pink-600">Entretener</Badge>;
      case 'loyalty':
        return <Badge variant="outline" className="border-green-600 text-green-600">Fidelizar</Badge>;
      default:
        return <Badge variant="outline">{objective}</Badge>;
    }
  };
  
  const handleSave = () => {
    if (editingPost) {
      onSave(editingPost);
      toast.success("Publicación guardada");
      onClose();
    }
  };
  
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date && editingPost) {
      // Create a new date with the same time as the original date
      const originalHours = editingPost.date.getHours();
      const originalMinutes = editingPost.date.getMinutes();
      
      const newDate = new Date(date);
      newDate.setHours(originalHours);
      newDate.setMinutes(originalMinutes);
      
      setEditingPost({
        ...editingPost,
        date: newDate
      });
      
      setShowCalendar(false);
      toast.success("Fecha actualizada");
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Editar Publicación</DrawerTitle>
          <DrawerDescription>
            {renderNetworkIcon(editingPost.network)} 
            <span className="mx-2">•</span> 
            {renderObjectiveBadge(editingPost.objective)}
            <span className="mx-2">•</span>
            <Badge variant={editingPost.status === 'scheduled' ? 'outline' : 'secondary'}>
              {editingPost.status === 'scheduled' ? 'Programado' : 'Borrador'}
            </Badge>
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <Label htmlFor="date" className="text-sm text-gray-500 mr-2">Programada para:</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {format(editingPost.date, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editingPost.date}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    locale={es}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title"
              value={editingPost.title}
              onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              placeholder="Título de la publicación"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="network">Red Social</Label>
            <Select 
              value={editingPost.network}
              onValueChange={(value) => setEditingPost({...editingPost, network: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona red social" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo</Label>
            <Select 
              value={editingPost.objective}
              onValueChange={(value) => setEditingPost({...editingPost, objective: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sell">Vender</SelectItem>
                <SelectItem value="inform">Informar</SelectItem>
                <SelectItem value="educate">Educar</SelectItem>
                <SelectItem value="entertain">Entretener</SelectItem>
                <SelectItem value="loyalty">Fidelizar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea 
              id="content"
              value={editingPost.content}
              onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
              className="min-h-[150px]"
              placeholder="Escribe el contenido de tu publicación aquí..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Imagen</Label>
            <div className="relative group border rounded-md overflow-hidden">
              <img 
                src={editingPost.imageUrl} 
                alt={editingPost.title} 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button variant="outline" className="bg-white/90 hover:bg-white">
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar imagen
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Vista previa móvil</h4>
            <div className="border border-gray-200 bg-white rounded-md p-3 max-w-[300px] mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div>
                  <div className="text-sm font-medium">Nombre de la empresa</div>
                  <div className="text-xs text-gray-500">{format(editingPost.date, "d MMM", { locale: es })}</div>
                </div>
              </div>
              <div className="mb-2">
                <img src={editingPost.imageUrl} alt={editingPost.title} className="w-full rounded-md" />
              </div>
              <div className="text-sm">{editingPost.content}</div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="flex-row justify-between px-4 py-4 border-t">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente esta publicación de tu calendario.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      onDelete(editingPost.id);
                      toast.success("Publicación eliminada");
                      onClose();
                    }}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onDuplicate(editingPost);
                toast.success("Publicación duplicada");
                onClose();
              }}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicar
            </Button>
          </div>
          
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="outline" size="sm">Cancelar</Button>
            </DrawerClose>
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-1" />
              Guardar
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ContentPostDetail;
