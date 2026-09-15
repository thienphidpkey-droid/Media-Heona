import { Article, CMSUser, Client, MediaItem, Project, Service, Lead, ActivityLog, NotificationItem } from '../../types';

export const SEED_USERS: CMSUser[] = [
  {
    id: 'u-admin-1',
    name: 'Nguyễn Heona (Founder)',
    email: 'admin@heonamedia.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-09-15 08:45',
    createdAt: '2025-01-01'
  },
  {
    id: 'u-editor-1',
    name: 'Trần Minh (Content Lead)',
    email: 'editor@heonamedia.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'editor',
    status: 'active',
    lastLogin: '2026-09-14 17:30',
    createdAt: '2025-02-15'
  },
  {
    id: 'u-contrib-1',
    name: 'Lê Thảo (Content Creator)',
    email: 'contributor@heonamedia.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'contributor',
    status: 'active',
    lastLogin: '2026-09-15 09:10',
    createdAt: '2025-03-01'
  }
];

export const SEED_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Trainer Thanh Nguyên',
    logo: '/images/testimonial-1.webp',
    industry: 'Đào tạo & Kỹ năng',
    website: 'https://thanhnguyen.edu.vn',
    contactPerson: 'Thanh Nguyên',
    phone: '0908 123 456',
    email: 'contact@thanhnguyen.vn',
    facebook: 'https://facebook.com/trainer.thanhnguyen',
    notes: 'Khách hàng VIP mảng cá nhân - Gói Expert Spotlight 12 tháng.',
    projectCount: 2,
    status: 'active',
    createdAt: '2025-01-10'
  },
  {
    id: 'cli-2',
    name: 'Tĩnh Khiêm Tarot',
    logo: '/images/testimonial-2.webp',
    industry: 'Tâm lý & Chữa lành',
    website: 'https://tinhkhiem.com',
    contactPerson: 'Mrs. Tĩnh Khiêm',
    phone: '0912 345 678',
    email: 'tinhkhiem@gmail.com',
    tiktok: 'https://tiktok.com/@tinhkhiem',
    notes: 'Kênh TikTok đạt hơn 500K followers sau 6 tháng hợp tác.',
    projectCount: 1,
    status: 'active',
    createdAt: '2025-02-05'
  },
  {
    id: 'cli-3',
    name: 'Tập đoàn Giáo dục UniHome',
    logo: '/images/testimonial-3.webp',
    industry: 'Bất động sản & Giáo dục cộng đồng',
    website: 'https://unihome.vn',
    contactPerson: 'Nguyễn Hải Nam',
    phone: '0988 777 999',
    email: 'pr@unihome.vn',
    notes: 'Hợp đồng tổ chức chuỗi sự kiện ra mắt và truyền thông thương hiệu.',
    projectCount: 1,
    status: 'active',
    createdAt: '2025-03-12'
  },
  {
    id: 'cli-4',
    name: 'Hệ thống Trường Song Ngữ Alpha',
    logo: '/images/logo.webp',
    industry: 'Trường học K-12',
    website: 'https://alphaschool.edu.vn',
    contactPerson: 'Cô Minh Hà',
    phone: '0977 654 321',
    email: 'tuyensinh@alphaschool.edu.vn',
    notes: 'Chiến dịch tuyển sinh School Story niên khóa 2026-2027.',
    projectCount: 1,
    status: 'active',
    createdAt: '2025-04-01'
  }
];

export const SEED_ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'checklist-to-chuc-su-kien',
    title: 'Checklist tổ chức sự kiện cơ bản cho trường học & trung tâm',
    shortDesc: 'Các hạng mục căn bản để sự kiện giáo dục vận hành trơn tru và ghi lại tư liệu truyền thông đắt giá.',
    thumbnail: '/images/hero-2.webp',
    category: 'Event to Content',
    tags: ['Checklist', 'Sự kiện giáo dục', 'Tổ chức workshop'],
    author: 'Nguyễn Heona (Founder)',
    authorId: 'u-admin-1',
    status: 'published',
    views: 0,
    publishedAt: '2025-02-10',
    createdAt: '2025-02-08',
    updatedAt: '2025-02-10',
    seo: {
      title: 'Checklist tổ chức sự kiện giáo dục chi tiết - Heona Media',
      metaDescription: 'Khám phá quy trình chuẩn bị sự kiện từ Pre-event, In-event đến Post-event giúp tối ưu chi phí và bùng nổ truyền thông.',
      focusKeyword: 'tổ chức sự kiện giáo dục',
      robotsIndex: true,
      robotsFollow: true
    },
    ctaBlock: {
      enabled: true,
      title: 'Bạn muốn biến sự kiện thành tài sản truyền thông lâu dài?',
      description: 'Heona Media đồng hành cùng trường học và trung tâm giáo dục trọn gói từ khâu ý tưởng, ghi hình đến sản xuất nội dung viral sau sự kiện.',
      buttonText: 'TƯ VẤN CÙNG HEONA',
      buttonUrl: '/contact'
    },
    content: `
      <h2 class="text-xl font-bold mb-3">1. Giai đoạn trước sự kiện (Pre-event)</h2>
      <p class="mb-4 text-base text-gray-700">Đây là giai đoạn quan trọng nhất quyết định 80% thành công của sự kiện. Đơn vị giáo dục cần chuẩn bị:</p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-gray-700">
        <li><strong>Mục tiêu & Ý tưởng:</strong> Xác định rõ thông điệp giáo dục, phong thái diễn giả và Key Visual chủ đạo.</li>
        <li><strong>Địa điểm & Thời gian:</strong> Khảo sát địa điểm (sức chứa, ánh sáng cho quay phim, đường điện âm thanh).</li>
        <li><strong>Kịch bản ghi hình (Media cue list):</strong> Phân công góc máy bắt trọn cảm xúc học viên và khoảnh khắc ấn tượng của diễn giả.</li>
      </ul>

      <h2 class="text-xl font-bold mb-3">2. Trong sự kiện (In-event)</h2>
      <p class="mb-4 text-base text-gray-700">Sự phối hợp nhịp nhàng giữa ekip sân khấu và media:</p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-gray-700">
        <li><strong>Tổng duyệt (Rehearsal):</strong> Kiểm tra micro, slide và máy quay ít nhất 2 tiếng trước giờ G.</li>
        <li><strong>Bắt khoảnh khắc:</strong> Chụp ảnh profile diễn giả, biểu cảm lắng nghe của học sinh/phụ huynh.</li>
      </ul>

      <h2 class="text-xl font-bold mb-3">3. Sau sự kiện (Post-event)</h2>
      <p class="text-base text-gray-700">Gửi thư cảm ơn, phát hành video recap highlight, biến 1 buổi workshop thành 20 clip ngắn đa nền tảng.</p>
    `
  },
  {
    id: 2,
    slug: 'chi-phi-to-chuc-hoi-nghi',
    title: 'Chi phí tổ chức hội nghị giáo dục & ra mắt khóa học gồm những gì?',
    shortDesc: 'Phân bổ ngân sách minh bạch, tránh lãng phí khi xây dựng sự kiện học thuật.',
    thumbnail: '/images/hero-3.webp',
    category: 'Event to Content',
    tags: ['Chi phí', 'Ngân sách sự kiện', 'Hội nghị'],
    author: 'Trần Minh (Content Lead)',
    authorId: 'u-editor-1',
    status: 'published',
    views: 0,
    publishedAt: '2025-02-12',
    createdAt: '2025-02-11',
    updatedAt: '2025-02-12',
    seo: {
      title: 'Dự toán chi phí tổ chức sự kiện đào tạo - Heona Media',
      metaDescription: 'Cách tính toán ngân sách địa điểm, trang thiết bị âm thanh ánh sáng và sản xuất truyền thông cho hội thảo.',
      focusKeyword: 'chi phí tổ chức hội nghị',
      robotsIndex: true,
      robotsFollow: true
    },
    ctaBlock: {
      enabled: true,
      title: 'Tối ưu ngân sách truyền thông sự kiện giáo dục',
      description: 'Nhận bảng dự toán chi tiết và giải pháp sản xuất nội dung tinh gọn từ Heona Media.',
      buttonText: 'NHẬN BÁO GIÁ NGAY',
      buttonUrl: '/contact'
    },
    content: `
      <p class="mb-4 text-gray-700">Để tránh phát sinh chi phí, ngân sách cần chia thành 4 nhóm rõ ràng:</p>
      <h3 class="text-lg font-bold mt-4 mb-2">1. Chi phí địa điểm & Teabreak (35%)</h3>
      <p class="mb-4 text-gray-700">Phòng hội nghị tiêu chuẩn, tiệc trà giữa giờ tạo không gian kết nối học viên.</p>
      <h3 class="text-lg font-bold mt-4 mb-2">2. Trang thiết bị & Âm thanh ánh sáng (30%)</h3>
      <p class="mb-4 text-gray-700">Màn hình LED P3 hiển thị slide rõ ràng, micro không dây chất lượng cao chống hú.</p>
      <h3 class="text-lg font-bold mt-4 mb-2">3. Sản xuất nội dung & Media (25%)</h3>
      <p class="mb-4 text-gray-700">Ekip quay chụp bắt khoảnh khắc, dựng clip recap và đóng gói tài liệu khóa học.</p>
      <h3 class="text-lg font-bold mt-4 mb-2">4. Dự phòng phát sinh (10%)</h3>
    `
  },
  {
    id: 3,
    slug: 'xay-dung-thuong-hieu-giang-vien-tiktok',
    title: 'Chiến lược xây dựng thương hiệu cá nhân TikTok cho Giảng viên & Trainer',
    shortDesc: 'Cách biến kiến thức chuyên môn thành chuỗi video ngắn triệu view mà vẫn giữ được sự chỉn chu, uy tín.',
    thumbnail: '/images/hero-1.webp',
    category: 'Expert Spotlight',
    tags: ['Expert Spotlight', 'TikTok', 'Thương hiệu cá nhân'],
    author: 'Nguyễn Heona (Founder)',
    authorId: 'u-admin-1',
    status: 'published',
    views: 0,
    publishedAt: '2025-02-16',
    createdAt: '2025-02-14',
    updatedAt: '2025-02-16',
    seo: {
      title: 'Xây dựng thương hiệu TikTok cho Giảng viên & Chuyên gia',
      metaDescription: 'Hướng dẫn lộ trình xây kênh TikTok chuyên gia giáo dục từ xây dựng trụ cột nội dung đến phong thái trước ống kính.',
      focusKeyword: 'thương hiệu cá nhân tiktok chuyên gia',
      robotsIndex: true,
      robotsFollow: true
    },
    ctaBlock: {
      enabled: true,
      title: 'Bạn là chuyên gia đang tìm kiếm giải pháp phát triển kênh video ngắn?',
      description: 'Chương trình Expert Spotlight của Heona Media giúp bạn định vị hình tượng, lên kịch bản, quay dựng và vận hành kênh chuyên nghiệp.',
      buttonText: 'TƯ VẤN SPOTLIGHT CÙNG HEONA',
      buttonUrl: '/contact'
    },
    content: `
      <p class="mb-4 text-gray-700">Nhiều giảng viên e ngại TikTok là nền tảng nhí nhố. Thực tế, phân khúc giáo dục (Edutok) đang là mảng có tỉ lệ chuyển đổi học viên cao nhất.</p>
      <h3 class="text-lg font-bold mt-4 mb-2">3 Nguyên tắc cốt lõi:</h3>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>3 giây đầu tiên (Hook):</strong> Đặt ra câu hỏi nhức nhối hoặc một sai lầm phổ biến của người học.</li>
        <li><strong>Một video - Một bài học:</strong> Không tham lam nhồi nhét, giải quyết trọn vẹn 1 ý tưởng trong 45-60 giây.</li>
        <li><strong>Phong thái chân thực:</strong> Chuyên môn vững vàng kết hợp giọng nói ấm áp, gần gũi.</li>
      </ul>
    `
  },
  {
    id: 4,
    slug: 'quy-trinh-san-xuat-video-school-story',
    title: 'School Story: Cách kể câu chuyện trường học chạm đến trái tim phụ huynh',
    shortDesc: 'Phương pháp truyền thông nhân văn giúp trường học khẳng định triết lý giáo dục mà không nặng tính quảng cáo.',
    thumbnail: '/images/service-d.webp',
    category: 'School Story',
    tags: ['School Story', 'Tuyển sinh', 'Truyền thông trường học'],
    author: 'Lê Thảo (Content Creator)',
    authorId: 'u-contrib-1',
    status: 'review',
    views: 0,
    createdAt: '2026-09-10',
    updatedAt: '2026-09-14',
    seo: {
      title: 'School Story: Chiến lược truyền thông cảm xúc cho trường học',
      metaDescription: 'Kể chuyện thương hiệu trường học qua lăng kính học sinh, giáo viên và không gian học tập sáng tạo.',
      focusKeyword: 'truyền thông trường học',
      robotsIndex: true,
      robotsFollow: true
    },
    content: `
      <p class="mb-4 text-gray-700">Phụ huynh ngày nay không chỉ chọn trường vì cơ sở vật chất, họ chọn trường vì môi trường nhân văn và cách thầy cô đối xử với con cái họ mỗi ngày.</p>
    `
  },
  {
    id: 5,
    slug: 'bi-quyet-chup-anh-profile-doanh-nhan',
    title: 'Bí quyết chụp ảnh Profile & Chân dung chuyên gia chuẩn thần thái',
    shortDesc: 'Chuẩn bị trang phục, ánh mắt, nụ cười và concept phù hợp với ngành đào tạo của bạn.',
    thumbnail: '/images/service-e.webp',
    category: 'Expert Spotlight',
    tags: ['Profile chuyên gia', 'Chụp ảnh doanh nhân'],
    author: 'Trần Minh (Content Lead)',
    authorId: 'u-editor-1',
    status: 'draft',
    views: 0,
    createdAt: '2026-09-12',
    updatedAt: '2026-09-14',
    seo: {
      title: 'Chụp ảnh profile chuyên gia giáo dục chuyên nghiệp',
      metaDescription: 'Hướng dẫn tạo dáng và chọn phong cách ảnh chân dung chuyên nghiệp cho nhà đào tạo.',
      focusKeyword: 'chụp ảnh profile chuyên gia'
    },
    content: `
      <p class="mb-4 text-gray-700">Một bức ảnh profile chất lượng cao trên website và mạng xã hội là lời giới thiệu uy tín đầu tiên gửi tới đối tác và học viên.</p>
    `
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Xây dựng thương hiệu cá nhân Facebook — Trainer Thanh Nguyên',
    slug: 'xay-dung-thuong-hieu-trainer-thanh-nguyen',
    category: 'Expert Spotlight',
    clientId: 'cli-1',
    clientName: 'Trainer Thanh Nguyên',
    industry: 'Đào tạo kỹ năng toàn diện',
    services: ['Personal Branding', 'Content Strategy', 'Photography', 'Facebook'],
    description: 'Xây dựng tuyến chủ đề bài viết chân thật, gần gũi. Định vị chuyên gia đào tạo kỹ năng uy tín hàng đầu.',
    image: '/images/project-1.webp',
    coverImage: '/images/project-1.webp' as any,
    status: 'published',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    projectIntro: 'Trainer Thanh Nguyên là nhà huấn luyện kỹ năng với hơn 10 năm kinh nghiệm nhưng chưa có một hệ thống nhận diện số đồng bộ và nhất quán.',
    clientBackground: 'Trước khi hợp tác với Heona Media, trang cá nhân của chuyên gia còn tản mác nội dung, chưa toát lên vị thế của một master trainer.',
    challenge: 'Làm sao để truyền tải kiến thức hàn lâm thành các câu chuyện đời thường, ấm áp nhưng vẫn thể hiện chiều sâu học thuật.',
    projectGoals: 'Chuẩn hóa hình ảnh cá nhân, xây dựng 30 bài viết pillar content cốt lõi và tăng trưởng lượng theo dõi tự nhiên từ đối tượng học viên mục tiêu.',
    solutionSummary: 'Heona Media đã lên khung chiến lược Brand Archetype (The Sage & The Caregiver), tổ chức 2 buổi chụp profile cao cấp và trực tiếp đồng hành chấp bút các bài viết chuyên môn.',
    processSteps: [
      { id: 'p1-1', stepNumber: '01', title: 'Nghiên cứu & Định vị', description: 'Phỏng vấn sâu, xác định 5 thế mạnh cốt lõi và phong cách ngôn từ đặc trưng.' },
      { id: 'p1-2', stepNumber: '02', title: 'Tái thiết kế nhận diện', description: 'Chụp bộ ảnh Profile chuẩn thần thái và thiết kế hệ thống template bài đăng.' },
      { id: 'p1-3', stepNumber: '03', title: 'Sản xuất Content Pillar', description: 'Triển khai lịch bài viết 4 bài/tuần xen kẽ chia sẻ tri thức và câu chuyện đời thường.' },
      { id: 'p1-4', stepNumber: '04', title: 'Tối ưu & Chuyển đổi', description: 'Đo lường tương tác và chuyển đổi học viên vào các khóa học chuyên sâu.' }
    ],
    results: [
      { id: 'r1-1', number: '150K+', label: 'Tương tác thảo luận' },
      { id: 'r1-2', number: '300%', label: 'Tăng trưởng học viên đăng ký' },
      { id: 'r1-3', number: '48+', label: 'Bài viết chuyên môn xuất bản' }
    ],
    qualitativeResults: [
      'Định hình rõ nét phong thái chuyên gia đào tạo truyền cảm hứng.',
      'Tạo dựng cộng đồng học viên tin cậy và gắn kết lâu dài.',
      'Tự động hóa lịch trình xuất bản nội dung hàng tuần.'
    ],
    gallery: ['/images/project-1.webp', '/images/hero-1.webp', '/images/service-e.webp'],
    testimonial: {
      name: 'Trainer Thanh Nguyên',
      position: 'Nhà huấn luyện kỹ năng toàn diện',
      avatar: '/images/testimonial-1.webp',
      content: 'Heona Media không chỉ là đơn vị truyền thông mà còn là người bạn đồng hành thấu hiểu. Team đã giúp tôi xây dựng hình ảnh chuyên nghiệp nhưng vẫn giữ trọn sự chân thật của chính mình.'
    },
    seo: {
      title: 'Case Study: Xây dựng thương hiệu Trainer Thanh Nguyên - Heona Media',
      metaDescription: 'Khám phá chiến lược xây dựng thương hiệu cá nhân toàn diện cho diễn giả, giảng viên cùng Heona Media.',
      focusKeyword: 'xây dựng thương hiệu cá nhân trainer',
      robotsIndex: true,
      robotsFollow: true
    }
  },
  {
    id: 2,
    title: 'Workshop AI FOR TRAINER — Chuyển đổi công nghệ cho nhà đào tạo',
    slug: 'workshop-ai-for-trainer',
    category: 'Event to Content',
    clientId: 'cli-1',
    clientName: 'Heona & Partners',
    industry: 'Công nghệ & Giáo dục',
    services: ['Event Production', 'Event Content', 'Video Production', 'Livestream'],
    description: 'Heona đảm nhận toàn bộ khâu tổ chức từ thiết kế nhận diện, setup không gian sự kiện đến ghi hình tư liệu.',
    image: '/images/project-2.webp',
    coverImage: '/images/project-2.webp' as any,
    status: 'published',
    startDate: '2025-03-20',
    endDate: '2025-03-20',
    projectIntro: 'Sự kiện quy tụ hơn 120 chuyên gia, giảng viên đại học và nhà đào tạo để cập nhật ứng dụng AI trong giảng dạy.',
    challenge: 'Địa điểm tổ chức có ánh sáng phức tạp và thời gian setup chỉ có 3 tiếng trước giờ khai mạc.',
    projectGoals: 'Tổ chức sự kiện chỉn chu, đồng thời sản xuất 15 video ngắn recap bài giảng để làm tư liệu truyền thông lâu dài.',
    solutionSummary: 'Bố trí 3 góc máy chuyên nghiệp ghi lại toàn cảnh và cảm xúc học viên, hệ thống âm thanh mixer chống tạp âm tối ưu cho việc cắt clip bài giảng.',
    processSteps: [
      { id: 'p2-1', stepNumber: '01', title: 'Thiết kế Key Visual', description: 'Backdrop, standee, thẻ đeo, slide thuyết trình chuẩn công nghệ AI.' },
      { id: 'p2-2', stepNumber: '02', title: 'Setup & Tổng duyệt', description: 'Cân chỉnh âm thanh, màn hình LED P3 và vị trí đặt máy quay.' },
      { id: 'p2-3', stepNumber: '03', title: 'Ghi hình & Phỏng vấn', description: 'Phỏng vấn nhanh cảm nhận của 10 diễn giả và khách mời ngay tại sảnh check-in.' },
      { id: 'p2-4', stepNumber: '04', title: 'Sản xuất Recap & Phân phối', description: 'Trả video highlight sau 24h và cắt nhỏ các key note thành clip TikTok/Reels.' }
    ],
    results: [
      { id: 'r2-1', number: '120+', label: 'Chuyên gia & Giảng viên tham dự' },
      { id: 'r2-2', number: '18', label: 'Videos chất lượng cao sản xuất' },
      { id: 'r2-3', number: '2.5M+', label: 'Lượt xem tổng các clip recap' }
    ],
    qualitativeResults: [
      'Được đánh giá là một trong những workshop công nghệ giáo dục chỉn chu nhất quý 1/2025.',
      'Toàn bộ tài liệu sự kiện được số hóa thành khóa học trực tuyến.'
    ],
    gallery: ['/images/project-2.webp', '/images/hero-2.webp'],
    seo: {
      title: 'Workshop AI For Trainer - Tổ chức sự kiện giáo dục Heona Media',
      focusKeyword: 'tổ chức sự kiện AI đào tạo'
    }
  },
  {
    id: 3,
    title: 'Xây dựng thương hiệu TikTok triệu view — Tĩnh Khiêm Tarot',
    slug: 'xay-dung-tiktok-tinh-khiem-tarot',
    category: 'Expert Spotlight',
    clientId: 'cli-2',
    clientName: 'Tĩnh Khiêm Tarot',
    industry: 'Tâm lý & Chữa lành',
    services: ['TikTok', 'Content Strategy', 'Video Production'],
    description: 'Tăng nhận diện chuyên gia Tarot, video viral cao nhất đạt triệu view và thu hút hàng nghìn lượt đặt lịch tư vấn.',
    image: '/images/project-3.webp',
    coverImage: '/images/project-3.webp' as any,
    status: 'published',
    startDate: '2025-02-01',
    endDate: '2025-08-30',
    results: [
      { id: 'r3-1', number: '500K+', label: 'Followers sau 6 tháng' },
      { id: 'r3-2', number: '15M+', label: 'Lượt xem toàn kênh' },
      { id: 'r3-3', number: '1.2K+', label: 'Khách hàng đặt lịch tư vấn' }
    ],
    testimonial: {
      name: 'Mrs. Tĩnh Khiêm',
      position: 'Tarot Reader & Chuyên gia tâm lý',
      avatar: '/images/testimonial-2.webp',
      content: 'Nhờ chiến lược nội dung của Heona, kênh TikTok của mình đã tăng trưởng vượt bậc. Các bạn làm việc rất có tâm và sáng tạo không ngừng.'
    },
    seo: {
      title: 'Xây kênh TikTok chuyên gia Tĩnh Khiêm Tarot - Heona Media',
      focusKeyword: 'xây kênh tiktok chuyên gia'
    }
  },
  {
    id: 4,
    title: 'Lễ Ra Mắt Dự Án UNIHONE — Dấu ấn thương hiệu giáo dục cộng đồng',
    slug: 'le-ra-mat-du-an-unihome',
    category: 'School Story',
    clientId: 'cli-3',
    clientName: 'Tập đoàn UniHome',
    industry: 'Hệ sinh thái Giáo dục & Đời sống',
    services: ['Event Production', 'Event Content', 'Design', 'Media'],
    description: 'Sự kiện đánh dấu bước ngoặt hệ sinh thái UniHome. Phụ trách trọn gói ý tưởng, concept, sân khấu và truyền thông.',
    image: '/images/project-4.webp',
    coverImage: '/images/project-4.webp' as any,
    status: 'published',
    results: [
      { id: 'r4-1', number: '450+', label: 'Khách mời tham dự' },
      { id: 'r4-2', number: '100%', label: 'Đạt chỉ tiêu truyền thông báo chí' }
    ],
    testimonial: {
      name: 'Đại diện UniHome',
      position: 'Ban Tổ Chức',
      avatar: '/images/testimonial-3.webp',
      content: 'Sự kiện ra mắt dự án thành công rực rỡ nhờ sự chuyên nghiệp của Heona. Từ khâu ý tưởng đến thi công đều rất chỉn chu, đúng timeline.'
    }
  },
  {
    id: 5,
    title: 'Bộ Nhận Diện Thương Hiệu Khóa Học Master Trainer',
    slug: 'bo-nhan-dien-khoa-hoc-master-trainer',
    category: 'School Story',
    clientId: 'cli-1',
    clientName: 'Trainer Thanh Nguyên',
    industry: 'Học viện đào tạo',
    services: ['Design', 'Branding', 'Content Strategy'],
    description: 'Hệ thống giao diện hình ảnh và ấn phẩm học tập được làm mới hoàn toàn, chuyên nghiệp và đẳng cấp.',
    image: '/images/project-5.webp',
    coverImage: '/images/project-5.webp' as any,
    status: 'published',
    results: [
      { id: 'r5-1', number: '100%', label: 'Bộ nhận diện chuẩn hóa' },
      { id: 'r5-2', number: '5 Khóa', label: 'Tổ chức thành công' }
    ]
  },
  {
    id: 7,
    title: 'Đêm Nhạc Yêu Thương 4 — Lan Tỏa Ánh Sáng Giáo Dục',
    slug: 'dem-nhac-yeu-thuong-4',
    category: 'Event to Content',
    clientName: 'Quỹ Thiện Nguyện Ánh Sáng',
    industry: 'Giáo dục vì cộng đồng',
    services: ['Event Production', 'Photography', 'Video Production'],
    description: 'Chương trình thiện nguyện gây quỹ học bổng cho trẻ em vùng cao, tạo xúc động lớn trên mạng xã hội.',
    image: '/images/project-7.webp',
    coverImage: '/images/project-7.webp' as any,
    status: 'published',
    results: [
      { id: 'r7-1', number: '800M+', label: 'Số tiền quyên góp quỹ học bổng' },
      { id: 'r7-2', number: '600+', label: 'Khán giả trực tiếp' }
    ]
  },
  {
    id: 8,
    title: 'Lễ Ra Mắt Sách: Hành Trình Trở Thành Nhà Đào Tạo Chuyên Nghiệp',
    slug: 'le-ra-mat-sach-nha-dao-tao-chuyen-nghiep',
    category: 'Expert Spotlight',
    clientName: 'Master Trainer Việt Nam',
    industry: 'Xuất bản & Giáo dục',
    services: ['Event Content', 'Personal Branding', 'Media'],
    description: 'Lễ ra mắt sách [The Journey to Becoming a Master Trainer] kết hợp giao lưu cùng hơn 200 tác giả và độc giả.',
    image: '/images/project-8.webp',
    coverImage: '/images/project-8.webp' as any,
    status: 'published',
    results: [
      { id: 'r8-1', number: '2,000+', label: 'Bản sách phát hành đợt đầu' },
      { id: 'r8-2', number: '15+', label: 'Báo chí và kênh tin tức đưa tin' }
    ]
  }
];

export const SEED_MEDIA: MediaItem[] = [
  {
    id: 'm-1',
    filename: 'hero-1.webp',
    url: '/images/hero-1.webp',
    fileType: 'image',
    sizeBytes: 145000,
    resolution: '1920x1080',
    altText: 'Chuyên gia giáo dục ghi hình tại studio Heona Media',
    caption: 'Buổi ghi hình khóa học trực tuyến',
    uploadedBy: 'Nguyễn Heona',
    createdAt: '2025-01-10'
  },
  {
    id: 'm-2',
    filename: 'hero-2.webp',
    url: '/images/hero-2.webp',
    fileType: 'image',
    sizeBytes: 198000,
    resolution: '1920x1080',
    altText: 'Hội thảo đào tạo kỹ năng sân khấu lớn',
    caption: 'Workshop chuyên gia giáo dục',
    uploadedBy: 'Nguyễn Heona',
    createdAt: '2025-01-15'
  },
  {
    id: 'm-3',
    filename: 'hero-3.webp',
    url: '/images/hero-3.webp',
    fileType: 'image',
    sizeBytes: 172000,
    resolution: '1920x1080',
    altText: 'Ekip Heona Media điều phối máy quay sự kiện',
    caption: 'Đội ngũ quay phim chuyên nghiệp',
    uploadedBy: 'Trần Minh',
    createdAt: '2025-01-20'
  },
  {
    id: 'm-4',
    filename: 'project-1.webp',
    url: '/images/project-1.webp',
    fileType: 'image',
    sizeBytes: 120000,
    resolution: '1200x800',
    altText: 'Trainer Thanh Nguyên trong buổi chụp profile thương hiệu',
    caption: 'Brand Photography Trainer Thanh Nguyên',
    uploadedBy: 'Trần Minh',
    createdAt: '2025-02-01'
  },
  {
    id: 'm-5',
    filename: 'project-2.webp',
    url: '/images/project-2.webp',
    fileType: 'image',
    sizeBytes: 135000,
    resolution: '1200x800',
    altText: 'Sân khấu workshop AI For Trainer',
    caption: 'Sân khấu sự kiện',
    uploadedBy: 'Trần Minh',
    createdAt: '2025-03-21'
  },
  {
    id: 'm-6',
    filename: 'service-e.webp',
    url: '/images/service-e.webp',
    fileType: 'image',
    sizeBytes: 156000,
    resolution: '1200x800',
    altText: 'Chân dung chuyên gia đào tạo phong thái tự tin',
    caption: 'Gói chụp ảnh Profile cá nhân',
    uploadedBy: 'Nguyễn Heona',
    createdAt: '2025-02-15'
  },
  {
    id: 'm-7',
    filename: 'logo.webp',
    url: '/images/logo.webp',
    fileType: 'image',
    sizeBytes: 45000,
    resolution: '512x512',
    altText: 'Logo chính thức Heona Media',
    caption: 'Logo nhận diện',
    uploadedBy: 'Nguyễn Heona',
    createdAt: '2025-01-01'
  }
];

export const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'ThS. Hoàng Đình Trọng',
    phone: '0918 889 999',
    email: 'trong.hd@ptit.edu.vn',
    company: 'Khoa Đào tạo Quốc tế',
    serviceInterested: 'School Story',
    message: 'Chúng tôi muốn sản xuất video giới thiệu ngành học mới và chuỗi phóng sự cựu sinh viên phục vụ kỳ tuyển sinh sắp tới.',
    sourcePage: '/services',
    status: 'New',
    notes: 'Ưu tiên liên hệ trong sáng mai.',
    createdAt: '2026-09-15 08:15'
  },
  {
    id: 'lead-2',
    name: 'Cô Phan Lan Hương',
    phone: '0903 222 111',
    email: 'lanhuong.edu@gmail.com',
    company: 'Trung tâm Ngoại ngữ Shining Star',
    serviceInterested: 'Expert Spotlight',
    message: 'Cần tư vấn xây dựng kênh TikTok và hình ảnh cá nhân cho 5 giảng viên chủ chốt của trung tâm.',
    sourcePage: '/projects',
    status: 'Contacted',
    notes: 'Đã gọi điện lần 1, gửi hồ sơ năng lực qua Zalo.',
    createdAt: '2026-09-14 15:40'
  },
  {
    id: 'lead-3',
    name: 'Thầy Vũ Duy Cường',
    phone: '0938 765 432',
    email: 'cuong.vu@mindsparks.vn',
    company: 'Học viện Kỹ năng MindSparks',
    serviceInterested: 'Event to Content',
    message: 'Cuối tháng 10 chúng tôi tổ chức lễ kỷ niệm 5 năm thành lập kết hợp hội thảo 300 khách, cần báo giá trọn gói quay dựng.',
    sourcePage: '/contact',
    status: 'Proposal',
    notes: 'Đã gửi báo giá gói Silver + Media team 4 người.',
    createdAt: '2026-09-13 11:20'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Lead mới từ website',
    message: 'ThS. Hoàng Đình Trọng vừa gửi yêu cầu tư vấn gói School Story.',
    type: 'alert',
    link: '/admin/leads',
    read: false,
    createdAt: '2026-09-15 08:15'
  },
  {
    id: 'notif-2',
    title: 'Bài viết đang chờ duyệt',
    message: 'Bài viết "School Story: Kể câu chuyện trường học" từ Lê Thảo đang chờ phê duyệt.',
    type: 'warning',
    link: '/admin/articles',
    read: false,
    createdAt: '2026-09-14 16:00'
  },
  {
    id: 'notif-3',
    title: 'Dự án thiếu tối ưu SEO',
    message: 'Dự án "Đêm Nhạc Yêu Thương 4" chưa có Meta Description và Focus Keyword.',
    type: 'info',
    link: '/admin/projects',
    read: false,
    createdAt: '2026-09-14 10:30'
  }
];

export const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'u-admin-1',
    userName: 'Nguyễn Heona',
    action: 'đã xuất bản bài viết',
    entityType: 'article',
    entityTitle: 'Chiến lược xây dựng thương hiệu cá nhân TikTok',
    createdAt: '2026-09-14 17:30'
  },
  {
    id: 'act-2',
    userId: 'u-contrib-1',
    userName: 'Lê Thảo',
    action: 'đã gửi duyệt bài viết',
    entityType: 'article',
    entityTitle: 'School Story: Cách kể câu chuyện trường học',
    createdAt: '2026-09-14 16:00'
  },
  {
    id: 'act-3',
    userId: 'u-editor-1',
    userName: 'Trần Minh',
    action: 'đã cập nhật case study',
    entityType: 'project',
    entityTitle: 'Workshop AI FOR TRAINER',
    createdAt: '2026-09-14 11:15'
  }
];

export const SEED_SERVICES: Service[] = [
  {
    id: 'service-1',
    tag: 'Trọng tâm',
    title: 'Tổ chức sự kiện',
    subTitle: 'Lên ý tưởng – kịch bản – thi công – vận hành trọn gói theo mục tiêu doanh nghiệp.',
    shortDescription: 'Tổ chức sự kiện offline, workshop, hội nghị trọn gói kiểm soát chi phí tối ưu.',
    features: [
      'Lễ khai trương – khánh thành',
      'Hội nghị – hội thảo – họp báo',
      'Tiệc tất niên – Year End Party',
      'Team Building',
      'Tour Retreat/Trekking',
      'Activation – Roadshow',
      'Ra mắt sản phẩm'
    ],
    image: '/images/hero-2.webp',
    highlight: true,
    order: 1,
    status: 'published',
    price: 'Liên hệ báo giá',
    createdAt: '2025-01-10',
    updatedAt: '2026-09-15'
  },
  {
    id: 'service-2',
    tag: 'Trọng tâm',
    title: 'Xây dựng nhân hiệu',
    subTitle: 'Chiến lược – nội dung – hình ảnh. Đồng hành trọn gói.',
    shortDescription: 'Xây dựng nhân hiệu bền vững từ gốc rễ, định vị chuyên gia trên đa nền tảng.',
    features: [
      'Tư vấn & Định hình thông điệp & phong cách cá nhân',
      'Sản xuất nội dung chuyên sâu (bài viết – video – podcast)',
      'Xây kênh social (Facebook – TikTok – Group cộng đồng)',
      'Coaching 1:1: xuất hiện tự tin – thuyết phục – tạo ảnh hưởng',
      'Chụp ảnh – quay video nhân hiệu (profile, series nội dung)'
    ],
    image: '/images/hero-1.webp',
    highlight: true,
    order: 2,
    status: 'published',
    price: 'Theo lộ trình 3-6 tháng',
    createdAt: '2025-01-10',
    updatedAt: '2026-09-15'
  },
  {
    id: 'service-3',
    tag: 'Trọng tâm',
    title: 'Chụp ảnh profile cá nhân',
    subTitle: 'Ghi lại thần thái chuyên nghiệp, khẳng định uy tín và sự đột phá trong sự nghiệp của bạn.',
    shortDescription: 'Chụp ảnh chân dung nghề nghiệp và profile doanh nhân cao cấp chuẩn quốc tế.',
    features: [
      'Chụp ảnh chân dung nghề nghiệp (Studio/Office)',
      'Concept: Chuyên gia, Doanh nhân, Nghệ sĩ',
      'Trang điểm & Làm tóc chuyên nghiệp',
      'Hỗ trợ tạo dáng & Biểu cảm chuyên nghiệp',
      'Hậu kỳ cao cấp, tối ưu đa nền tảng'
    ],
    image: '/images/service-e.webp',
    highlight: true,
    order: 3,
    status: 'published',
    price: 'Gói từ 3.500.000đ',
    createdAt: '2025-01-15',
    updatedAt: '2026-09-15'
  },
  {
    id: 'service-4',
    tag: 'Marketing',
    title: 'Hỗ trợ truyền thông & marketing',
    subTitle: 'Sản xuất nội dung video ngắn, bài viết PR và quảng cáo đa kênh.',
    shortDescription: 'Dịch vụ marketing nội dung toàn diện và phân phối đa kênh hiệu quả.',
    features: [
      'Dịch vụ viết bài PR, content marketing',
      'Sản xuất nội dung video, bài viết viral',
      'Quảng cáo Facebook, TikTok chuyên nghiệp'
    ],
    image: '/images/hero-3.webp',
    highlight: false,
    order: 4,
    status: 'published',
    price: 'Gói định kỳ hàng tháng',
    createdAt: '2025-02-01',
    updatedAt: '2026-09-15'
  },
  {
    id: 'service-5',
    tag: 'Branding',
    title: 'Giải pháp hình ảnh thương hiệu',
    subTitle: 'Thiết kế logo, bộ nhận diện thương hiệu và ấn phẩm truyền thông chuyên nghiệp.',
    shortDescription: 'Thiết kế nhận diện thương hiệu chuẩn mực và ấn phẩm sáng tạo đồng bộ.',
    features: [
      'Thiết kế thương hiệu: Logo, bộ nhận diện thương hiệu, ấn phẩm truyền thông',
      'Chụp ảnh Profile & Beauty cho doanh nhân, chuyên gia, diễn giả'
    ],
    image: '/images/service-d.webp',
    highlight: false,
    order: 5,
    status: 'published',
    price: 'Theo quy mô dự án',
    createdAt: '2025-02-10',
    updatedAt: '2026-09-15'
  }
];
