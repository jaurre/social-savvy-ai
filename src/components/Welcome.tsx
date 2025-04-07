
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

interface WelcomeProps {
  onGetStarted: () => void;
}

const Welcome = ({ onGetStarted }: WelcomeProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-brand-purple/5">
      <div className="max-w-3xl w-full text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-purple to-brand-blue-dark bg-clip-text text-transparent">
          Crea contenido increíble para tus redes sociales
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Diseñado para pequeñas y medianas empresas que quieren destacar en redes sociales sin un equipo de marketing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Rápido y Sencillo</h3>
            <p className="text-gray-600 text-center">
              Crea contenido profesional en minutos, sin conocimientos técnicos.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16c1.1 0 2-.9 2-2c0-1.1-.9-2-2-2c-1.1 0-2 .9-2 2c0 1.1.9 2 2 2Z"></path>
                <path d="M6 16c1.1 0 2-.9 2-2c0-1.1-.9-2-2-2c-1.1 0-2 .9-2 2c0 1.1.9 2 2 2Z"></path>
                <path d="M18 16c1.1 0 2-.9 2-2c0-1.1-.9-2-2-2c-1.1 0-2 .9-2 2c0 1.1.9 2 2 2Z"></path>
                <path d="M6 8c0-3.3 2.7-6 6-6s6 2.7 6 6v8"></path>
                <path d="M6 16v-4"></path>
                <path d="M18 16v-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalizado</h3>
            <p className="text-gray-600 text-center">
              Adaptado al estilo y tono de tu negocio para mantener coherencia.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-coral/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"></path>
                <path d="M8 9h8"></path>
                <path d="M8 15h8"></path>
                <path d="M11 6v3"></path>
                <path d="M11 15v3"></path>
                <path d="M13 6v3"></path>
                <path d="M13 15v3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Inteligente</h3>
            <p className="text-gray-600 text-center">
              Impulsado por IA avanzada para crear contenido que conecta con tu audiencia.
            </p>
          </div>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-4 text-sm text-gray-500">Prueba gratis</span>
          </div>
        </div>
        
        <Button 
          onClick={onGetStarted} 
          className="text-lg px-8 py-6 bg-brand-purple hover:bg-brand-purple-dark animate-bounce-light"
        >
          Comenzar Ahora
        </Button>
        
        <p className="mt-4 text-sm text-gray-500">
          Crea hasta 3 publicaciones gratis, sin tarjeta de crédito
        </p>
      </div>
    </div>
  );
};

export default Welcome;
