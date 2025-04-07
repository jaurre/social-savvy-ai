
// Types for the learning module

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  reward: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (completedLessons: string[]) => boolean;
}
