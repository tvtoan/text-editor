export type UploadResourceType = 'image' | 'video' | 'raw';

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  publicId?: string;
  format?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiBaseUrl?: string;
}

const DEFAULT_CONFIG: Required<CloudinaryConfig> = {
  cloudName: 'donbgiqo5',
  uploadPreset: 'text_editor',
  apiBaseUrl: 'https://api.cloudinary.com/v1_1',
};

export const uploadToCloudinary = async (
  file: File,
  options: {
    resourceType?: UploadResourceType;
    config?: Partial<CloudinaryConfig>;
    onProgress?: (percent: number) => void;
  } = {}
): Promise<UploadResult | null> => {
  const { resourceType = 'image', config = {}, onProgress } = options;
  const { cloudName, uploadPreset, apiBaseUrl } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Dùng base URL từ config → linh hoạt hơn
  const url = `${apiBaseUrl}/${cloudName}/${resourceType}/upload`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Upload thất bại');
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      name: file.name,
      size: file.size,
      publicId: data.public_id,
      format: data.format,
    };
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
};
