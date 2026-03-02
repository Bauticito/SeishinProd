import { resolveBundledMediaSrc, type MediaItem, type MediaType } from "./localGalleryItems";

type ApiMediaItem = {
  id: number;
  title: string;
  media_type: MediaType;
  src: string;
  description: string | null;
};

type MediaListResponse = {
  items: ApiMediaItem[];
};

const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API_URL?.trim();

export const hasMediaApiConfigured = Boolean(MEDIA_API_URL);

export async function fetchMediaItems(): Promise<MediaItem[]> {
  if (!MEDIA_API_URL) {
    throw new Error("VITE_MEDIA_API_URL is not configured");
  }

  const response = await fetch(MEDIA_API_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Media API request failed (${response.status})`);
  }

  const data = (await response.json()) as MediaListResponse;
  return data.items.map((item) => ({
    id: item.id,
    title: item.title,
    src: resolveBundledMediaSrc(item.src),
    mediaType: item.media_type,
    description: item.description ?? undefined,
  }));
}
