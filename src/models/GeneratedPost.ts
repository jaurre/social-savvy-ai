
// Interface for a complete generated post with all details
export interface GeneratedPost {
  id: string;
  title: string;
  imageUrl: string;
  text: string;
  network: string;
  objective: string;
  hashtags: string[];
  idea?: string;
  createdAt: Date;
  imagePrompt?: string;
  imageProvider?: string;
  textProvider?: string;
  imageOverlayText?: string;
  canvaEditUrl?: string;
  usedFallback?: boolean;
  fallbackLevel?: number;
  approach?: string;
  requiresEditing?: boolean;
}

// Function to create a canva edit URL (simulated for now)
export const createCanvaEditUrl = (imageUrl: string, businessName: string): string => {
  // In a real implementation, this would create a proper Canva template URL
  // For now, we'll just create a simulated link
  const encodedImage = encodeURIComponent(imageUrl);
  const encodedBusiness = encodeURIComponent(businessName);
  
  return `https://www.canva.com/design/new?template=true&imageUrl=${encodedImage}&businessName=${encodedBusiness}`;
};

// Function to check if an image needs editing based on fallback level
export const requiresImageEditing = (post: GeneratedPost): boolean => {
  return !!post.usedFallback && (post.fallbackLevel || 0) >= 3;
};
