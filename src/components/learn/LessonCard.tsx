
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, MessageSquare, MousePointer, Clock, TrendingUp, Check, Star } from "lucide-react";
import { Lesson } from '@/types/learn';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: (lessonId: string) => void;
}

const LessonCard = ({ lesson, isCompleted, onComplete }: LessonCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleStartLesson = () => {
    setIsDialogOpen(true);
  };
  
  const handleCompleteLesson = () => {
    onComplete(lesson.id);
    setIsDialogOpen(false);
  };

  const getIcon = () => {
    switch (lesson.icon) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'MousePointer':
        return <MousePointer className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <>
      <Card className={`card-hover ${isCompleted ? 'bg-gradient-to-br from-gray-50 to-white' : 'bg-white'} transition-all duration-300`}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-md ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-brand-blue/10 text-brand-blue'}`}>
              {isCompleted ? <Check className="w-5 h-5" /> : getIcon()}
            </div>
            <Badge variant="outline" className="bg-gray-100 text-gray-600">
              {lesson.duration}
            </Badge>
          </div>
          <h3 className={`text-lg font-medium mt-3 ${isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
            {lesson.title}
          </h3>
          <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
            {lesson.description}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant={isCompleted ? "outline" : "default"}
            className={isCompleted ? "w-full text-green-600" : "w-full bg-brand-blue hover:bg-brand-blue-dark"}
            onClick={handleStartLesson}
          >
            {isCompleted ? "Volver a ver" : "Comenzar"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{lesson.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Este sería el contenido de la lección. Incluiría videos, imágenes, texto y elementos interactivos para ayudar al usuario a aprender sobre marketing digital y creación de contenido.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-800 mb-2">Puntos clave:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Punto principal #1 sobre esta lección</li>
                  <li>Punto principal #2 sobre esta lección</li>
                  <li>Punto principal #3 sobre esta lección</li>
                </ul>
              </div>
              
              <div className="bg-brand-purple/5 p-4 rounded-md border border-brand-purple/20">
                <h4 className="font-medium text-brand-purple mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Consejo profesional:
                </h4>
                <p className="text-sm text-gray-700">
                  Aquí habría un consejo especial o truco útil relacionado con el tema de la lección que el usuario puede aplicar inmediatamente.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={handleCompleteLesson}>
              {isCompleted ? "Ya completado" : "Marcar como completado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LessonCard;
