export type MediaType = 'image' | 'video';

export type MediaItem = {
  id: number;
  title: string;
  src: string;
  mediaType: MediaType;
  description?: string;
};

export const resolveBundledMediaSrc = (src: string) => src;

// Keep the fallback intentionally light. Production now relies on D1 + R2.
export const localGalleryItems: MediaItem[] = [];
