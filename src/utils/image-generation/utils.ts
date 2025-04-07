
// Utility function to create a Canva edit URL from an image URL
export const createCanvaEditUrl = (imageUrl: string, businessName: string): string => {
  const encodedImage = encodeURIComponent(imageUrl);
  const encodedBusiness = encodeURIComponent(businessName);
  
  return `https://www.canva.com/design/new?template=true&imageUrl=${encodedImage}&businessName=${encodedBusiness}`;
};

// Handle file uploads for business logos and convert to data URL
export const handleLogoUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.'));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Solo se permiten archivos de imagen.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Error al leer el archivo.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo.'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Validate image dimensions
export const validateImageDimensions = (
  dataUrl: string, 
  minWidth = 100,
  minHeight = 100
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = dataUrl;
  });
};
