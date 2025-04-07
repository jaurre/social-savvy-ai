
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
    case 'loyalty':
      return [
        `¡Gracias por tu apoyo!`,
        `Valoramos tu fidelidad`,
        `Exclusivo para clientes`,
        `${idea} para ti`,
        `Apreciamos tu confianza`
      ][Math.floor(Math.random() * 5)];
    case 'entertain':
      return [
        `¡Diviértete con ${idea}!`,
        `¿Te imaginas ${idea}?`,
        `${idea} de forma diferente`,
        `Momento divertido`,
        `${idea} + diversión`
      ][Math.floor(Math.random() * 5)];
    default:
      return '';
  }
};
