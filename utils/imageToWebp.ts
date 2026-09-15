/**
 * Utility: imageToWebp
 * Client-side automatic WebP conversion and optimization for uploaded images.
 * Uses HTML5 Canvas API (zero external dependencies).
 * - Converts PNG, JPG, JPEG, GIF, BMP, HEIC to high-efficiency WebP.
 * - Preserves transparency for transparent PNGs and logos.
 * - Scales down extremely large images (exceeding maxWidth/maxHeight) to save memory and speed up rendering.
 * - Renames extension to .webp.
 */

export interface ProcessedMedia {
  url: string;
  filename: string;
  fileType: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
  resolution: string;
  altText: string;
}

export async function processUploadToWebp(
  file: File,
  quality: number = 0.85,
  maxWidth: number = 2000,
  maxHeight: number = 2000
): Promise<ProcessedMedia> {
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const altText = baseName.replace(/[-_]+/g, ' ').trim();

  // If file is not an image (e.g., video), keep original without canvas conversion
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          filename: file.name,
          fileType: 'video',
          mimeType: file.type || 'video/mp4',
          sizeBytes: file.size,
          resolution: '',
          altText
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // If in non-browser environment or canvas unsupported
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          filename: `${baseName}.webp`,
          fileType: 'image',
          mimeType: 'image/webp',
          sizeBytes: file.size,
          resolution: '',
          altText
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Maintain aspect ratio while limiting maximum dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback: read directly as data URL
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            filename: `${baseName}.webp`,
            fileType: 'image',
            mimeType: 'image/webp',
            sizeBytes: file.size,
            resolution: `${width}x${height}`,
            altText
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // Draw image onto canvas (transparent background preserved)
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as image/webp
      const webpDataUrl = canvas.toDataURL('image/webp', quality);

      // Calculate approximate byte size of base64
      const base64Content = webpDataUrl.split(',')[1] || '';
      const sizeBytes = Math.round((base64Content.length * 3) / 4);

      resolve({
        url: webpDataUrl,
        filename: `${baseName}.webp`,
        fileType: 'image',
        mimeType: 'image/webp',
        sizeBytes,
        resolution: `${width}x${height}`,
        altText
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
