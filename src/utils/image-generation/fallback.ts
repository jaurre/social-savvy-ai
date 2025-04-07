
import { ImageGenerationParams } from './types';

// Enhance prompt for specific providers to improve results
export const enhancePromptForProvider = (prompt: string, provider: string): string => {
  switch (provider) {
    case 'DALL·E':
      return `${prompt}, high quality, detailed, photorealistic`;
    case 'Stable Diffusion':
      return `${prompt}, highly detailed, sharp focus, professional photography`;
    case 'Midjourney':
      return `${prompt}, vibrant colors, high resolution, trending on artstation`;
    case 'DeepSeek Vision':
      return `${prompt}, cinematic lighting, 8k resolution, conceptual design`;
    default:
      return prompt;
  }
};

// Function to create a placeholder image with business branding
export const createPlaceholderImage = (
  colorPalette: string[],
  text: string,
  networkFormat: string,
  businessName?: string
): string => {
  // For simulation, we'll use a placeholder service with colors from the business palette
  // In a real implementation, this could generate a simple branded image
  
  // Extract primary and secondary colors from palette
  const primaryColor = colorPalette[0] || '#8E9196';
  const secondaryColor = colorPalette[1] || '#9b87f5';
  
  // Convert text to a suitable format for a placeholder
  const placeholderText = encodeURIComponent(text.substring(0, 30).trim() + '...');
  
  // Add business name if available
  const brandedText = businessName 
    ? encodeURIComponent(`${businessName}: ${text.substring(0, 20).trim()}...`) 
    : placeholderText;
  
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
  
  return `https://via.placeholder.com/${width}x${height}/${primaryColorHex}/${secondaryColorHex}?text=${brandedText}`;
};

// Function to create an absolute fallback image that will never fail
export const createAbsoluteFallbackImage = (
  colorPalette: string[],
  text: string,
  networkFormat: string,
  businessName?: string
): string => {
  // We use a similar approach as createPlaceholderImage but with guaranteed values
  const primaryColor = colorPalette[0] || '8E9196';
  const secondaryColor = colorPalette[1] || '9b87f5';
  
  // Safely encode text
  const safeText = encodeURIComponent((businessName ? `${businessName}: ` : '') + 'Editar en Canva');
  
  // Get dimensions based on network
  let dimensions = '800x800';
  if (networkFormat === 'instagram') dimensions = '1080x1350';
  if (networkFormat === 'facebook') dimensions = '1200x630';
  if (networkFormat === 'tiktok') dimensions = '1080x1920';
  
  // Create a safe URL that won't break
  const primaryColorHex = primaryColor.replace('#', '');
  const secondaryColorHex = secondaryColor.replace('#', '');
  
  return `https://via.placeholder.com/${dimensions}/${primaryColorHex}/${secondaryColorHex}?text=${safeText}`;
};

// Function to create a Canva template URL
export const createCanvaTemplateUrl = (params: ImageGenerationParams): string => {
  // In a real implementation, this would create a proper Canva template with the business branding
  // For simulation, we'll just create a URL with parameters
  
  const networkFormat = params.networkFormat;
  const style = params.style;
  const text = encodeURIComponent(params.includedText || '');
  const colorPalette = params.colorPalette.join(',').replace(/#/g, '');
  const businessName = encodeURIComponent(params.businessName || '');
  
  return `https://www.canva.com/design/create?format=${networkFormat}&style=${style}&text=${text}&colors=${colorPalette}&businessName=${businessName}`;
};
