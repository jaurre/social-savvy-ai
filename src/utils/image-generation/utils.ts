
// Utility function to create a Canva edit URL from an image URL
export const createCanvaEditUrl = (imageUrl: string, businessName: string): string => {
  const encodedImage = encodeURIComponent(imageUrl);
  const encodedBusiness = encodeURIComponent(businessName);
  
  return `https://www.canva.com/design/new?template=true&imageUrl=${encodedImage}&businessName=${encodedBusiness}`;
};
