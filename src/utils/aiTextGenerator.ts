
import { BusinessProfile } from '@/components/BusinessProfileForm';

// Interface for text generation request parameters
export interface TextGenerationParams {
  businessProfile: BusinessProfile;
  idea: string;
  objective: string;
  network: string;
  approach?: string;
  forceUnique?: boolean;
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
    params.idea,
    params.approach
  );
  
  // Generate post title based on objective and business profile
  const title = generatePostTitle(
    params.objective,
    params.businessProfile,
    params.idea,
    params.approach,
    params.forceUnique
  );
  
  // Generate full post body including CTA
  const { body, callToAction } = generatePostBody(
    params.businessProfile,
    params.idea,
    params.objective,
    params.network,
    title,
    params.approach,
    params.forceUnique
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

// Helper function to generate hashtags based on business profile, objective and approach
export const generateHashtags = (
  business: BusinessProfile,
  objective: string,
  idea: string,
  approach?: string
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
  
  // Add approach-specific hashtags for more variation
  let approachHashtags: string[] = [];
  if (approach) {
    switch (approach) {
      case 'urgency':
        approachHashtags = ['ultimosdías', 'nopierdasesto', 'apúrate', 'tiempolimitado', 'oportunidad'];
        break;
      case 'value':
        approachHashtags = ['valor', 'calidad', 'beneficios', 'inversión', 'ventajas'];
        break;
      case 'emotion':
        approachHashtags = ['increíble', 'asombroso', 'emocionante', 'inspirador', 'imperdible'];
        break;
      case 'unique':
        approachHashtags = ['único', 'especial', 'exclusivo', 'diferentes', 'personalizado'];
        break;
    }
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
  const allHashtags = [...baseHashtags, ...objectiveHashtags, ...approachHashtags, ...industryHashtags];
  const uniqueHashtags = [...new Set(allHashtags)]; // Remove duplicates
  
  // Shuffle and pick a subset (max 8 hashtags)
  return shuffleArray(uniqueHashtags).slice(0, 8);
};

// Generate post titles based on objective, business profile and approach
export const generatePostTitle = (
  objective: string,
  business: BusinessProfile,
  idea: string,
  approach?: string,
  forceUnique?: boolean
): string => {
  // Base titles for each objective and approach
  const titles: Record<string, Record<string, string[]>> = {
    sell: {
      urgency: [
        `¡ÚLTIMA OPORTUNIDAD para ${idea}!`,
        `¡Solo HOY: ${idea} con DESCUENTO!`,
        `¡Se acaba el tiempo para ${idea}!`,
        `¡ÚLTIMAS 24 HORAS para ${idea}!`,
        `¡No te pierdas ${idea} - TERMINA PRONTO!`
      ],
      value: [
        `${idea}: La mejor inversión para tu negocio`,
        `Descubre el valor real de ${idea}`,
        `${idea}: Calidad garantizada por ${business.name}`,
        `Beneficios exclusivos con ${idea}`,
        `${idea}: Más por menos en ${business.name}`
      ],
      emotion: [
        `¿Te imaginas disfrutar de ${idea}?`,
        `Sorpréndete con lo que ${idea} puede hacer por ti`,
        `${idea}: La experiencia que estabas esperando`,
        `Transforma tu día con ${idea}`,
        `${idea} - Sensaciones únicas garantizadas`
      ],
      unique: [
        `${idea} como NUNCA antes lo viste`,
        `La propuesta más innovadora: ${idea}`,
        `${business.name} reinventa ${idea}`,
        `${idea} exclusivo de ${business.name}`,
        `Una perspectiva diferente sobre ${idea}`
      ]
    },
    inform: {
      // ... similar structure for inform with different approaches
      urgency: [
        `¡IMPORTANTE! Lo que debes saber YA sobre ${idea}`,
        `Actualización URGENTE sobre ${idea}`,
        `Información de última hora: ${idea}`,
        `¡Atención! Novedades sobre ${idea}`,
        `Comunicado especial sobre ${idea}`
      ],
      value: [
        `Información valiosa: Todo sobre ${idea}`,
        `Datos clave que debes conocer sobre ${idea}`,
        `${idea}: Información que marca la diferencia`,
        `Contenido premium sobre ${idea}`,
        `La guía definitiva sobre ${idea}`
      ],
      emotion: [
        `Lo que nadie te cuenta sobre ${idea}`,
        `Descubre los secretos detrás de ${idea}`,
        `${idea}: La historia completa que te sorprenderá`,
        `La fascinante verdad sobre ${idea}`,
        `${idea}: Más allá de lo que conoces`
      ],
      unique: [
        `Perspectiva única: ${idea} según ${business.name}`,
        `Un enfoque diferente sobre ${idea}`,
        `${idea} explicado como nunca antes`,
        `La visión exclusiva de ${business.name} sobre ${idea}`,
        `${idea}: Análisis innovador por ${business.name}`
      ]
    },
    entertain: {
      // ... entertainment approaches
      urgency: [
        `¡No te pierdas la diversión con ${idea}!`,
        `¡Último momento para disfrutar ${idea}!`,
        `¡Rápido! ${idea} está esperándote`,
        `¡La diversión con ${idea} termina pronto!`,
        `¡Corre! ${idea} está causando sensación`
      ],
      value: [
        `${idea}: Diversión garantizada por ${business.name}`,
        `El mejor entretenimiento: ${idea}`,
        `${idea}: La experiencia de entretenimiento más completa`,
        `Máximo valor de entretenimiento con ${idea}`,
        `${idea}: Calidad de diversión asegurada`
      ],
      emotion: [
        `¡Sonríe con ${idea}!`,
        `${idea} te hará el día más feliz`,
        `Momentos inolvidables con ${idea}`,
        `¡Prepárate para reír con ${idea}!`,
        `${idea}: Emociones positivas garantizadas`
      ],
      unique: [
        `${idea} como nunca lo habías vivido`,
        `Una forma única de disfrutar ${idea}`,
        `${idea}: Entretenimiento reinventado por ${business.name}`,
        `La manera diferente de experimentar ${idea}`,
        `${idea}: Diversión con un toque especial`
      ]
    },
    loyalty: {
      // ... loyalty approaches
      urgency: [
        `¡Últimos días para aprovechar ${idea} como cliente fiel!`,
        `¡Recompensa especial por tiempo limitado: ${idea}!`,
        `¡No esperes más para disfrutar ${idea}!`,
        `¡Rápido! Beneficio exclusivo para clientes: ${idea}`,
        `¡Apresúrate! ${idea} solo para miembros leales`
      ],
      value: [
        `${idea}: Nuestro agradecimiento por tu lealtad`,
        `Valoramos tu fidelidad con ${idea}`,
        `${idea}: El beneficio que mereces por confiar en nosotros`,
        `Tu lealtad vale mucho: Disfruta de ${idea}`,
        `${business.name} premia tu confianza con ${idea}`
      ],
      emotion: [
        `Gracias por compartir el camino con ${idea}`,
        `Celebramos juntos ${idea}`,
        `${idea}: Construyendo lazos más fuertes`,
        `${idea} es mejor cuando lo compartimos contigo`,
        `Momentos especiales con ${idea} y ${business.name}`
      ],
      unique: [
        `${idea}: Exclusivo para nuestra comunidad`,
        `Un reconocimiento único por tu fidelidad: ${idea}`,
        `${idea} - Creado especialmente para ti`,
        `La experiencia personalizada de ${idea}`,
        `${idea}: Tan especial como tu relación con ${business.name}`
      ]
    },
    educate: {
      // ... education approaches
      urgency: [
        `¡No pierdas la oportunidad de aprender sobre ${idea}!`,
        `¡Última chance para dominar ${idea}!`,
        `¡Capacítate YA en ${idea}!`,
        `¡Tiempo limitado: Aprende todo sobre ${idea}!`,
        `¡Apresúrate a conocer los secretos de ${idea}!`
      ],
      value: [
        `${idea}: Conocimiento que transforma tu negocio`,
        `Aprende ${idea} y potencia tus resultados`,
        `El valor de dominar ${idea}`,
        `Inversión inteligente: Aprende sobre ${idea}`,
        `${idea}: Educación de calidad por ${business.name}`
      ],
      emotion: [
        `Descubre la fascinante materia de ${idea}`,
        `${idea}: Un viaje de aprendizaje inspirador`,
        `La aventura de dominar ${idea}`,
        `${idea}: Conocimiento que te apasionará`,
        `Enamórate del mundo de ${idea}`
      ],
      unique: [
        `${idea}: Método exclusivo de ${business.name}`,
        `Aprende ${idea} como nadie te lo había enseñado`,
        `${idea}: Enfoque revolucionario de aprendizaje`,
        `La manera diferente de entender ${idea}`,
        `${idea} explicado por ${business.name}: Perspectiva única`
      ]
    }
  };
  
  // Fall back to default approach if the specific one isn't available
  const objectiveOptions = titles[objective] || titles.inform;
  const approachToUse = approach && objectiveOptions[approach] ? approach : 'unique';
  let options = objectiveOptions[approachToUse];
  
  // If we need to force uniqueness, create a more distinctive title
  if (forceUnique) {
    const timestamp = new Date().getTime() % 1000;
    const uniqueOptions = [
      `${idea} ${timestamp}: Propuesta exclusiva`,
      `${business.name} presenta: ${idea} reimaginado`,
      `${idea} - Edición especial ${timestamp}`,
      `${business.name} transforma tu visión de ${idea}`,
      `Descubre ${idea} como nunca antes en ${business.name}`
    ];
    options = uniqueOptions;
  }
  
  return options[Math.floor(Math.random() * options.length)];
};

// Generate post body and CTA based on all parameters and approach
export const generatePostBody = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  network: string,
  title: string,
  approach?: string,
  forceUnique?: boolean
): { body: string; callToAction: string } => {
  let tone = business.tone === 'professional' ? 'formal' : 
             business.tone === 'funny' ? 'divertido' : business.tone;
  
  let body = '';
  let callToAction = '';
  
  // Add uniqueness factor if needed
  const uniquePrefix = forceUnique ? 
    `En ${business.name} tenemos una propuesta completamente distinta para ${idea}. ` : 
    '';
  
  // Generate body based on objective, tone and approach
  switch (objective) {
    case 'sell':
      if (approach === 'urgency') {
        if (business.tone === 'professional') {
          body = `${uniquePrefix}No pierda esta oportunidad limitada para ${idea}. En ${business.name} ofrecemos esta solución exclusiva solo por tiempo limitado. ${business.description}`;
        } else if (business.tone === 'funny') {
          body = `${uniquePrefix}¡Corre, vuela, teletranspórtate! ${idea} está disponible SOLO HOY en ${business.name}. ¡Más rápido que tu ex bloqueándote! ${business.description}`;
        } else if (business.tone === 'elegant') {
          body = `${uniquePrefix}Le invitamos a aprovechar esta exclusiva oportunidad para ${idea}. ${business.name} presenta esta distinguida propuesta por tiempo limitado. ${business.description}`;
        } else {
          body = `${uniquePrefix}¡Date prisa! Esta oferta especial para ${idea} termina pronto. En ${business.name} te esperamos para brindarte una experiencia única antes que sea tarde. ${business.description}`;
        }
        callToAction = '¡No esperes más! Contáctanos AHORA mismo antes que termine esta oportunidad 🔥';
      } 
      else if (approach === 'value') {
        // Value approach content
        if (business.tone === 'professional') {
          body = `${uniquePrefix}Maximice el retorno de su inversión con ${idea}. En ${business.name} nos enfocamos en brindar el mejor valor y calidad en cada solución. ${business.description}`;
        } else if (business.tone === 'funny') {
          body = `${uniquePrefix}¿Sabes qué es mejor que ${idea}? ¡${idea} con el mejor precio-calidad! En ${business.name} te damos más por tu dinero y encima te hacemos sonreír. ${business.description}`;
        } else if (business.tone === 'elegant') {
          body = `${uniquePrefix}Descubra el excepcional valor que ${idea} aportará a su experiencia. ${business.name} se distingue por ofrecer beneficios superiores en cada propuesta. ${business.description}`;
        } else {
          body = `${uniquePrefix}Obtén el máximo beneficio con ${idea}. En ${business.name} nos aseguramos que cada peso invertido valga realmente la pena. ${business.description}`;
        }
        callToAction = 'Invierte inteligentemente. Contáctanos para conocer todos los beneficios 💎';
      }
      else if (approach === 'emotion' || approach === 'unique') {
        // Emotional/unique approach
        if (business.tone === 'professional') {
          body = `${uniquePrefix}Experimente una perspectiva completamente nueva con ${idea}. ${business.name} transforma la manera en que usted percibe este servicio, creando una experiencia memorable. ${business.description}`;
        } else if (business.tone === 'funny') {
          body = `${uniquePrefix}¿Te imaginas despertar y tener ${idea} esperándote? En ${business.name} hacemos realidad esos sueños locos (bueno, este en particular). ¡Prepárate para sorprenderte! ${business.description}`;
        } else if (business.tone === 'elegant') {
          body = `${uniquePrefix}Permítase sentir la extraordinaria emoción que ${idea} puede despertar. ${business.name} crea experiencias que trascienden lo ordinario y elevan sus sentidos. ${business.description}`;
        } else {
          body = `${uniquePrefix}Descubre la emoción única que ${idea} puede traer a tu vida. En ${business.name} nos enfocamos en crear experiencias que te hagan sentir especial. ${business.description}`;
        }
        callToAction = '¿Estás listo para vivir esta experiencia? Contacta con nosotros y descúbrelo 💫';
      }
      else {
        // Default content
        if (business.tone === 'professional') {
          body = `${uniquePrefix}En ${business.name} ofrecemos soluciones profesionales para ${idea}. Nuestro enfoque en calidad y excelencia nos distingue en el mercado. ${business.description}`;
        } else if (business.tone === 'funny') {
          body = `${uniquePrefix}¡Hey! ¿${idea} te está volviendo loco? En ${business.name} tenemos justo lo que necesitas, ¡y sin que te desplumes! ${business.description}`;
        } else if (business.tone === 'elegant') {
          body = `${uniquePrefix}Descubra la experiencia exclusiva de ${idea} con ${business.name}. Nuestra distinguida trayectoria garantiza resultados excepcionales. ${business.description}`;
        } else {
          body = `${uniquePrefix}Te presentamos nuestra propuesta para ${idea}. En ${business.name} nos enfocamos en brindarte la mejor experiencia. ${business.description}`;
        }
        callToAction = '¡No te lo pierdas! 🛍️ Contáctanos ahora mismo.';
      }
      break;
      
    // ... similar pattern for other objectives (inform, entertain, loyalty, educate)
    // For brevity, I'm not including all variations, but in a real implementation, 
    // each objective would have similar approach-specific content
    
    case 'inform':
      // ... inform approach variations
      if (approach === 'urgency') {
        body = `${uniquePrefix}Información importante que debes conocer AHORA sobre ${idea}. En ${business.name} consideramos fundamental mantenerte actualizado sin demora sobre las últimas novedades en este tema.`;
        callToAction = '¡Comparte esta información urgente con quien la necesite! ⚠️';
      } else if (approach === 'value') {
        body = `${uniquePrefix}Datos valiosos sobre ${idea} que transformarán tu perspectiva. En ${business.name} seleccionamos cuidadosamente la información más relevante y útil para nuestros seguidores.`;
        callToAction = '¿Te resultó valiosa esta información? Guárdala y compártela 💎';
      } else {
        body = `${uniquePrefix}Compartimos información relevante sobre ${idea}. En ${business.name} consideramos fundamental mantener a nuestra comunidad actualizada sobre las últimas tendencias y desarrollos del sector.`;
        callToAction = '¿Qué opinas sobre esto? Déjanos tu comentario 👇';
      }
      break;
      
    case 'entertain':
      // ... entertain approach variations
      if (approach === 'emotion') {
        body = `${uniquePrefix}Prepárate para sonreír con esta historia sobre ${idea}. En ${business.name} creemos que los momentos de alegría son esenciales en nuestro día a día.`;
        callToAction = '¡Comparte esta sonrisa con alguien especial! 😊';
      } else {
        body = `${uniquePrefix}Presentamos un enfoque refrescante sobre ${idea}. En ${business.name}, además de nuestra profesionalidad, sabemos apreciar los momentos ligeros que ${idea} puede ofrecer.`;
        callToAction = '¡Etiqueta a alguien con quien disfrutarías esto! 👯‍♂️';
      }
      break;
      
    case 'loyalty':
      // ... loyalty approach variations
      if (approach === 'value') {
        body = `${uniquePrefix}Tu lealtad tiene un valor incalculable para nosotros. Por eso, en ${business.name} queremos agradecerte con ${idea}, una muestra de nuestro compromiso contigo.`;
        callToAction = 'Eres parte importante de nuestra historia. ¡Gracias por elegirnos! ❤️';
      } else {
        body = `${uniquePrefix}Agradecemos su continua confianza en relación a ${idea}. En ${business.name} valoramos profundamente cada oportunidad de servirle y construir una relación duradera.`;
        callToAction = '¿Cuál ha sido tu experiencia favorita con nosotros? Cuéntanos 💬';
      }
      break;
      
    case 'educate':
      // ... educate approach variations
      if (approach === 'unique') {
        body = `${uniquePrefix}Te presentamos una perspectiva única sobre ${idea}. En ${business.name} hemos desarrollado un método exclusivo para entender y aplicar este conocimiento de manera efectiva.`;
        callToAction = '¿Qué otros aspectos de ${idea} te gustaría aprender? Dinos en comentarios 🧠';
      } else {
        body = `${uniquePrefix}Compartimos conocimientos fundamentales sobre ${idea}. ${business.name} está comprometido con la excelencia educativa y el desarrollo de competencias en nuestra área de especialización.`;
        callToAction = '¿Te resultó útil esta información? Guárdala para consultarla después 📌';
      }
      break;
      
    default:
      body = `${uniquePrefix}${idea} es importante para nosotros en ${business.name}. ${business.description}`;
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
