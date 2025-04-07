
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footprints, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import { Mission } from '@/types/learn';

interface MissionListProps {
  missions: Mission[];
  completedLessons: string[];
}

const MissionList = ({ missions, completedLessons }: MissionListProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Footprints className="w-5 h-5" />;
    }
  };

  // Simple check for mission completion based on completed lessons
  const isMissionCompleted = (mission: Mission) => {
    if (mission.id === 'mission-1') {
      return completedLessons.length >= 1;
    } else if (mission.id === 'mission-2') {
      return completedLessons.length >= 3;
    }
    return false;
  };

  // Calculate progress percentage
  const getMissionProgress = (mission: Mission) => {
    if (mission.id === 'mission-1') {
      return Math.min(completedLessons.length / 1, 1) * 100;
    } else if (mission.id === 'mission-2') {
      return Math.min(completedLessons.length / 3, 1) * 100;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {missions.map(mission => {
        const completed = isMissionCompleted(mission);
        const progress = getMissionProgress(mission);
        
        return (
          <Card key={mission.id} className={`transition-all duration-300 ${completed ? 'bg-gradient-to-br from-green-50 to-white border-green-200' : 'bg-white'}`}>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className={`p-3 rounded-full ${completed ? 'bg-green-100 text-green-600' : 'bg-brand-purple/10 text-brand-purple'}`}>
                  {completed ? <CheckCircle2 className="h-6 w-6" /> : getIcon(mission.icon)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{mission.title}</h3>
                      <p className="text-gray-600 text-sm">{mission.description}</p>
                    </div>
                    
                    {completed ? (
                      <Badge className="bg-green-100 text-green-600 border-green-200">
                        Completada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-brand-purple/5 text-brand-purple border-brand-purple/20">
                        {Math.round(progress)}% completado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Requisitos:</h4>
                    <ul className="space-y-2">
                      {mission.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          {req.startsWith('Completar') && completedLessons.length >= parseInt(req.split(' ')[1]) ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                          )}
                          <span className={req.startsWith('Completar') && completedLessons.length >= parseInt(req.split(' ')[1]) ? 'text-gray-500 line-through' : 'text-gray-700'}>
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm font-medium">
                        <span className="text-gray-500">Recompensa: </span>
                        <span className="text-brand-purple">{mission.reward}</span>
                      </div>
                      
                      {completed ? (
                        <Button variant="outline" className="text-green-600" disabled>
                          Recompensa reclamada
                        </Button>
                      ) : (
                        <Button variant="outline" disabled={progress < 100}>
                          {progress < 100 ? 'Completa los requisitos' : 'Reclamar recompensa'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MissionList;
