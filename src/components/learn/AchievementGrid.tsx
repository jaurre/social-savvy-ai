
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, GraduationCap, Calendar, BarChart2, Star, Lock } from 'lucide-react';
import { Achievement } from '@/types/learn';

interface AchievementGridProps {
  achievements: Achievement[];
  completedLessons: string[];
}

const AchievementGrid = ({ achievements, completedLessons }: AchievementGridProps) => {
  const getIcon = (iconName: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return <Lock className="w-6 h-6 text-gray-400" />;
    }
    
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-brand-blue" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-brand-purple" />;
      case 'Calendar':
        return <Calendar className="w-6 h-6 text-green-500" />;
      case 'BarChart2':
        return <BarChart2 className="w-6 h-6 text-brand-coral" />;
      case 'Star':
        return <Star className="w-6 h-6 text-amber-500" />;
      default:
        return <Award className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievements.map(achievement => {
        const isUnlocked = achievement.isUnlocked(completedLessons);
        
        return (
          <Card 
            key={achievement.id} 
            className={`text-center p-4 transition-all duration-300 ${
              isUnlocked 
                ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <CardContent className="p-0 flex flex-col items-center">
              <div className={`p-4 rounded-full mb-3 ${
                isUnlocked 
                  ? 'bg-yellow-100' 
                  : 'bg-gray-200'
              }`}>
                {getIcon(achievement.icon, isUnlocked)}
              </div>
              
              <h3 className={`text-base font-medium mb-1 ${
                isUnlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              
              <p className="text-xs text-gray-500">
                {achievement.description}
              </p>
              
              <div className={`text-xs mt-2 px-2 py-1 rounded-full ${
                isUnlocked 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AchievementGrid;
