
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface PostGenerationProgressProps {
  progressValue: number;
  progressStatus: string;
  isGenerating: boolean;
}

const PostGenerationProgress: React.FC<PostGenerationProgressProps> = ({
  progressValue,
  progressStatus,
  isGenerating
}) => {
  if (!isGenerating) return null;
  
  return (
    <div className="mt-6 space-y-2">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{progressStatus}</span>
        <span>{progressValue}%</span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};

export default PostGenerationProgress;
