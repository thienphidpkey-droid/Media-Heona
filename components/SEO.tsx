
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

// Thay thế bằng domain thật khi public web, ví dụ: https://heonamedia.com
const DOMAIN = 'https://heonamedia.com'; 

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://i.postimg.cc/nck9qgG5/481456887-122109905270769501-305987371640573178-n.jpg', 
  url = '', 
  type = 'website',
  keywords = 'Tổ chức sự kiện, Event Agency, Media Production, Livestream, Quay phim sự kiện, Xây dựng thương hiệu cá nhân, TP.HCM, Cho thuê âm thanh ánh sáng'
}) => {
  const fullUrl = url ? `${DOMAIN}${url}` : DOMAIN;
  const fullTitle = `${title} | HEONA MEDIA`;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update meta tags safely
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Update Meta Tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'HEONA MEDIA');
    updateMeta('geo.region', 'VN-SG');
    updateMeta('geo.placename', 'Ho Chi Minh City');
    updateMeta('geo.position', '10.8372;106.6625');
    updateMeta('ICBM', '10.8372, 106.6625');
    
    updateLink('canonical', fullUrl);

    // Open Graph
    updateProperty('og:type', type);
    updateProperty('og:url', fullUrl);
    updateProperty('og:title', fullTitle);
    updateProperty('og:description', description);
    updateProperty('og:image', image);
    updateProperty('og:site_name', "HEONA MEDIA");
    updateProperty('og:locale', "vi_VN");

    // Twitter
    updateMeta('twitter:card', "summary_large_image");
    updateMeta('twitter:url', fullUrl);
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "HEONA MEDIA",
      "alternateName": "Heona Media - Tổ chức sự kiện & Media Production",
      "image": image,
      "description": description,
      "telephone": "0931 899 427",
      "email": "heonamedia@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "45/30 đường số 1, Phường Thống Tây Hội",
        "addressLocality": "Gò Vấp",
        "addressRegion": "TP. Hồ Chí Minh",
        "addressCountry": "VN",
        "postalCode": "700000"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 10.8372, 
        "longitude": 106.6625 
      },
      "url": DOMAIN,
      "priceRange": "$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.facebook.com/heonamedia",
        "https://www.youtube.com/channel/UCLFMZ9rc2YEmVKQoyoxiSXg",
        "https://zalo.me/0931899427"
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [fullTitle, description, image, fullUrl, type, keywords]);

  return null;
};
