
import React, { createContext, useContext } from 'react';
import { ContentState, Project, Service, ContactInfo, Testimonial } from '../types';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Xây dựng thương hiệu cá nhân Facebook",
    description: "Xây dựng tuyến chủ đề bài viết chân thật, gần gũi. Định vị chuyên gia.",
    image: "/images/project-1.webp",
    category: "Branding"
  },
  {
    id: 2,
    title: "Workshop AI FOR TRAINER",
    description: "Heona đảm nhận toàn bộ khâu tổ chức từ thiết kế nhận diện, setup không gian đến vận hành.",
    image: "/images/project-2.webp",
    category: "Event"
  },
  {
    id: 3,
    title: "Xây dựng thương hiệu trên TIKTOK – “Tĩnh Khiêm Tarot”",
    description: "Tăng nhận diện chuyên gia Tarot, video viral cao nhất đạt triệu view.",
    image: "/images/project-3.webp",
    category: "Tiktok"
  },
  {
    id: 4,
    title: "Lễ Ra Mắt Dự Án UNIHONE",
    description: "Sự kiện đánh dấu bước ngoặt hệ sinh thái UniHome. Phụ trách trọn gói ý tưởng, concept, media.",
    image: "/images/project-4.webp",
    category: "Event"
  },
  {
    id: 5,
    title: "Xây dựng thương hiệu TRAINER THANH NGUYEN",
    description: "Hệ thống giao diện hình ảnh được làm mới hoàn toàn, chuyên nghiệp và uy tín.",
    image: "/images/project-5.webp",
    category: "Branding"
  },
  {
    id: 7,
    title: "Đêm nhạc yêu thương 4",
    description: "Chương trình thiện nguyện lan tỏa Ánh Sáng & Tình Yêu Thương.",
    image: "/images/project-7.webp",
    category: "Event"
  },
  {
    id: 8,
    title: "Lễ ra mắt sách",
    description: "Lễ ra mắt sách [Hành trình trở thành nhà đào tạo chuyên nghiệp (The journey to becoming a master trainer)]",
    image: "/images/project-8.webp",
    category: "Event"
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'A',
    tag: 'Gói A',
    title: 'Xây dựng thương hiệu cá nhân',
    features: [
      'Tư vấn định vị thương hiệu cá nhân.',
      'Xây dựng nội dung truyền thông (hình ảnh, video, bài viết).',
      'Huấn luyện kỹ năng nói, phong thái chuyên nghiệp.',
      'Triển khai kênh truyền thông cá nhân (TikTok, Facebook, YouTube).'
    ],
    image: "/images/hero-1.webp"
  },
  {
    id: 'B',
    tag: 'Gói B',
    title: 'Tổ chức sự kiện & khóa học',
    subTitle: '(workshop, seminar, đào tạo, retreat...)',
    features: [
      'Tổ chức sự kiện offline, workshop đào tạo.',
      'Hỗ trợ truyền thông sự kiện, quảng bá diễn giả.',
      'Dịch vụ tổ chức sự kiện trọn gói cho cá nhân & doanh nghiệp giáo dục / tâm linh.'
    ],
    image: "/images/hero-2.webp"
  },
  {
    id: 'C',
    tag: 'Gói C',
    title: 'Hỗ trợ truyền thông & marketing',
    features: [
      'Dịch vụ viết bài PR, content marketing.',
      'Sản xuất nội dung video, bài viết viral.',
      'Quảng cáo Facebook, TikTok chuyên nghiệp.'
    ],
    image: "/images/hero-3.webp"
  },
  {
    id: 'D',
    tag: 'Gói D',
    title: 'Giải pháp hình ảnh thương hiệu',
    features: [
      'Thiết kế thương hiệu: Logo, bộ nhận diện thương hiệu, ấn phẩm truyền thông.',
      'Chụp ảnh Profile & Beauty cho doanh nhân, chuyên gia, diễn giả.'
    ],
    image: "/images/service-d.webp"
  },
  {
    id: 'E',
    tag: 'Gói E',
    title: 'Chụp ảnh profile cá nhân',
    features: [
      'Chụp ảnh chân dung nghề nghiệp (Studio/Office).',
      'Concept: Chuyên gia, Doanh nhân, Nghệ sĩ.',
      'Hỗ trợ trang điểm, làm tóc & phối trang phục chuyên nghiệp.',
      'Chỉnh sửa hậu kỳ cao cấp, tối ưu cho đa nền tảng (FB, LinkedIn, TikTok).'
    ],
    image: "/images/service-e.webp"
  }
];

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: '0931 899 427',
  email: 'heonamedia@gmail.com',
  address: '45/30 đường số 1, Phường Thông Tây Hội, TP. HCM',
  facebook: 'https://www.facebook.com/heonamedia',
  youtube: 'https://www.youtube.com/channel/UCLFMZ9rc2YEmVKQoyoxiSXg',
  zalo: 'https://zalo.me/0931899427'
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Trainer Thanh Nguyên",
    role: "Nhà huấn luyện kỹ năng toàn diện",
    company: "",
    content: "Heona Media không chỉ là đơn vị tổ chức sự kiện mà còn là người bạn đồng hành thấu hiểu. Team đã giúp tôi xây dựng hình ảnh chuyên nghiệp nhưng vẫn giữ được sự chân thật của mình.",
    avatar: "/images/testimonial-1.webp"
  },
  {
    id: 2,
    name: "Mrs. Tĩnh Khiêm",
    role: "Tarot Reader",
    content: "Nhờ chiến lược nội dung của Heona, kênh TikTok của mình đã tăng trưởng vượt bậc. Các bạn làm việc rất có tâm, support nhiệt tình kể cả ngoài giờ hành chính.",
    avatar: "/images/testimonial-2.webp"
  },
  {
    id: 3,
    name: "Đại diện UniHome",
    role: "Ban Tổ Chức",
    content: "Sự kiện ra mắt dự án thành công rực rỡ nhờ sự chuyên nghiệp của Heona. Từ khâu ý tưởng đến thi công đều rất chỉn chu, đúng timeline và không phát sinh chi phí vô lý.",
    avatar: "/images/testimonial-3.webp"
  }
];

// Read-only context
interface ContentContextType extends ContentState { }

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: ContentContextType = {
    projects: DEFAULT_PROJECTS,
    services: DEFAULT_SERVICES,
    contactInfo: DEFAULT_CONTACT_INFO,
    testimonials: DEFAULT_TESTIMONIALS,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
