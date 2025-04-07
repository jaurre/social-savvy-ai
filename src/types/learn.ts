
// Types for the learning module

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  content?: LessonContent;
}

export interface LessonContent {
  introduction: string;
  keyPoints: {
    title: string;
    description: string;
  }[];
  practicalExample: {
    title: string;
    description: string;
  };
  finalTip: string;
  actionButtonText: string;
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
