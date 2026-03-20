import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/**
 * Reusable SEO component to manage standard meta tags and page titles.
 * Updates the document head dynamically using useEffect.
 */
export default function SEO({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage 
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Seishin IA`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // 4. Update Open Graph Tags
    const updateOG = (property: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOG('og:title', ogTitle || fullTitle);
    updateOG('og:description', ogDescription || description);
    updateOG('og:image', ogImage || '/og-image.jpg');
    updateOG('og:type', 'website');

  }, [title, description, keywords, ogTitle, ogDescription, ogImage]);

  return null;
}
