import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  keywords = 'Tổ chức sự kiện, Event Agency, Media Production, Livestream, Quay phim sự kiện, Xây dựng thương hiệu cá nhân, Chụp ảnh profile cá nhân, Chụp ảnh chân dung nghề nghiệp, TP.HCM, Cho thuê âm thanh ánh sáng'
}) => {
  const fullUrl = url ? `${DOMAIN}${url}` : DOMAIN;
  const fullTitle = `${title} | HEONA MEDIA`;

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

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="csp" content="upgrade-insecure-requests" />
      <meta name="author" content="HEONA MEDIA" />
      <meta name="geo.region" content="VN-SG" />
      <meta name="geo.placename" content="Ho Chi Minh City" />
      <meta name="geo.position" content="10.8372;106.6625" />
      <meta name="ICBM" content="10.8372, 106.6625" />
      
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="HEONA MEDIA" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
