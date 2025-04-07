
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Star, ListCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Lesson, Achievement, Mission } from '@/types/learn';
import LessonCard from './LessonCard';
import MissionList from './MissionList';
import AchievementGrid from './AchievementGrid';

const LearnModule = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'missions' | 'achievements'>('lessons');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const totalLessons = lessons.length;
  const completionPercentage = (completedLessons.length / totalLessons) * 100;

  const handleCompleteLession = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      
      // Check for achievements
      if (newCompletedLessons.length === 1) {
        toast.success('¡Logro desbloqueado! 🏆 Primera lección completada');
      } else if (newCompletedLessons.length === 3) {
        toast.success('¡Logro desbloqueado! 🏆 Has completado 3 lecciones');
      } else if (newCompletedLessons.length === totalLessons) {
        toast.success('¡Felicidades! 🎉 Has completado todas las lecciones');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-purple" />
          <h2 className="text-2xl font-bold text-gray-800">Aprende Más</h2>
        </div>
        
        <div className="flex">
          <Badge variant="outline" className="bg-brand-purple/10 text-brand-purple">
            <Star className="w-3 h-3 mr-1" />
            Nivel 1: Aprendiz
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-brand-purple/5 to-white border-brand-purple/20">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center mb-4">
              <div className="p-3 rounded-full bg-brand-purple/10">
                <Award className="h-6 w-6 text-brand-purple" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">Tu progreso de aprendizaje</h3>
                <p className="text-gray-500 text-sm">Completa lecciones para desbloquear logros</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{completedLessons.length}/{totalLessons}</div>
                <div className="text-gray-500 text-sm">lecciones completadas</div>
              </div>
            </div>
            
            <Progress value={completionPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-brand-purple" />
          </CardContent>
        </Card>

        <div className="flex space-x-2 border-b mb-6">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'lessons' 
              ? 'text-brand-purple border-b-2 border-brand-purple' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" /> 
              Lecciones
            </div>
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'missions' 
              ? 'text-brand-purple border-b-2 border-brand-purple' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <ListCheck className="w-4 h-4 mr-2" /> 
              Misiones
            </div>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'achievements' 
              ? 'text-brand-purple border-b-2 border-brand-purple' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2" /> 
              Logros
            </div>
          </button>
        </div>

        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map(lesson => (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                isCompleted={completedLessons.includes(lesson.id)}
                onComplete={handleCompleteLession}
              />
            ))}
          </div>
        )}

        {activeTab === 'missions' && (
          <MissionList 
            missions={missions} 
            completedLessons={completedLessons} 
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementGrid 
            achievements={achievements} 
            completedLessons={completedLessons} 
          />
        )}
      </div>
    </div>
  );
};

// Data
const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Contenido Efectivo para Redes Sociales',
    description: 'Aprende los fundamentos para crear contenido que genere engagement y conversiones en diferentes plataformas.',
    duration: '2 min',
    icon: 'BookOpen',
  },
  {
    id: 'lesson-2',
    title: 'Tono de Voz según tu Rubro',
    description: 'Descubre cómo adaptar el tono de comunicación según el sector de tu negocio y tu audiencia objetivo.',
    duration: '3 min',
    icon: 'MessageSquare',
  },
  {
    id: 'lesson-3',
    title: 'Llamados a la Acción (CTAs) Efectivos',
    description: 'Estrategias y ejemplos de CTAs que realmente convierten y generan resultados para tu negocio.',
    duration: '2 min',
    icon: 'MousePointer',
  },
  {
    id: 'lesson-4',
    title: 'Frecuencia y Timing Óptimos',
    description: 'Cuándo y con qué frecuencia publicar en cada red social para maximizar el alcance y engagement.',
    duration: '3 min',
    icon: 'Clock',
  },
  {
    id: 'lesson-5',
    title: 'Tendencias Visuales en Redes Sociales',
    description: 'Descubre las últimas tendencias de diseño y formato visual para Instagram, TikTok y Facebook.',
    duration: '2 min',
    icon: 'TrendingUp',
  }
];

const missions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Primeros Pasos',
    description: 'Completa tu primera lección y crea una publicación',
    requirements: ['Completar 1 lección', 'Crear 1 publicación'],
    reward: '50 puntos',
    icon: 'Footprints',
  },
  {
    id: 'mission-2',
    title: 'Aprendiz Aplicado',
    description: 'Demuestra tu compromiso con el aprendizaje',
    requirements: ['Completar 3 lecciones', 'Crear 2 publicaciones'],
    reward: '100 puntos + Insignia',
    icon: 'GraduationCap',
  },
  {
    id: 'mission-3',
    title: 'Planificador Experto',
    description: 'Domina la planificación de contenido',
    requirements: ['Programar 5 publicaciones', 'Usar "Llenar semana en 3 clics"'],
    reward: '150 puntos + Desbloqueo de plantillas premium',
    icon: 'Calendar',
  }
];

const achievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'Primera Lección',
    description: 'Completaste tu primera lección',
    icon: 'Award',
    isUnlocked: (completedLessons) => completedLessons.length >= 1,
  },
  {
    id: 'achievement-2',
    title: 'Estudiante Dedicado',
    description: 'Completaste 3 lecciones',
    icon: 'BookOpen',
    isUnlocked: (completedLessons) => completedLessons.length >= 3,
  },
  {
    id: 'achievement-3',
    title: 'Maestro del Contenido',
    description: 'Completaste todas las lecciones',
    icon: 'GraduationCap',
    isUnlocked: (completedLessons) => completedLessons.length >= 5,
  },
  {
    id: 'achievement-4',
    title: 'Creador Consistente',
    description: 'Crea contenido 3 días seguidos',
    icon: 'Calendar',
    isUnlocked: () => false, // This would need to be implemented with actual tracking
  },
  {
    id: 'achievement-5',
    title: 'Estratega Social',
    description: 'Programa contenido para una semana completa',
    icon: 'BarChart2',
    isUnlocked: () => false, // This would need to be implemented with actual tracking
  },
  {
    id: 'achievement-6',
    title: 'Influencer en Potencia',
    description: 'Alcanza 1000 puntos de aprendizaje',
    icon: 'Star',
    isUnlocked: () => false, // This would need to be implemented with actual tracking
  }
];

export default LearnModule;
