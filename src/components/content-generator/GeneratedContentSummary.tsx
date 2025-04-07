
import React from 'react';
import { Wand } from 'lucide-react';
import { GeneratedPost } from '@/models/GeneratedPost';

interface GeneratedContentSummaryProps {
  generatedPost: GeneratedPost | null;
  idea: string;
  network: string;
  objective: string;
  socialNetworks: { value: string; label: string }[];
  objectives: { value: string; label: string }[];
}

const GeneratedContentSummary: React.FC<GeneratedContentSummaryProps> = ({
  generatedPost,
  idea,
  network,
  objective,
  socialNetworks,
  objectives
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Publicación basada en:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded border border-gray-200">
          <span className="text-xs font-medium text-gray-500 block">Idea</span>
          <span className="block truncate">{generatedPost?.idea || idea || 'Generación rápida'}</span>
        </div>
        <div className="bg-white p-3 rounded border border-gray-200">
          <span className="text-xs font-medium text-gray-500 block">Canal</span>
          <span className="block capitalize">{
            socialNetworks.find(n => n.value === generatedPost?.network)?.label || 
            socialNetworks.find(n => n.value === network)?.label
          }</span>
        </div>
        <div className="bg-white p-3 rounded border border-gray-200">
          <span className="text-xs font-medium text-gray-500 block">Objetivo</span>
          <span className="block capitalize">{
            objectives.find(o => o.value === generatedPost?.objective)?.label || 
            objectives.find(o => o.value === objective)?.label
          }</span>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-500">
        <p className="flex items-center gap-1">
          <Wand className="w-3.5 h-3.5 text-brand-purple" />
          Contenido generado con inteligencia artificial avanzada utilizando datos de tu negocio
        </p>
      </div>
    </div>
  );
};

export default GeneratedContentSummary;
