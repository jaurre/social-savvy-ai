
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Calendar as CalendarIcon, ListChecks, Plus, Zap, Instagram, Facebook, Brush, Megaphone, AtSign, ThumbsUp, BookOpen, Clock, CalendarCheck, CalendarDays } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { BusinessProfile } from './BusinessProfileForm';
import ContentPostDetail from './ContentPostDetail';

interface ContentPlannerProps {
  businessProfile: BusinessProfile;
  postsCreated: number;
  onGenerateContent: () => void;
}

// Mock data for key dates based on business type
const getKeyDatesForBusiness = (businessType: string): { date: Date; name: string }[] => {
  const currentYear = new Date().getFullYear();
  
  const generalKeyDates = [
    { date: new Date(currentYear, 5, 16), name: "Día del Padre" },
    { date: new Date(currentYear, 9, 31), name: "Halloween" },
    { date: new Date(currentYear, 11, 25), name: "Navidad" },
    { date: new Date(currentYear, 11, 31), name: "Año Nuevo" },
  ];
  
  const businessSpecificDates: Record<string, { date: Date; name: string }[]> = {
    "Gastronomía": [
      { date: new Date(currentYear, 5, 2), name: "Día del Asado" },
      { date: new Date(currentYear, 9, 17), name: "Día de la Gastronomía" },
    ],
    "Moda": [
      { date: new Date(currentYear, 3, 30), name: "Día de la Moda" },
      { date: new Date(currentYear, 7, 19), name: "Día del Fotógrafo" },
    ],
    "Tecnología": [
      { date: new Date(currentYear, 9, 3), name: "Día de la Tecnología" },
      { date: new Date(currentYear, 4, 17), name: "Día de Internet" },
    ],
    "Salud": [
      { date: new Date(currentYear, 3, 7), name: "Día Mundial de la Salud" },
      { date: new Date(currentYear, 9, 10), name: "Día de la Salud Mental" },
    ],
  };
  
  const businessType1 = businessType.toLowerCase();
  let specificDates: { date: Date; name: string }[] = [];
  
  Object.keys(businessSpecificDates).forEach(key => {
    if (businessType1.includes(key.toLowerCase())) {
      specificDates = [...specificDates, ...businessSpecificDates[key]];
    }
  });
  
  return [...generalKeyDates, ...specificDates].sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Mock scheduled posts data
const mockScheduledPosts = [
  {
    id: 1,
    title: "Oferta Especial",
    date: addDays(new Date(), 2),
    network: "instagram",
    objective: "sell",
    status: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    content: "¡OFERTA EXCLUSIVA! ✨ Solo por esta semana, llevate todos nuestros productos con un 25% OFF. ¡No te lo pierdas! 🛍️\n\n#oferta #descuento #compras"
  },
  {
    id: 2,
    title: "Consejos Útiles",
    date: addDays(new Date(), 5),
    network: "facebook",
    objective: "educate",
    status: "draft",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    content: "¿Sabías que...? 💡 Estos 3 consejos prácticos te ayudarán a mejorar tu productividad diaria. ¡Cuéntanos cuál te funcionó mejor! 👇\n\n#consejos #productividad #bienestar"
  }
];

type ViewMode = 'week' | 'month';

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

const ContentPlanner = ({ businessProfile, postsCreated, onGenerateContent }: ContentPlannerProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>(mockScheduledPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  
  const keyDates = getKeyDatesForBusiness(businessProfile.industry || "General");
  
  // Get next key date
  const getNextKeyDate = () => {
    const today = new Date();
    return keyDates.find(keyDate => keyDate.date >= today) || keyDates[0];
  };
  
  const nextKeyDate = getNextKeyDate();
  
  // Handle post selection
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDetailOpen(true);
  };
  
  // Handle post save
  const handleSavePost = (updatedPost: Post) => {
    setScheduledPosts(scheduledPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };
  
  // Handle post delete
  const handleDeletePost = (postId: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
  };
  
  // Handle post duplicate
  const handleDuplicatePost = (post: Post) => {
    const newPost = {
      ...post,
      id: Math.floor(Math.random() * 1000) + 100,
      title: `${post.title} (copia)`,
      date: new Date(post.date.getTime() + 86400000) // Add one day
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
  };
  
  // Handle auto-scheduling content for the week
  const handleAutoScheduleWeek = () => {
    setIsLoading(true);
    
    toast('Generando contenido para la semana...', {
      duration: 2000,
      icon: <Zap className="w-4 h-4 text-brand-teal" />,
    });
    
    // Simulate API call
    setTimeout(() => {
      const startDate = startOfWeek(new Date());
      const newPosts = [];
      
      // Create posts for the next 7 days
      for (let i = 0; i < 7; i++) {
        const postDate = addDays(startDate, i);
        const networks = ['instagram', 'facebook', 'whatsapp'];
        const objectives = ['sell', 'inform', 'educate', 'entertain', 'loyalty'];
        const titles = ['Oferta del Día', 'Nuevo Producto', 'Consejos Útiles', 'Curiosidades', 'Promoción Especial'];
        
        newPosts.push({
          id: Math.floor(Math.random() * 1000) + 10,
          title: titles[Math.floor(Math.random() * titles.length)],
          date: postDate,
          network: networks[Math.floor(Math.random() * networks.length)],
          objective: objectives[Math.floor(Math.random() * objectives.length)],
          status: 'scheduled',
          imageUrl: `https://images.unsplash.com/photo-${1480000000000 + Math.floor(Math.random() * 10000000)}`,
          content: `Contenido generado automáticamente para ${format(postDate, 'EEEE dd/MM', { locale: es })}`
        });
      }
      
      setScheduledPosts([...scheduledPosts, ...newPosts]);
      setIsLoading(false);
      
      // Call onGenerateContent for each post (limited to available posts)
      for (let i = 0; i < Math.min(3, newPosts.length); i++) {
        onGenerateContent();
      }
      
      toast.success('Semana planificada con éxito');
    }, 2000);
  };
  
  const renderNetworkIcon = (network: string) => {
    switch (network) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'whatsapp':
        return <AtSign className="h-4 w-4 text-green-600" />;
      default:
        return <Megaphone className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const renderObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'sell':
        return <Megaphone className="h-4 w-4 text-amber-600" />;
      case 'inform':
        return <AtSign className="h-4 w-4 text-blue-600" />;
      case 'educate':
        return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'entertain':
        return <Brush className="h-4 w-4 text-pink-600" />;
      case 'loyalty':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };
  
  const renderPostsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const postsForDate = scheduledPosts.filter(
      post => format(post.date, 'yyyy-MM-dd') === formattedDate
    );
    
    return (
      <div className="space-y-1">
        {postsForDate.map(post => (
          <div 
            key={post.id}
            className="flex items-center gap-1 p-1 rounded-md bg-white border text-xs cursor-pointer hover:bg-gray-50"
            draggable
            onClick={() => handlePostClick(post)}
          >
            {renderNetworkIcon(post.network)}
            <span className="truncate">{post.title}</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full h-6 text-xs">
          <Plus className="h-3 w-3 mr-1" /> Añadir
        </Button>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      weekDays.push(currentDate);
    }
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const isCurrentDay = isToday(day);
          const dayHasKeyDate = keyDates.some(
            keyDate => format(keyDate.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          
          return (
            <div key={index} className="h-full">
              <div className={`text-center p-1 text-sm rounded-t-md ${isCurrentDay ? 'bg-brand-purple text-white' : dayHasKeyDate ? 'bg-brand-coral/20' : 'bg-gray-100'}`}>
                <div className="font-medium">{format(day, 'eee', { locale: es })}</div>
                <div>{format(day, 'dd')}</div>
              </div>
              <div className="border p-1 rounded-b-md min-h-[120px] bg-gray-50">
                {renderPostsForDate(day)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border w-full"
          locale={es}
        />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Publicaciones para {format(date, "d 'de' MMMM", { locale: es })}</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledPosts.filter(post => 
              format(post.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            ).length > 0 ? (
              <div className="space-y-2">
                {scheduledPosts
                  .filter(post => format(post.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                  .map(post => (
                    <Card key={post.id} className="shadow-sm" onClick={() => handlePostClick(post)}>
                      <div className="flex items-start p-3 cursor-pointer">
                        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 mr-3">
                          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="flex gap-1">
                              {renderNetworkIcon(post.network)}
                              {renderObjectiveIcon(post.objective)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{post.content}</p>
                        </div>
                      </div>
                      <CardFooter className="p-2 pt-0 flex justify-between border-t text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(post.date, 'HH:mm')}
                        </div>
                        <Badge variant={post.status === 'scheduled' ? 'outline' : 'secondary'} className="text-xs h-5">
                          {post.status === 'scheduled' ? 'Programado' : 'Borrador'}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CalendarDays className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No hay publicaciones programadas para esta fecha</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" /> Programar publicación
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-brand-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Planificador de Contenido</h2>
        </div>
        
        <Button 
          onClick={handleAutoScheduleWeek}
          disabled={isLoading}
          className="bg-brand-teal hover:bg-brand-teal/90"
        >
          <Zap className="w-4 h-4 mr-2" />
          Llenar semana en 3 clics
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="week" onValueChange={(value) => setViewMode(value as ViewMode)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Mensual
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(addWeeks(date, -1))}
                className="text-gray-500"
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(new Date())}
                className="text-gray-500"
              >
                Hoy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(addWeeks(date, 1))}
                className="text-gray-500"
              >
                Siguiente
              </Button>
            </div>
          </div>
          
          <TabsContent value="week" className="mt-0">
            {renderWeekView()}
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            {renderMonthView()}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-brand-blue/10 to-white border-brand-blue/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-blue/10 rounded-md">
                <CalendarCheck className="w-5 h-5 text-brand-blue" />
              </div>
              <CardTitle className="text-lg">Próximas fechas clave</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyDates.slice(0, 5).map((keyDate, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{format(keyDate.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{keyDate.name}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-brand-coral/10 to-white border-brand-coral/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-coral/10 rounded-md">
                <ListChecks className="w-5 h-5 text-brand-coral" />
              </div>
              <CardTitle className="text-lg">Resumen de planificación</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Próxima fecha clave</div>
                <div className="text-lg font-medium">
                  {nextKeyDate ? `${nextKeyDate.name} (${format(nextKeyDate.date, 'dd/MM/yyyy')})` : 'Sin fechas próximas'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Posts programados</div>
                  <div className="text-2xl font-bold">{scheduledPosts.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Publicaciones disponibles</div>
                  <div className="text-2xl font-bold">3</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Redes más usadas</div>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-pink-500">Instagram</Badge>
                  <Badge className="bg-blue-500">Facebook</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Post Detail Drawer */}
      <ContentPostDetail 
        post={selectedPost}
        isOpen={isPostDetailOpen}
        onClose={() => setIsPostDetailOpen(false)}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
        onDuplicate={handleDuplicatePost}
      />
    </div>
  );
};

export default ContentPlanner;
