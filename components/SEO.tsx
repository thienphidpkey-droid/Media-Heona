import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  robots?: string;
  faq?: FAQItem[];
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  preloadImage?: string;
}

export const DOMAIN = 'https://www.heonamedia.com';

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = `${DOMAIN}/images/logo.webp`,
  url = '', 
  type = 'website',
  keywords = 'Tổ chức sự kiện, Event Agency, Media Production, Livestream, Quay phim sự kiện, Xây dựng thương hiệu cá nhân, Chụp ảnh profile cá nhân, Chụp ảnh chân dung nghề nghiệp, TP.HCM, Cho thuê âm thanh ánh sáng, Heona Media',
  robots = 'index, follow, max-image-preview:large',
  faq,
  customSchema,
  preloadImage
}) => {
  const fullUrl = url ? `${DOMAIN}${url}` : DOMAIN;
  const fullTitle = `${title} | HEONA MEDIA`;
  const fullImage = image.startsWith('http') ? image : `${DOMAIN}${image.startsWith('/') ? image : `/${image}`}`;

  const pageSpecificSchemas: Array<Record<string, unknown>> = [];

  if (url === '/services') {
    pageSpecificSchemas.push({
      "@type": "OfferCatalog",
      "@id": `${DOMAIN}/services#catalog`,
      "name": "Danh mục Dịch vụ HEONA MEDIA",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tổ chức Sự kiện Trọn gói",
            "description": "Khai trương, khánh thành, hội nghị, tiệc tất niên, team building, activation."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Xây dựng Thương hiệu Cá nhân (Nhân hiệu)",
            "description": "Tư vấn định hình thông điệp, sản xuất nội dung chuyên sâu, xây kênh TikTok/Facebook, coaching 1:1."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chụp ảnh Profile Cá nhân & Doanh nhân",
            "description": "Chụp ảnh studio/văn phòng, makeup, tạo dáng chuyên nghiệp."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sản xuất Media & Livestream",
            "description": "Quay phim sự kiện recap 4K, livestream đa góc máy chuyên nghiệp."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cho thuê Thiết bị Sân khấu & Sự kiện",
            "description": "Sân khấu, âm thanh, ánh sáng, màn hình LED P3."
          }
        }
      ]
    });
  } else if (url === '/pricing') {
    pageSpecificSchemas.push({
      "@type": "PriceSpecification",
      "@id": `${DOMAIN}/pricing#price`,
      "priceCurrency": "VND",
      "minPrice": "8000000",
      "maxPrice": "60000000",
      "description": "Báo giá dịch vụ tổ chức sự kiện và media tại HEONA MEDIA: Gói Cơ bản từ 8.000.000đ, Gói Chuyên nghiệp từ 25.000.000đ, Gói Toàn diện từ 60.000.000đ."
    });
  } else if (url === '/about') {
    pageSpecificSchemas.push({
      "@type": "AboutPage",
      "@id": `${DOMAIN}/about#webpage`,
      "name": "Về HEONA MEDIA",
      "description": description
    });
  }

  if (customSchema) {
    if (Array.isArray(customSchema)) {
      pageSpecificSchemas.push(...customSchema);
    } else {
      pageSpecificSchemas.push(customSchema);
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${DOMAIN}/#organization`,
        "name": "HEONA MEDIA",
        "alternateName": "CÔNG TY TNHH TRUYỀN THÔNG HEONA MEDIA",
        "image": `${DOMAIN}/images/logo.webp`,
        "description": "HEONA MEDIA cung cấp dịch vụ tổ chức sự kiện, sản xuất media, livestream, chụp ảnh profile và xây dựng thương hiệu cá nhân tại TP. Hồ Chí Minh.",
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
      },
      {
        "@type": "WebSite",
        "@id": `${DOMAIN}/#website`,
        "url": DOMAIN,
        "name": "HEONA MEDIA",
        "description": "Tổ chức sự kiện & Media Production chuyên nghiệp tại TP.HCM",
        "publisher": {
          "@id": `${DOMAIN}/#organization`
        },
        "inLanguage": "vi-VN"
      },
      ...(faq && faq.length > 0 ? [{
          "@type": "FAQPage",
          "@id": `${fullUrl}#faq`,
          "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }] : []),
      ...pageSpecificSchemas
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content="HEONA MEDIA" />
      <meta name="geo.region" content="VN-SG" />
      <meta name="geo.placename" content="Ho Chi Minh City" />
      <meta name="geo.position" content="10.8372;106.6625" />
      <meta name="ICBM" content="10.8372, 106.6625" />
      
      <link rel="canonical" href={fullUrl} />
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} type="image/webp" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="HEONA MEDIA" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
      </script>
    </Helmet>
  );
};
