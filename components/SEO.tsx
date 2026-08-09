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
  faq?: FAQItem[];
}

const DOMAIN = 'https://heonamedia.com'; 

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "HEONA MEDIA là gì và cung cấp những dịch vụ nào?",
    answer: "CÔNG TY TNHH TRUYỀN THÔNG HEONA MEDIA (thành lập 12/02/2025 tại TP.HCM) là đơn vị truyền thông thực chiến chuyên về Tổ chức sự kiện trọn gói, Xây dựng thương hiệu cá nhân (nhân hiệu), Sản xuất media (Quay phim, Livestream chuyên nghiệp) và Chụp ảnh profile cá nhân/doanh nhân."
  },
  {
    question: "HEONA MEDIA có địa chỉ ở đâu và thông tin liên hệ như thế nào?",
    answer: "HEONA MEDIA có trụ sở tại 45/30 đường số 1, Phường Thống Tây Hội (Phường 11 cũ), Quận Gò Vấp, TP. Hồ Chí Minh. Hotline/Zalo: 0931 899 427, Email: heonamedia@gmail.com, Website chính thức: https://heonamedia.com."
  },
  {
    question: "Dịch vụ Tổ chức sự kiện tại HEONA MEDIA bao gồm những loại hình nào?",
    answer: "HEONA MEDIA tổ chức sự kiện trọn gói từ kịch bản, thiết kế thi công sân khấu đến vận hành cho các loại hình: Lễ khai trương – khánh thành, Hội nghị – hội thảo – họp báo, Tiệc tất niên (Year End Party), Team Building & Tour Retreat, Activation – Roadshow, Lễ ra mắt sản phẩm mới."
  },
  {
    question: "Dịch vụ Xây dựng Thương hiệu cá nhân (Nhân hiệu) tại HEONA MEDIA gồm những gì?",
    answer: "Dịch vụ xây dựng nhân hiệu trọn gói gồm: (1) Tư vấn & định hình thông điệp phong cách cá nhân; (2) Sản xuất nội dung chuyên sâu (bài viết, video, podcast); (3) Xây kênh social (Facebook, TikTok, Group); (4) Coaching 1:1 xuất hiện tự tin & thuyết phục; (5) Chụp ảnh profile & quay series video nhân hiệu."
  },
  {
    question: "Chi phí tổ chức sự kiện tại HEONA MEDIA là bao nhiêu?",
    answer: "Giá dịch vụ tổ chức sự kiện minh bạch theo ngân sách: Gói cơ bản (sự kiện nhỏ/vừa) từ 8.000.000đ; Gói chuyên nghiệp (doanh nghiệp) từ 25.000.000đ; Gói toàn diện trọn gói từ 60.000.000đ. HEONA MEDIA cam kết báo giá chi tiết, không phát sinh chi phí ẩn."
  },
  {
    question: "HEONA MEDIA có dịch vụ chụp ảnh profile cá nhân và chân dung nghề nghiệp không?",
    answer: "Có. HEONA MEDIA cung cấp dịch vụ chụp ảnh profile cá nhân và chân dung nghề nghiệp cho Doanh nhân, Chuyên gia, Diễn giả và Nghệ sĩ. Gói dịch vụ bao gồm chụp studio/văn phòng, trang điểm làm tóc, hướng dẫn tạo dáng và hậu kỳ hình ảnh cao cấp."
  },
  {
    question: "HEONA MEDIA phục vụ tại các địa phương nào?",
    answer: "HEONA MEDIA có trụ sở chính tại TP. Hồ Chí Minh và nhận triển khai dịch vụ tổ chức sự kiện, sản xuất media tại tất cả các quận huyện TP.HCM cũng như các tỉnh thành lân cận (Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu, Long An, v.v.) và toàn quốc."
  },
  {
    question: "Slogan và giá trị cốt lõi của HEONA MEDIA là gì?",
    answer: "Slogan của HEONA MEDIA là 'Tỏa sáng theo cách riêng của bạn!'. 8 giá trị cốt lõi gồm: Chân thật – Sáng tạo – Tử tế – Tự tin – Phát triển – Phụng sự – Đồng hành – Chuyên nghiệp."
  }
];

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://i.postimg.cc/nck9qgG5/481456887-122109905270769501-305987371640573178-n.jpg', 
  url = '', 
  type = 'website',
  keywords = 'Tổ chức sự kiện, Event Agency, Media Production, Livestream, Quay phim sự kiện, Xây dựng thương hiệu cá nhân, Chụp ảnh profile cá nhân, Chụp ảnh chân dung nghề nghiệp, TP.HCM, Cho thuê âm thanh ánh sáng, Heona Media',
  faq
}) => {
  const fullUrl = url ? `${DOMAIN}${url}` : DOMAIN;
  const fullTitle = `${title} | HEONA MEDIA`;
  const activeFaqs = faq && faq.length > 0 ? faq : DEFAULT_FAQS;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${DOMAIN}/#organization`,
        "name": "HEONA MEDIA",
        "alternateName": "CÔNG TY TNHH TRUYỀN THÔNG HEONA MEDIA",
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
      {
        "@type": "FAQPage",
        "@id": `${fullUrl}/#faq`,
        "mainEntity": activeFaqs.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
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

