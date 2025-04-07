
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Star, ListCheck } from "lucide-react";
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
            
            <Progress value={completionPercentage} className="h-2 bg-gray-200" />
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
    content: {
      introduction: 'El contenido efectivo en redes sociales es aquel que logra captar la atención de tu audiencia y generar una acción concreta. En un mundo digital saturado de información, sobresalir se ha vuelto fundamental para cualquier negocio que busque crecer en el entorno online.',
      keyPoints: [
        {
          title: '¿Qué es contenido efectivo y por qué importa?',
          description: 'El contenido efectivo es aquel que cumple un objetivo específico: informar, entretener, inspirar o vender, mientras genera una conexión con tu audiencia. Importa porque determina si tu marca será recordada o pasará desapercibida. Las marcas con contenido efectivo logran hasta un 67% más de conversiones que aquellas con contenido genérico.'
        },
        {
          title: 'Tips para captar atención y generar engagement',
          description: 'Utiliza títulos impactantes que despierten curiosidad. Incluye preguntas directas a tu audiencia. Usa imágenes de alta calidad y contenido visual que destaque. Cuenta historias reales relacionadas con tu marca. Mantén un equilibrio entre contenido profesional y auténtico. Responde siempre a los comentarios y mensajes para fomentar la interacción.'
        },
        {
          title: 'Diferencias entre contenido de valor, promocional y emocional',
          description: 'Contenido de valor: Aporta soluciones o conocimiento útil (tutoriales, guías, consejos). Contenido promocional: Enfocado en tus productos o servicios (lanzamientos, ofertas, características). Contenido emocional: Busca generar una conexión más profunda (historias, testimonios, momentos especiales). La clave está en equilibrar estos tres tipos en tu estrategia.'
        }
      ],
      practicalExample: {
        title: 'Publicación efectiva para una cafetería',
        description: 'En lugar de: "Tenemos café recién molido", una publicación efectiva sería: "¿Sabías que el aroma del café mejora tu concentración un 30%? 🧠☕ Nuestro café de especialidad se muele justo antes de servirlo para que disfrutes al máximo esta experiencia. ¡Etiqueta a ese amigo que necesita un boost de productividad hoy! #CaféDeLaMañana". Este ejemplo combina un dato interesante (valor), menciona el producto (promoción) y genera una emoción (bienestar), además de incluir un llamado a la acción.'
      },
      finalTip: 'Antes de publicar cualquier contenido, pregúntate: ¿Qué quiero que sienta o haga mi audiencia al ver esto? Si no tienes una respuesta clara, reconsidera tu publicación.',
      actionButtonText: 'Aplicar en mis publicaciones'
    }
  },
  {
    id: 'lesson-2',
    title: 'Tono de Voz según tu Rubro',
    description: 'Descubre cómo adaptar el tono de comunicación según el sector de tu negocio y tu audiencia objetivo.',
    duration: '3 min',
    icon: 'MessageSquare',
    content: {
      introduction: 'El tono de voz de tu marca es como su personalidad escrita. Es la manera consistente en que te comunicas con tu audiencia y refleja tus valores y propósito. Elegir el tono de voz adecuado según tu rubro no solo te ayuda a diferenciarte de la competencia, sino que también construye una conexión más profunda con tus clientes ideales.',
      keyPoints: [
        {
          title: '¿Qué es el tono de voz y cómo influye en la marca?',
          description: 'El tono de voz es la actitud o emoción que transmites en tus comunicaciones. Puede ser formal, casual, divertido, técnico, inspirador, etc. Influye en la percepción que los clientes tienen de tu marca y puede ser determinante para que se identifiquen (o no) con tu negocio. Un estudio reveló que el 65% de los consumidores se conecta emocionalmente con una marca gracias a su tono de comunicación.'
        },
        {
          title: 'Ejemplos de tono por rubro',
          description: 'Gastronómico: Cálido, descriptivo y sensorial ("Nuestras pizzas artesanales se hornean lentamente para lograr esa textura perfecta entre crujiente y suave"). Moda: Inspirador y actual ("Reinventa tu estilo esta temporada con piezas que reflejan tu verdadera esencia"). Salud: Confiable y empático ("Entendemos tus preocupaciones y estamos aquí para acompañarte en cada paso de tu tratamiento"). Servicios profesionales: Profesional pero accesible ("Transformamos conceptos complejos en soluciones prácticas para tu empresa").'
        },
        {
          title: 'Cómo mantener coherencia entre publicaciones',
          description: 'Crea un documento de guía de estilo con ejemplos concretos de cómo comunicar en diferentes situaciones. Define 3-5 adjetivos que describan la personalidad de tu marca. Establece palabras o frases que tu marca utilizaría y cuáles nunca usaría. Revisa regularmente tus publicaciones anteriores para asegurar consistencia. Considera el contexto pero mantén la esencia de tu marca en todas las plataformas.'
        }
      ],
      practicalExample: {
        title: 'Mini ejercicio para definir tu tono ideal',
        description: 'Piensa en tu marca como si fuera una persona. ¿Cómo sería? ¿Qué edad tendría? ¿Cómo hablaría? Por ejemplo, una marca de juguetes educativos podría ser como "una maestra joven y entusiasta de 30 años que habla con términos sencillos pero inspiradores, que combina diversión con aprendizaje y siempre encuentra el lado positivo de las cosas". Este ejercicio te ayudará a visualizar mejor cómo debería "sonar" tu marca cuando se comunica.'
      },
      finalTip: 'No imites a tus competidores. Tu tono debe reflejar lo que hace única a tu marca. Es mejor tener un tono auténtico que resuene con una audiencia específica que intentar agradar a todos.',
      actionButtonText: 'Definir mi tono de marca'
    }
  },
  {
    id: 'lesson-3',
    title: 'Llamados a la Acción (CTAs) Efectivos',
    description: 'Estrategias y ejemplos de CTAs que realmente convierten y generan resultados para tu negocio.',
    duration: '2 min',
    icon: 'MousePointer',
    content: {
      introduction: 'Un Llamado a la Acción (CTA) es una instrucción directa que invita al usuario a realizar una acción específica. Es el puente entre el interés que has generado con tu contenido y la conversión que deseas obtener. Un buen CTA puede marcar la diferencia entre una publicación que solo recibe likes y una que realmente genera clientes.',
      keyPoints: [
        {
          title: '¿Qué es un CTA y por qué es clave?',
          description: 'Un CTA (Call to Action) es una frase o botón que indica claramente a tu audiencia qué acción debe realizar. Es clave porque guía al usuario hacia el siguiente paso en su relación con tu marca. Las publicaciones con CTAs claros obtienen un 371% más de interacciones que aquellas sin instrucciones específicas. Sin un buen CTA, incluso el contenido más atractivo puede quedarse en una simple visualización sin resultados concretos.'
        },
        {
          title: 'Tipos de CTA según objetivo',
          description: 'Para vender: "Compra ahora", "Aprovecha la oferta", "Reserva tu turno", "Últimas unidades". Para fidelizar: "Suscríbete para más consejos", "Únete a nuestra comunidad", "Activa las notificaciones". Para informar: "Descubre más", "Lee la guía completa", "Mira el tutorial". Para generar interacción: "Comenta tu experiencia", "Etiqueta a un amigo que necesite esto", "¿Estás de acuerdo? ¡Déjanos tu opinión!".'
        },
        {
          title: 'Elementos de un CTA efectivo',
          description: 'Verbo de acción al inicio (Descubre, Obtén, Regístrate). Sensación de urgencia o escasez cuando es apropiado ("Por tiempo limitado"). Beneficio claro para el usuario ("y recibe un 20% de descuento"). Simplicidad: instrucciones fáciles de seguir. Visibilidad: destacado visualmente en tu diseño o al final de tu texto. Personalización: adaptado a la etapa del cliente en su recorrido de compra.'
        }
      ],
      practicalExample: {
        title: 'Buen CTA vs Mal CTA para una tienda de ropa',
        description: 'Mal CTA: "Visita nuestra tienda" (genérico, sin urgencia ni beneficio claro). Buen CTA: "Estrena los nuevos diseños de otoño antes que nadie - ¡Compra online con 15% de descuento solo hasta mañana! Link en bio 👆" (específico, con urgencia, beneficio claro y dirección exacta de la acción). El segundo ejemplo es mucho más efectivo porque le dice exactamente al usuario qué hacer, por qué debería hacerlo y cuándo.'
      },
      finalTip: 'Haz A/B testing con diferentes CTAs para ver cuáles funcionan mejor con tu audiencia. A veces un pequeño cambio en las palabras puede duplicar tu tasa de conversión. Prueba opciones y mide los resultados.',
      actionButtonText: 'Mejorar mis CTAs ahora'
    }
  },
  {
    id: 'lesson-4',
    title: 'Frecuencia y Timing Óptimos',
    description: 'Cuándo y con qué frecuencia publicar en cada red social para maximizar el alcance y engagement.',
    duration: '3 min',
    icon: 'Clock',
    content: {
      introduction: 'La consistencia en redes sociales es clave para construir una audiencia comprometida, pero ¿cuánto es demasiado y cuánto es muy poco? Encontrar el equilibrio perfecto entre frecuencia y timing puede aumentar significativamente el alcance de tus publicaciones y el engagement de tu audiencia, sin invertir más en publicidad.',
      keyPoints: [
        {
          title: 'Frecuencia ideal de publicación por plataforma',
          description: 'Instagram: 3-5 publicaciones por semana en feed, stories diarias. Facebook: 3-5 publicaciones por semana. TikTok: Contenido diario recomendado, mínimo 3 veces por semana. LinkedIn: 2-3 publicaciones por semana. Twitter: 1-2 tuits diarios. Lo más importante es la consistencia en el tiempo y la calidad del contenido. Es mejor publicar 3 veces por semana consistentemente que 7 veces una semana y luego desaparecer.'
        },
        {
          title: 'Mejores horarios para publicar según plataforma',
          description: 'Instagram: Entre 11am-1pm para feed, 7pm-9pm para stories (mayor interacción). Facebook: Entre 1pm-3pm (días laborales) y 12pm-1pm (fines de semana). TikTok: 7pm-9pm (mayor actividad nocturna). LinkedIn: Martes a jueves entre 8am-10am o 4pm-6pm (horario laboral). Estos horarios son orientativos y pueden variar según tu ubicación y audiencia específica. Lo ideal es analizar tus propias estadísticas para identificar patrones.'
        },
        {
          title: 'Herramientas y automatización de publicación',
          description: 'Utiliza herramientas como Buffer, Hootsuite o Later para programar tus publicaciones con anticipación. Estas plataformas te permiten visualizar tu calendario de contenidos y mantener la consistencia. Dedica un día a la semana para programar tu contenido de toda la semana, así optimizas tu tiempo. Algunas herramientas incluso sugieren los mejores horarios basados en el comportamiento de tu audiencia específica.'
        }
      ],
      practicalExample: {
        title: 'Tabla sugerida para rutinas semanales',
        description: 'Lunes: Contenido motivacional o tips para comenzar la semana. Martes y Jueves: Contenido educativo o de valor sobre tu industria. Miércoles: Testimonios o casos de éxito. Viernes: Contenido más ligero o behind-the-scenes. Sábado: Ofertas o promociones especiales. Domingo: Contenido inspiracional o preparación para la semana. Esta estructura te ayuda a mantener variedad en tu contenido mientras mantienes una presencia constante.'
      },
      finalTip: 'La calidad siempre es más importante que la cantidad. Si no puedes mantener 5 publicaciones semanales de calidad, es mejor publicar 2-3 piezas excelentes. Recuerda que cada publicación representa tu marca y puede ser el primer contacto de un potencial cliente con tu negocio.',
      actionButtonText: 'Planificar mi calendario de contenido'
    }
  },
  {
    id: 'lesson-5',
    title: 'Tendencias Visuales en Redes Sociales',
    description: 'Descubre las últimas tendencias de diseño y formato visual para Instagram, TikTok y Facebook.',
    duration: '2 min',
    icon: 'TrendingUp',
    content: {
      introduction: 'El aspecto visual de tu contenido puede ser tan importante como el mensaje que transmites. Las tendencias visuales en redes sociales evolucionan rápidamente, y mantenerse actualizado puede ayudarte a captar la atención en un feed saturado de información. Adaptarse a estas tendencias no significa perder tu identidad de marca, sino presentarla de manera fresca y actual.',
      keyPoints: [
        {
          title: 'Tendencias visuales en Instagram',
          description: 'Minimalismo con toques de color: Fondos neutros con acentos de color vibrante. Carruseles educativos: Combinación de texto e imagen en formato deslizable. Estética nostálgica: Filtros que emulan fotografía analógica o retro. Publicaciones con texto integrado: Títulos grandes superpuestos en imágenes. Contenido "imperfecto": Fotos menos producidas y más espontáneas. Reels con transiciones creativas: Movimientos sincronizados con música o efectos visuales rápidos.'
        },
        {
          title: 'Tendencias visuales en TikTok',
          description: 'Vídeos POV (Point of View): Contar historias desde una perspectiva personal. Transiciones rápidas y sincronizadas: Cambios de escena al ritmo de la música. Tutoriales acelerados: Mostrar procesos completos en tiempo reducido. Contenido "detrás de cámaras": Mostrar el lado humano de tu negocio. Participación en trends y challenges: Adaptar tendencias populares a tu marca. Textos superpuestos: Subtítulos o comentarios adicionales que complementan el vídeo.'
        },
        {
          title: 'Adaptando tendencias a tu marca',
          description: 'Identifica los elementos visuales core de tu marca (colores, fuentes, estilo fotográfico). Experimenta adaptando tendencias actuales pero manteniendo estos elementos constantes. Observa qué tendencias están adoptando marcas similares a la tuya. No intentes seguir todas las tendencias; selecciona las que mejor se alineen con tu identidad. Prueba y mide: analiza qué formatos generan más engagement con tu audiencia específica.'
        }
      ],
      practicalExample: {
        title: 'Tendencia adaptada para una tienda de decoración',
        description: 'Tendencia: Videos "antes y después". Adaptación: Un Reel de 15 segundos mostrando la transformación de un espacio utilizando productos de la tienda. La primera parte muestra el espacio vacío o desordenado, y con una transición sincronizada con la música, revela el resultado final decorado. Se añaden textos que destacan características clave de los productos usados. Esta adaptación aprovecha una tendencia visual popular mientras muestra de forma efectiva los beneficios de los productos.'
      },
      finalTip: 'Mantén un equilibrio entre seguir tendencias y conservar una estética cohesiva y reconocible. Tus seguidores deberían poder identificar tu contenido incluso sin ver el nombre de tu cuenta. Las tendencias van y vienen, pero tu identidad visual debe mantenerse coherente.',
      actionButtonText: 'Actualizar mi estilo visual'
    }
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
