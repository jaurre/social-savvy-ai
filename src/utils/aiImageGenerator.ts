
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
  usedFallback?: boolean;
  fallbackLevel?: number;
}

// Function to simulate AI image generation 
// In a real implementation, this would connect to actual AI image APIs
export const generateImage = async (
  params: ImageGenerationParams, 
  provider: string = 'primary'
): Promise<GeneratedImage> => {
  console.log('Generating image with params:', params, 'using provider:', provider);
  
  // Simulate some random failures to test fallback mechanism
  const shouldFail = Math.random() < 0.2; // 20% chance of failure for testing purposes
  
  if (shouldFail && provider === 'primary') {
    throw new Error('Primary provider image generation failed');
  }
  
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
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    url: imageUrl,
    prompt: params.prompt,
    provider
  };
};

// Enhanced function to attempt image generation with multiple fallbacks
export const generateImageWithFallback = async (
  params: ImageGenerationParams,
  maxAttempts: number = 4
): Promise<GeneratedImage> => {
  console.log(`Starting image generation with up to ${maxAttempts} fallback attempts`);
  
  // Providers to try in sequence
  const providers = ['DALL·E', 'Stable Diffusion', 'Midjourney', 'DeepSeek Vision'];
  let lastError;
  
  // Attempt 1 & 2: Try with different AI providers
  for (let i = 0; i < Math.min(2, maxAttempts); i++) {
    try {
      const currentProvider = providers[i % providers.length];
      console.log(`Attempt ${i + 1}: Trying with ${currentProvider}`);
      
      const result = await generateImage(params, currentProvider);
      console.log(`Successfully generated image with ${currentProvider}`);
      
      return {
        ...result,
        usedFallback: i > 0,
        fallbackLevel: i > 0 ? i : undefined
      };
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      // Short delay before trying next provider
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  // Attempt 3: Generate a placeholder image with business colors and text
  if (maxAttempts > 2) {
    try {
      console.log('Attempt 3: Generating placeholder image with business branding');
      
      // Create a placeholder image with business colors and embedded text
      const placeholderImage = createPlaceholderImage(
        params.colorPalette, 
        params.includedText || params.prompt, 
        params.networkFormat
      );
      
      return {
        url: placeholderImage,
        prompt: params.prompt,
        provider: 'placeholder',
        usedFallback: true,
        fallbackLevel: 3
      };
    } catch (error) {
      console.error('Placeholder image generation failed:', error);
      lastError = error;
    }
  }
  
  // Attempt 4: Last resort - provide a Canva template link
  console.log('Attempt 4: Providing Canva template as ultimate fallback');
  const canvaTemplate = createCanvaTemplateUrl(params);
  
  return {
    url: `https://via.placeholder.com/800x600/CCCCCC/666666?text=Edit+In+Canva`,
    prompt: params.prompt,
    provider: 'canva-fallback',
    usedFallback: true,
    fallbackLevel: 4
  };
};

// Function to create a placeholder image with business branding
const createPlaceholderImage = (
  colorPalette: string[],
  text: string,
  networkFormat: string
): string => {
  // For simulation, we'll use a placeholder service with colors from the business palette
  // In a real implementation, this could generate a simple branded image
  
  // Extract primary and secondary colors from palette
  const primaryColor = colorPalette[0] || '#8E9196';
  const secondaryColor = colorPalette[1] || '#9b87f5';
  
  // Convert text to a suitable format for a placeholder
  const placeholderText = encodeURIComponent(text.substring(0, 30).trim() + '...');
  
  // Determine dimensions based on network format
  let width = 800;
  let height = 800;
  
  if (networkFormat === 'instagram') {
    width = 1080;
    height = 1350;
  } else if (networkFormat === 'facebook') {
    width = 1200;
    height = 630;
  } else if (networkFormat === 'tiktok') {
    width = 1080;
    height = 1920;
  }
  
  // Create a placeholder URL with the business colors
  const primaryColorHex = primaryColor.replace('#', '');
  const secondaryColorHex = secondaryColor.replace('#', '');
  
  return `https://via.placeholder.com/${width}x${height}/${primaryColorHex}/${secondaryColorHex}?text=${placeholderText}`;
};

// Function to create a Canva template URL
const createCanvaTemplateUrl = (params: ImageGenerationParams): string => {
  // In a real implementation, this would create a proper Canva template with the business branding
  // For simulation, we'll just create a URL with parameters
  
  const networkFormat = params.networkFormat;
  const style = params.style;
  const text = encodeURIComponent(params.includedText || '');
  const colorPalette = params.colorPalette.join(',').replace(/#/g, '');
  
  return `https://www.canva.com/design/create?format=${networkFormat}&style=${style}&text=${text}&colors=${colorPalette}`;
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
