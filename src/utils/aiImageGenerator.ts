
import { BusinessProfile } from '@/components/BusinessProfileForm';

// Interface for image generation request parameters
export interface ImageGenerationParams {
  prompt: string;
  style: string;
  colorPalette: string[];
  aspectRatio: string;
  includedText?: string;
  networkFormat: string;
}

// Interface for image generation response
export interface GeneratedImage {
  url: string;
  prompt: string;
  provider: string;
}

// Function to simulate AI image generation 
// In a real implementation, this would connect to actual AI image APIs
export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  console.log('Generating image with params:', params);
  
  // In a real implementation, this would be replaced with actual API calls to image generation services
  // For now, we'll simulate with Unsplash images that match the prompt
  const baseUrl = 'https://source.unsplash.com/random';
  
  // Determine dimensions based on networkFormat
  let dimensions = '1200x1200';
  if (params.networkFormat === 'instagram') {
    dimensions = '1080x1350'; // Instagram post optimal ratio 4:5
  } else if (params.networkFormat === 'facebook') {
    dimensions = '1200x630'; // Facebook post optimal ratio
  } else if (params.networkFormat === 'tiktok') {
    dimensions = '1080x1920'; // TikTok vertical format
  }
  
  // Create a search query from the prompt and style
  const searchQuery = encodeURIComponent(`${params.prompt} ${params.style} ${params.includedText || ''}`);
  
  // Add random number to prevent caching
  const imageId = Math.floor(Math.random() * 1000);
  const imageUrl = `${baseUrl}/${dimensions}/?${searchQuery}&sig=${imageId}`;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    url: imageUrl,
    prompt: params.prompt,
    provider: getRandomProvider()
  };
};

// Function to attempt image generation with fallback to different providers
export const generateImageWithFallback = async (
  params: ImageGenerationParams,
  attempts: number = 3
): Promise<GeneratedImage> => {
  let lastError;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await generateImage(params);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      // Simulate switching to a different provider for next attempt
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // If all attempts fail, return a default placeholder image
  console.error('All image generation attempts failed');
  return {
    url: `https://via.placeholder.com/800x600/CCCCCC/666666?text=Image+Generation+Failed`,
    prompt: params.prompt,
    provider: 'placeholder'
  };
};

// Function to get aspect ratio based on social network
export const getAspectRatioForNetwork = (network: string): string => {
  switch (network) {
    case 'instagram':
      return '4:5'; // Instagram optimal post ratio
    case 'facebook':
      return '1.91:1'; // Facebook optimal post ratio
    case 'tiktok':
    case 'whatsapp':
      return '9:16'; // Vertical format for stories/TikTok
    default:
      return '1:1'; // Square format as default
  }
};

// Function to create image prompt based on business profile and content details
export const createImagePrompt = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  includedText?: string
): string => {
  let prompt = `${business.industry} related to ${idea}, `;
  
  switch (business.visualStyle) {
    case 'modern':
      prompt += 'modern sleek design, clean lines, ';
      break;
    case 'minimalist':
      prompt += 'minimalist design, lots of white space, simple elements, ';
      break;
    case 'colorful':
      prompt += 'vibrant colors, playful elements, dynamic composition, ';
      break;
    case 'vintage':
      prompt += 'vintage aesthetic, retro elements, aged texture, ';
      break;
    case 'bold':
      prompt += 'bold graphics, strong contrast, impactful design, ';
      break;
  }
  
  switch (objective) {
    case 'sell':
      prompt += 'promotional content, showcasing product or service, ';
      break;
    case 'inform':
      prompt += 'informative graphic, clear communication, ';
      break;
    case 'entertain':
      prompt += 'fun engaging content, entertaining visual, ';
      break;
    case 'loyalty':
      prompt += 'customer appreciation, relationship building, ';
      break;
    case 'educate':
      prompt += 'educational content, step by step visual, ';
      break;
  }
  
  if (includedText) {
    prompt += `with text overlay saying "${includedText}", `;
  }
  
  // Add business name
  prompt += `for ${business.name} brand`;
  
  return prompt;
};

// Helper function to randomly select an AI image provider (for simulation)
const getRandomProvider = (): string => {
  const providers = ['DALL·E', 'Stable Diffusion', 'Midjourney', 'DeepSeek Vision'];
  return providers[Math.floor(Math.random() * providers.length)];
};

// Helper function to determine if we should include text on the image
export const shouldIncludeTextOnImage = (objective: string): boolean => {
  // For selling and educating objectives, we'll include text overlays most of the time
  if (objective === 'sell') return Math.random() > 0.2; // 80% chance
  if (objective === 'educate') return Math.random() > 0.3; // 70% chance
  
  // For other objectives, include text less frequently
  return Math.random() > 0.6; // 40% chance
};

// Generate appropriate overlay text based on the objective and idea
export const generateOverlayText = (objective: string, idea: string): string => {
  switch (objective) {
    case 'sell':
      return [
        `¡${idea.toUpperCase()}!`,
        `OFERTA ESPECIAL: ${idea}`,
        `NUEVO: ${idea}`,
        `DESCUENTO ${Math.floor(Math.random() * 40) + 10}%`,
        `DESDE $${Math.floor(Math.random() * 900) + 100}`
      ][Math.floor(Math.random() * 5)];
    case 'educate':
      return [
        `Aprende sobre ${idea}`,
        `Guía de ${idea}`,
        `${idea}: Lo que debes saber`,
        `Tips de ${idea}`,
        `${idea} explicado`
      ][Math.floor(Math.random() * 5)];
    case 'inform':
      return [
        `¿Sabías que...?`,
        `Novedades: ${idea}`,
        `Información importante`,
        `Actualización: ${idea}`,
        `Datos sobre ${idea}`
      ][Math.floor(Math.random() * 5)];
    default:
      return '';
  }
};
