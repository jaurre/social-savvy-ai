
// Interface for image generation request parameters
export interface ImageGenerationParams {
  prompt: string;
  style: string;
  colorPalette: string[];
  aspectRatio: string;
  includedText?: string;
  networkFormat: string;
  businessName?: string;
}

// Interface for image generation response
export interface GeneratedImage {
  url: string;
  prompt: string;
  provider: string;
  usedFallback?: boolean;
  fallbackLevel?: number;
  requiresEditing?: boolean;
}
