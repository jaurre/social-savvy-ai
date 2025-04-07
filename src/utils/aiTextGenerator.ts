import { BusinessProfile } from '@/components/BusinessProfileForm';

// Interface for text generation request parameters
export interface TextGenerationParams {
  businessProfile: BusinessProfile;
  idea: string;
  objective: string;
  network: string;
}

// Interface for text generation response
export interface GeneratedText {
  title: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  provider: string;
}

// Function to simulate AI text generation
// In a real implementation, this would connect to actual AI text APIs
export const generateText = async (params: TextGenerationParams): Promise<GeneratedText> => {
  console.log('Generating text with params:', params);
  
  // Generate hashtags based on business profile and objective
  const hashtags = generateHashtags(
    params.businessProfile,
    params.objective,
    params.idea
  );
  
  // Generate post title based on objective and business profile
  const title = generatePostTitle(
    params.objective,
    params.businessProfile,
    params.idea
  );
  
  // Generate full post text including CTA
  const { body, callToAction } = generatePostBody(
    params.businessProfile,
    params.idea,
    params.objective,
    params.network,
    title
  );
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    title,
    body,
    callToAction,
    hashtags,
    provider: getRandomProvider()
  };
};

// Helper function to generate hashtags based on business profile and objective
export const generateHashtags = (
  business: BusinessProfile,
  objective: string,
  idea: string
): string[] => {
  const baseHashtags = [
    business.name.toLowerCase().replace(/\s/g, ''),
    business.industry.toLowerCase(),
    idea.toLowerCase().replace(/[^\w\sáéíóúñ]/g, '').replace(/\s+/g, '')
  ];
  
  let objectiveHashtags: string[] = [];
  
  switch (objective) {
    case 'sell':
      objectiveHashtags = ['oferta', 'promoción', 'descuento', 'compraahora', 'limitado'];
      break;
    case 'inform':
      objectiveHashtags = ['sabíasque', 'información', 'datos', 'actualidad', 'novedades'];
      break;
    case 'entertain':
      objectiveHashtags = ['diversión', 'humor', 'sonríe', 'momentos', 'felicidad'];
      break;
    case 'loyalty':
      objectiveHashtags = ['gracias', 'clientes', 'fidelidad', 'comunidad', 'valoramos'];
      break;
    case 'educate':
      objectiveHashtags = ['aprende', 'conocimiento', 'consejos', 'tips', 'educación'];
      break;
  }
  
  // Add some industry-specific hashtags
  let industryHashtags: string[] = [];
  switch (business.industry) {
    case 'retail':
      industryHashtags = ['tienda', 'shopping', 'productos', 'calidad'];
      break;
    case 'food':
      industryHashtags = ['comida', 'foodie', 'delicioso', 'gastronomía'];
      break;
    case 'tech':
      industryHashtags = ['tecnología', 'innovación', 'digital', 'futuro'];
      break;
    case 'health':
      industryHashtags = ['salud', 'bienestar', 'healthy', 'vida'];
      break;
    case 'education':
      industryHashtags = ['educación', 'aprendizaje', 'cursos', 'conocimiento'];
      break;
    case 'services':
      industryHashtags = ['servicios', 'profesional', 'expertos', 'soluciones'];
      break;
    case 'beauty':
      industryHashtags = ['belleza', 'cosmética', 'skin', 'beauty'];
      break;
    case 'fashion':
      industryHashtags = ['moda', 'estilo', 'fashion', 'tendencias'];
      break;
    default:
      industryHashtags = ['negocio', 'empresa', 'servicio', 'calidad'];
  }
  
  // Combine all hashtags and pick a subset
  const allHashtags = [...baseHashtags, ...objectiveHashtags, ...industryHashtags];
  const uniqueHashtags = [...new Set(allHashtags)]; // Remove duplicates
  
  // Shuffle and pick a subset (max 8 hashtags)
  return shuffleArray(uniqueHashtags).slice(0, 8);
};

// Generate post titles based on objective and business profile
export const generatePostTitle = (
  objective: string,
  business: BusinessProfile,
  idea: string
): string => {
  // Base titles for each objective
  const titles = {
    sell: [
      `¡OFERTA EXCLUSIVA para ${idea}!`,
      `¡DESCUENTO ESPECIAL en ${idea}!`,
      `¡PROMOCIÓN LIMITADA para ${idea}!`,
      `¿Buscas ${idea}? ¡Tenemos la solución!`,
      `${idea} como nunca antes lo imaginaste`
    ],
    inform: [
      `Todo lo que debes saber sobre ${idea}`,
      `${business.name} te cuenta sobre ${idea}`,
      `¿Sabías esto sobre ${idea}?`,
      `Importantes novedades: ${idea}`,
      `Lo último sobre ${idea} que debes conocer`
    ],
    entertain: [
      `Momentos divertidos con ${idea}`,
      `¡${idea} como nunca lo imaginaste!`,
      `La cara divertida de ${idea}`,
      `¿Te imaginas ${idea} así?`,
      `${idea} puede ser muy divertido`
    ],
    loyalty: [
      `Gracias por compartir ${idea} con nosotros`,
      `Celebramos ${idea} junto a ti`,
      `${business.name} valora tu apoyo con ${idea}`,
      `${idea}: construyendo juntos el camino`,
      `${idea} es mejor cuando lo compartimos contigo`
    ],
    educate: [
      `Aprende todo sobre ${idea}`,
      `Guía completa de ${idea}`,
      `Tips profesionales para ${idea}`,
      `${idea}: conocimiento que debes tener`,
      `Lo que nadie te ha contado sobre ${idea}`
    ]
  };
  
  // Select from options for the given objective or default to inform
  const options = titles[objective as keyof typeof titles] || titles.inform;
  return options[Math.floor(Math.random() * options.length)];
};

// Generate post body and CTA based on all parameters
export const generatePostBody = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  network: string,
  title: string
): { body: string; callToAction: string } => {
  let tone = business.tone === 'professional' ? 'formal' : 
             business.tone === 'funny' ? 'divertido' : business.tone;
  
  let body = '';
  let callToAction = '';
  
  // Generate body based on objective and tone
  switch (objective) {
    case 'sell':
      if (business.tone === 'professional') {
        body = `En ${business.name} ofrecemos soluciones profesionales para ${idea}. Nuestro enfoque en calidad y excelencia nos distingue en el mercado. ${business.description}`;
      } else if (business.tone === 'funny') {
        body = `¡Hey! ¿${idea} te está volviendo loco? En ${business.name} tenemos justo lo que necesitas, ¡y sin que te desplumes! ${business.description}`;
      } else if (business.tone === 'elegant') {
        body = `Descubra la experiencia exclusiva de ${idea} con ${business.name}. Nuestra distinguida trayectoria garantiza resultados excepcionales. ${business.description}`;
      } else if (business.tone === 'inspiring') {
        body = `Transforma tu experiencia con ${idea}. En ${business.name} creemos que cada detalle cuenta para crear algo extraordinario. ${business.description}`;
      } else {
        body = `Te presentamos nuestra propuesta para ${idea}. En ${business.name} nos enfocamos en brindarte la mejor experiencia. ${business.description}`;
      }
      callToAction = '¡No te lo pierdas! 🛍️ Contáctanos ahora mismo.';
      break;
      
    case 'inform':
      if (business.tone === 'professional') {
        body = `Compartimos información relevante sobre ${idea}. En ${business.name} consideramos fundamental mantener a nuestra comunidad actualizada sobre las últimas tendencias y desarrollos del sector.`;
      } else if (business.tone === 'funny') {
        body = `¡Atención! Chisme fresco sobre ${idea} que NO te puedes perder. En ${business.name} sabemos todos los secretos (bueno, casi todos) y te los contamos sin filtros.`;
      } else if (business.tone === 'elegant') {
        body = `Nos complace presentarle las últimas novedades sobre ${idea}. ${business.name} se enorgullece de compartir información selecta y relevante para nuestro distinguido público.`;
      } else if (business.tone === 'inspiring') {
        body = `Descubre cómo ${idea} está transformando vidas. En ${business.name} creemos en el poder de la información para inspirar cambios positivos y significativos.`;
      } else {
        body = `Queremos compartirte información importante sobre ${idea}. En ${business.name} creemos que mantener a nuestra comunidad informada es esencial.`;
      }
      callToAction = '¿Qué opinas sobre esto? Déjanos tu comentario 👇';
      break;
      
    case 'entertain':
      if (business.tone === 'professional') {
        body = `Presentamos un enfoque refrescante sobre ${idea}. En ${business.name}, además de nuestra profesionalidad, sabemos apreciar los momentos ligeros que ${idea} puede ofrecer.`;
      } else if (business.tone === 'funny') {
        body = `¡Prepárate para reír con esta historia sobre ${idea}! En ${business.name} no solo somos expertos, también somos tremendamente divertidos (bueno, eso creemos nosotros 😅).`;
      } else if (business.tone === 'elegant') {
        body = `Le invitamos a disfrutar de un momento ameno en torno a ${idea}. ${business.name} combina sofisticación con experiencias memorables que cautivan los sentidos.`;
      } else if (business.tone === 'inspiring') {
        body = `Descubre el lado más fascinante de ${idea}. En ${business.name} celebramos cada historia inspiradora que nos conecta con nuestra pasión y propósito.`;
      } else {
        body = `En ${business.name} también nos gusta divertirnos. ${idea} puede ser una experiencia increíble cuando lo compartes con los mejores.`;
      }
      callToAction = '¡Etiqueta a alguien con quien disfrutarías esto! 👯‍♂️';
      break;
      
    case 'loyalty':
      if (business.tone === 'professional') {
        body = `Agradecemos su continua confianza en relación a ${idea}. En ${business.name} valoramos profundamente cada oportunidad de servirle y construir una relación duradera.`;
      } else if (business.tone === 'funny') {
        body = `¡Eres tan especial que mereces un monumento! Gracias por elegir ${business.name} para tu ${idea}. Y no, no es porque seamos los únicos (aunque casi 😜).`;
      } else if (business.tone === 'elegant') {
        body = `Expresamos nuestro más sincero agradecimiento por su preferencia en ${idea}. ${business.name} se honra con su distinguida lealtad y confianza depositada en nuestros servicios.`;
      } else if (business.tone === 'inspiring') {
        body = `Cada paso en nuestro camino con ${idea} ha sido posible gracias a ti. En ${business.name} creemos que juntos construimos historias extraordinarias que trascienden.`;
      } else {
        body = `En ${business.name} valoramos enormemente tu confianza y lealtad con ${idea}. Queremos agradecerte por ser parte de nuestra comunidad y crecer juntos día a día.`;
      }
      callToAction = '¿Cuál ha sido tu experiencia favorita con nosotros? Cuéntanos 💬';
      break;
      
    case 'educate':
      if (business.tone === 'professional') {
        body = `Compartimos conocimientos fundamentales sobre ${idea}. ${business.name} está comprometido con la excelencia educativa y el desarrollo de competencias en nuestra área de especialización.`;
      } else if (business.tone === 'funny') {
        body = `¡Aprende sobre ${idea} sin quedarte dormido en el intento! En ${business.name} hacemos que el conocimiento sea tan adictivo como las series que ves a escondidas cuando deberías estar trabajando.`;
      } else if (business.tone === 'elegant') {
        body = `Le presentamos una cuidadosa selección de conocimientos sobre ${idea}. ${business.name} cultiva la sabiduría y refinamiento en cada aspecto de nuestra especialidad.`;
      } else if (business.tone === 'inspiring') {
        body = `El conocimiento sobre ${idea} puede transformar tu perspectiva. En ${business.name} creemos que el aprendizaje es el camino hacia un futuro lleno de posibilidades infinitas.`;
      } else {
        body = `Hoy queremos compartir nuestro conocimiento sobre ${idea}. ${business.description.split('.')[0]}.`;
      }
      callToAction = '¿Te resultó útil esta información? Guárdala para consultarla después 📌';
      break;
      
    default:
      body = `${idea} es importante para nosotros en ${business.name}. ${business.description}`;
      callToAction = '¡Contáctanos para más información!';
  }
  
  // Adapt length based on network
  if (network === 'instagram' || network === 'tiktok') {
    // Keep it shorter for visual platforms
    body = body.split('.').slice(0, 2).join('.') + '.';
  } else if (network === 'whatsapp') {
    // Can be longer for messaging platforms
    body += ` ${business.slogan || ''}`;
  } else if (network === 'email') {
    // Add formal greeting for email
    body = `Estimado/a cliente,\n\n${body}\n\n${business.slogan || ''}`;
  }
  
  return { body, callToAction };
};

// Helper function to randomly select an AI text provider (for simulation)
const getRandomProvider = (): string => {
  const providers = ['ChatGPT', 'Gemini', 'DeepSeek', 'Microsoft Copilot'];
  return providers[Math.floor(Math.random() * providers.length)];
};

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
