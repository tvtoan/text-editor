export const getOptimizedImageUrl = (originalUrl: string): string => {
  if (!originalUrl?.includes('res.cloudinary.com')) return originalUrl;

  return originalUrl.replace('/upload/', '/upload/q_auto:eco,f_auto,w_auto,dpr_auto,c_limit/');
};

export const getOptimizedVideoUrl = (originalUrl: string): string => {
  if (!originalUrl?.includes('res.cloudinary.com')) return originalUrl;

  return originalUrl.replace(
    '/upload/',
    '/upload/f_auto,q_auto:eco,vc_auto,du_30/' // du_30 = max 30s (tùy chỉnh nếu cần)
  );
};

export const getVideoPosterUrl = (videoUrl: string): string => {
  if (!videoUrl?.includes('res.cloudinary.com')) return '';

  return videoUrl
    .replace('/upload/', '/upload/w_800,h_450,c_fill,g_center,q_auto:good,so_0/')
    .replace(/\.(mp4|webm|ogg|mov|avi)$/i, '.jpg');
};

export const getVideoThumbnailUrl = (videoUrl: string): string => {
  if (!videoUrl?.includes('res.cloudinary.com')) return '';

  return videoUrl
    .replace('/upload/', '/upload/w_400,h_225,c_fill,g_center,q_auto:good,so_0/')
    .replace(/\.(mp4|webm|ogg|mov|avi)$/i, '.jpg');
};
