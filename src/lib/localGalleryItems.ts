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

const normalizeName = (value: string) => value.normalize('NFC');

const getFileName = (value: string) => {
  const sanitized = value.split('?')[0].split('#')[0];
  return sanitized.split('/').pop() ?? sanitized;
};

const buildMediaNameMap = () => {
  const map = new Map<string, string>();
  const addEntries = (entries: [string, unknown][]) => {
    entries.forEach(([modulePath, assetUrl]) => {
      const moduleFileName = getFileName(modulePath);
      const decodedModuleName = decodeURIComponent(moduleFileName);
      const src = assetUrl as string;

      map.set(normalizeName(moduleFileName), src);
      map.set(normalizeName(decodedModuleName), src);
    });
  };

  addEntries(Object.entries(imageModules));
  addEntries(Object.entries(videoModules));

  return map;
};

const mediaNameMap = buildMediaNameMap();

export const resolveBundledMediaSrc = (src: string) => {
  const fileName = getFileName(src);
  const decodedName = decodeURIComponent(fileName);
  return (
    mediaNameMap.get(normalizeName(fileName)) ??
    mediaNameMap.get(normalizeName(decodedName)) ??
    src
  );
};

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
