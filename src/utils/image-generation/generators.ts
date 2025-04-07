
import { BusinessProfile } from '@/components/BusinessProfileForm';
import { ImageGenerationParams, GeneratedImage } from './types';
import { createCanvaTemplateUrl, createPlaceholderImage, createAbsoluteFallbackImage, enhancePromptForProvider } from './fallback';

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
  for (let i = 0; i < Math.min(maxAttempts, providers.length); i++) {
    try {
      const currentProvider = providers[i];
      console.log(`Attempt ${i + 1}: Trying with ${currentProvider}`);
      
      const result = await generateImage({...params, prompt: enhancePromptForProvider(params.prompt, currentProvider)}, currentProvider);
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
  if (maxAttempts > providers.length) {
    try {
      console.log('Attempt 3: Generating placeholder image with business branding');
      
      // Create a placeholder image with business colors and embedded text
      const placeholderImage = createPlaceholderImage(
        params.colorPalette, 
        params.includedText || params.prompt, 
        params.networkFormat,
        params.businessName
      );
      
      return {
        url: placeholderImage,
        prompt: params.prompt,
        provider: 'placeholder',
        usedFallback: true,
        fallbackLevel: 3,
        requiresEditing: true
      };
    } catch (error) {
      console.error('Placeholder image generation failed:', error);
      lastError = error;
    }
  }
  
  // Attempt 4: Last resort - provide a Canva template link
  console.log('Attempt 4: Providing Canva template as ultimate fallback');
  const canvaTemplate = createCanvaTemplateUrl(params);
  
  // Generate an absolute fallback image that always works
  const fallbackImageUrl = createAbsoluteFallbackImage(
    params.colorPalette, 
    params.includedText || 'Editar esta imagen', 
    params.networkFormat,
    params.businessName
  );
  
  return {
    url: fallbackImageUrl,
    prompt: params.prompt,
    provider: 'canva-fallback',
    usedFallback: true,
    fallbackLevel: 4,
    requiresEditing: true
  };
};

// Helper function to randomly select an AI image provider (for simulation)
export const getRandomProvider = (): string => {
  const providers = ['DALL·E', 'Stable Diffusion', 'Midjourney', 'DeepSeek Vision'];
  return providers[Math.floor(Math.random() * providers.length)];
};
