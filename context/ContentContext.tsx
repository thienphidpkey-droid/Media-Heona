
import React, { createContext, useContext } from 'react';
import { ContentState, Project, Service, ContactInfo, Testimonial } from '../types';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Xây dựng thương hiệu cá nhân Facebook",
    description: "Xây dựng tuyến chủ đề bài viết chân thật, gần gũi. Định vị chuyên gia.",
    image: "https://i.postimg.cc/3JxhTmGp/5.jpg",
    category: "Branding"
  },
  {
    id: 2,
    title: "Workshop AI FOR TRAINER",
    description: "Heona đảm nhận toàn bộ khâu tổ chức từ thiết kế nhận diện, setup không gian đến vận hành.",
    image: "https://i.postimg.cc/7YZ4k0z5/4.jpg",
    category: "Event"
  },
  {
    id: 3,
    title: "Xây dựng thương hiệu trên TIKTOK – “Tĩnh Khiêm Tarot”",
    description: "Tăng nhận diện chuyên gia Tarot, video viral cao nhất đạt triệu view.",
    image: "https://i.postimg.cc/FsHv43Sk/1.jpg",
    category: "Tiktok"
  },
  {
    id: 4,
    title: "Lễ Ra Mắt Dự Án UNIHONE",
    description: "Sự kiện đánh dấu bước ngoặt hệ sinh thái UniHome. Phụ trách trọn gói ý tưởng, concept, media.",
    image: "https://i.postimg.cc/RVZmBKtH/6.jpg",
    category: "Event"
  },
  {
    id: 5,
    title: "Xây dựng thương hiệu TRAINER THANH NGUYEN",
    description: "Hệ thống giao diện hình ảnh được làm mới hoàn toàn, chuyên nghiệp và uy tín.",
    image: "https://i.postimg.cc/7YZ4k0zf/2.jpg",
    category: "Branding"
  },
  {
    id: 7,
    title: "Đêm nhạc yêu thương 4",
    description: "Chương trình thiện nguyện lan tỏa Ánh Sáng & Tình Yêu Thương.",
    image: "https://i.postimg.cc/qMvrTyKt/3.jpg",
    category: "Event"
  },
  {
    id: 8,
    title: "Livestream Talkshow Series",
    description: "Setup studio, ánh sáng và vận hành livestream đa điểm cầu chuyên nghiệp.",
    image: "https://i.postimg.cc/2SjNvDbM/6.jpg",
    category: "Livestream"
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
    image: "https://i.postimg.cc/hvSh7Y9d/a1.jpg"
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
    image: "https://i.postimg.cc/zvJ3RQnW/a2.jpg"
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
    image: "https://i.postimg.cc/6q9TGPdG/a3.jpg"
  },
  {
    id: 'D',
    tag: 'Gói D',
    title: 'Giải pháp hình ảnh thương hiệu',
    features: [
      'Thiết kế thương hiệu: Logo, bộ nhận diện thương hiệu, ấn phẩm truyền thông.',
      'Chụp ảnh Profile & Beauty cho doanh nhân, chuyên gia, diễn giả.'
    ],
    image: "https://i.postimg.cc/PJtN87m1/a4.webp"
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
    avatar: "https://i.postimg.cc/jdDjYvFH/z7250626038588-9609156227994e32d1287f4c993be365.jpg"
  },
  {
    id: 2,
    name: "Mrs. Tĩnh Khiêm",
    role: "Tarot Reader",
    content: "Nhờ chiến lược nội dung của Heona, kênh TikTok của mình đã tăng trưởng vượt bậc. Các bạn làm việc rất có tâm, support nhiệt tình kể cả ngoài giờ hành chính.",
    avatar: "https://i.postimg.cc/cC4r3ST4/z7250619915601-1472cd80a1fa1350a741ccdf037f80e9.jpg"
  },
  {
    id: 3,
    name: "Đại diện UniHome",
    role: "Ban Tổ Chức",
    content: "Sự kiện ra mắt dự án thành công rực rỡ nhờ sự chuyên nghiệp của Heona. Từ khâu ý tưởng đến thi công đều rất chỉn chu, đúng timeline và không phát sinh chi phí vô lý.",
    avatar: "https://i.postimg.cc/jSJCPv6b/z7250621981768-1c1edfce4e0eb14645a91f2493b25893.jpg"
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
