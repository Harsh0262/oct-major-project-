const MAX_IMAGE_SIZE_BYTES = 16 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export const readMedicalImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      reject(new Error('Choose a PNG, JPEG, or WebP image. DICOM files are not decoded by this demo yet; export a slice as an image first.'));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      reject(new Error('Image is larger than 16 MB. Export a smaller image and try again.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('The image could not be read. Please choose another file.'));
      }
    };
    reader.onerror = () => reject(new Error('The image could not be read. Please choose another file.'));
    reader.readAsDataURL(file);
  });
