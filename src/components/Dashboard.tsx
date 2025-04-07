
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelTop, BarChart2, Calendar, Lightbulb, Zap } from 'lucide-react';
import { BusinessProfile } from './BusinessProfileForm';
import { toast } from 'sonner';
import AIAssistant from './AIAssistant';

interface DashboardProps {
  businessProfile: BusinessProfile;
  postsCreated: number;
  onStartNewContent: () => void;
}

const Dashboard = ({ businessProfile, postsCreated, onStartNewContent }: DashboardProps) => {
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(true);

  const handlePanicMode = () => {
    toast('¡Modo pánico activado! Generando contenido...', {
      duration: 1500,
      icon: <Zap className="w-4 h-4 text-brand-teal" />,
    });
    
    setTimeout(() => {
      toast.success('Contenido rápido generado');
    }, 1500);
  };

  const toggleAssistantExpand = () => {
    setIsAssistantExpanded(!isAssistantExpanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <PanelTop className="w-5 h-5 text-brand-purple" />
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="text-brand-teal border-brand-teal hover:bg-brand-teal hover:text-white"
            onClick={handlePanicMode}
          >
            <Zap className="w-4 h-4 mr-2" />
            Modo Pánico
          </Button>
          
          <Button 
            className="bg-brand-purple hover:bg-brand-purple-dark"
            onClick={onStartNewContent}
          >
            Crear Contenido
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover bg-gradient-to-br from-brand-purple/10 to-white border-brand-purple/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-purple/10 rounded-md">
                <BarChart2 className="w-5 h-5 text-brand-purple" />
              </div>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Publicaciones creadas</div>
                <div className="text-2xl font-bold">{postsCreated}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Redes sociales</div>
                <div className="text-lg">Instagram, Facebook</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Objetivo más frecuente</div>
                <div className="text-lg">Vender</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-brand-blue/10 to-white border-brand-blue/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-blue/10 rounded-md">
                <Calendar className="w-5 h-5 text-brand-blue" />
              </div>
              <CardTitle className="text-lg">Planificador</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Próxima fecha clave</div>
                <div className="text-lg font-medium">Día del Padre (16 de junio)</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Publicaciones programadas</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <Button variant="outline" className="w-full mt-2" disabled>
                Ver Calendario
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-brand-coral/10 to-white border-brand-coral/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-coral/10 rounded-md">
                <Lightbulb className="w-5 h-5 text-brand-coral" />
              </div>
              <CardTitle className="text-lg">Aprende Más</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Guías y tutoriales</div>
                <div className="text-lg">Aprende a crear contenido efectivo</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Lecciones completadas</div>
                <div className="text-2xl font-bold">0/5</div>
              </div>
              <Button variant="outline" className="w-full mt-2" disabled>
                Comenzar Aprendizaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <AIAssistant 
          businessProfile={businessProfile} 
          isExpanded={isAssistantExpanded}
          onToggleExpand={toggleAssistantExpand}
        />
      </div>
    </div>
  );
};

export default Dashboard;
