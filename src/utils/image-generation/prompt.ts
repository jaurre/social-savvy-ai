
import { BusinessProfile } from '@/components/BusinessProfileForm';

// Function to create image prompt based on business profile and content details
export const createImagePrompt = (
  business: BusinessProfile,
  idea: string,
  objective: string,
  includedText?: string,
  approach?: string
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
  
  // Add approach variation for more diversity between versions
  if (approach) {
    switch (approach) {
      case 'urgency':
        prompt += 'creating sense of urgency, limited time offer, exclusive deal, ';
        break;
      case 'value':
        prompt += 'highlighting value proposition, benefits focused, quality emphasis, ';
        break;
      case 'emotion':
        prompt += 'emotionally engaging, creating curiosity, inspirational mood, ';
        break;
      case 'unique':
        prompt += 'distinctive style, unique perspective, standout design, ';
        break;
    }
  }
  
  if (includedText) {
    prompt += `with text overlay saying "${includedText}", `;
  }
  
  // Add business name and tone
  prompt += `for ${business.name} brand with ${business.tone} tone`;
  
  // Add slogan if available
  if (business.slogan) {
    prompt += `, brand slogan: "${business.slogan}"`;
  }
  
  return prompt;
};
