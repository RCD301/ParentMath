/**
 * Image Processing Utilities
 * Handles image compression and base64 conversion for API submission
 */

/**
 * Compresses an image file to reduce size while maintaining readability
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1024)
 * @param {number} maxHeight - Maximum height in pixels (default: 1024)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Base64 encoded image string
 */
export const compressImage = async (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', quality);

        // Remove data URL prefix to get just the base64 string
        const base64Data = base64.split(',')[1];

        resolve(base64Data);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is a valid image
 * @param {File} file - The file to validate
 * @returns {boolean} True if file is a valid image
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return file && validTypes.includes(file.type);
};

/**
 * Gets the media type from file type
 * @param {string} fileType - The file MIME type
 * @returns {string} Media type for API (image/jpeg, image/png, etc.)
 */
export const getMediaType = (fileType) => {
  const typeMap = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/webp': 'image/webp'
  };

  return typeMap[fileType] || 'image/jpeg';
};
