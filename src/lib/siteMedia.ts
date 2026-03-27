const rawMediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL?.trim();

export const MEDIA_BASE_URL = (rawMediaBaseUrl && rawMediaBaseUrl.length > 0
  ? rawMediaBaseUrl
  : "https://media.seishin.com.mx"
).replace(/\/+$/, "");

export const mediaUrl = (path: string) => `${MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;

export const SITE_MEDIA = {
  logos: {
    primary: mediaUrl("branding/seishin-SinFondo.png"),
    footer: mediaUrl("branding/seishin-logo-SinFondo-removebg-preview.png"),
    og: mediaUrl("branding/seishin-logo-SinFondo-removebg-preview.png"),
  },
  landing: {
    introVideo: mediaUrl("landing/landing-video.mp4"),
    animatedLogo: mediaUrl("landing/animated-logo.mp4"),
  },
  photos: {
    founder: mediaUrl("gallery/fnoel.jpg"),
  },
};
