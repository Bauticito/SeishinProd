export type MediaType = 'image' | 'video';

export type MediaItem = {
  id: number;
  title: string;
  src: string;
  mediaType: MediaType;
  description?: string;
};

const imageModules = import.meta.glob('../../img/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
});

const videoModules = import.meta.glob('../../img/*.mp4', {
  eager: true,
  import: 'default',
});

const toTitle = (fileName: string) =>
  fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const imageItems: MediaItem[] = Object.entries(imageModules).map(([path, image], index) => {
  const rawName = path.split('/').pop() ?? `image-${index + 1}`;
  return {
    id: index + 1,
    title: toTitle(rawName),
    src: image as string,
    mediaType: 'image',
  };
});

const videoItems: MediaItem[] = Object.entries(videoModules).map(([path, video], index) => {
  const rawName = path.split('/').pop() ?? `video-${index + 1}`;
  return {
    id: imageItems.length + index + 1,
    title: toTitle(rawName),
    src: video as string,
    mediaType: 'video',
  };
});

export const localGalleryItems: MediaItem[] = [...imageItems, ...videoItems]
  .map((item, index) => ({ ...item, id: index + 1 }))
  .sort((a, b) => a.title.localeCompare(b.title, 'es'));
