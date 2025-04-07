
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { BusinessProfile } from './BusinessProfileForm';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface AIAssistantProps {
  businessProfile: BusinessProfile;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const AIAssistant = ({ businessProfile, isExpanded = true, onToggleExpand }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola ${businessProfile.name}! Soy tu asistente de marketing. Puedes pedirme que te cree un post para una fecha especial, te dé ideas para tu contenido o te ayude con tu estrategia de redes sociales.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }]);
    
    setIsLoading(true);
    
    // Simulate AI response with timeout
    setTimeout(() => {
      generateResponse(input);
      setIsLoading(false);
    }, 1000);
    
    setInput('');
  };

  const generateResponse = (userMessage: string) => {
    let response = '';
    
    // Simple pattern matching to generate contextual responses
    const lowerCaseMsg = userMessage.toLowerCase();
    
    if (lowerCaseMsg.includes('post') || lowerCaseMsg.includes('publicación')) {
      if (lowerCaseMsg.includes('día') || lowerCaseMsg.includes('fecha')) {
        response = `Claro, puedo ayudarte con un post para una fecha especial. Para ${businessProfile.industry}, te recomiendo contenido que destaque la relevancia de esta fecha para tu audiencia y cómo tu producto/servicio puede ser parte de la celebración. ¿Para qué fecha específica necesitas el post?`;
      } else {
        response = `Entendido, para crear un post efectivo para ${businessProfile.name} en el sector de ${businessProfile.industry}, recomiendo usar un tono ${businessProfile.tone} y enfocarse en los beneficios de tu servicio. ¿Para qué red social quieres crear este contenido?`;
      }
    } else if (lowerCaseMsg.includes('idea') || lowerCaseMsg.includes('sugerencia')) {
      response = `Algunas ideas de contenido para ${businessProfile.industry} podrían ser:\n\n1. Mostrar el "detrás de escena" de tu negocio\n2. Compartir testimonios de clientes satisfechos\n3. Crear tutoriales relacionados con tus productos/servicios\n4. Publicar datos interesantes o estadísticas de tu industria\n5. Realizar encuestas para conocer mejor a tu audiencia`;
    } else if (lowerCaseMsg.includes('estrategia')) {
      response = `Para desarrollar una estrategia efectiva para ${businessProfile.name}, recomendaría:\n\n1. Publicar contenido consistentemente (3-4 veces por semana)\n2. Alternar entre contenido educativo, promocional y de entretenimiento\n3. Usar hashtags relevantes para tu industria\n4. Participar activamente respondiendo comentarios\n5. Analizar qué tipo de contenido genera más engagement`;
    } else if (lowerCaseMsg.includes('métricas') || lowerCaseMsg.includes('estadística')) {
      response = `Para analizar métricas de forma efectiva, te recomiendo enfocarte en:\n\n1. Tasa de engagement (likes, comentarios, compartidos)\n2. Crecimiento de seguidores\n3. Alcance de tus publicaciones\n4. Conversiones (si tienes llamados a la acción)\n5. Mejor horario para publicar\n\n¿Necesitas ayuda para interpretar alguna métrica específica?`;
    } else {
      response = `Gracias por tu mensaje. Como tu asistente de marketing, estoy aquí para ayudarte con tu estrategia de contenido para ${businessProfile.name}. ¿Te gustaría que te ayude con ideas para posts, recomendaciones para mejorar tu presencia en redes sociales, o consejos específicos para tu sector (${businessProfile.industry})?`;
    }
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col ${isExpanded ? 'h-96' : 'h-20'} bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-brand-purple/10 p-2 rounded-full">
            <HelpCircle className="w-5 h-5 text-brand-purple" />
          </div>
          <h3 className="text-lg font-medium">Asistente IA</h3>
        </div>
        {onToggleExpand && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-gray-500"
          >
            {isExpanded ? 'Minimizar' : 'Expandir'}
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'assistant' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-brand-purple text-white'
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta o solicitud aquí..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                rows={1}
              />
              <Button 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-brand-purple hover:bg-brand-purple-dark rounded-md"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
