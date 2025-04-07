
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
