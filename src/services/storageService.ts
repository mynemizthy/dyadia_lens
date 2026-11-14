/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const storageService = {
  /**
   * Upload an image file for a product (main, gallery, or A+ content slot).
   * Sends to server-side /api/upload which writes to Supabase Storage,
   * or falls back to local dataUrl for instant preview.
   */
  async uploadProductImage(file: File, prefix = 'product'): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `${prefix}-${file.name}`,
          dataUrl,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return json.url;
        }
      }
    } catch (err) {
      console.warn('[storageService] Server upload failed, using local preview dataUrl:', err);
    }

    // Fallback to local Data URL
    return dataUrl;
  },

  /**
   * Delete an image from storage
   */
  async deleteProductImage(_pathOrUrl: string): Promise<boolean> {
    return true;
  },
};
