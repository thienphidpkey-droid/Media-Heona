
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { ArrowRight, Hexagon, Layers, Radio, Phone, Mail, MapPin, Quote, Star } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

const HERO_IMAGES = [
  "https://i.postimg.cc/hvSh7Y9d/a1.jpg",
  "https://i.postimg.cc/zvJ3RQnW/a2.jpg",
  "https://i.postimg.cc/6q9TGPdG/a3.jpg"
];

// Alt texts cụ thể cho từng ảnh để tối ưu SEO
const HERO_ALTS = [
  "Heona Media xây dựng thương hiệu cá nhân chuyên nghiệp",
  "Tổ chức sự kiện và workshop đào tạo tại TP.HCM",
  "Sản xuất media, quay phim và livestream sự kiện"
];

export const Home: React.FC = () => {
  const { projects, contactInfo, testimonials } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <SEO
        title="Tổ chức sự kiện & Sản xuất Media"
        description="HEONA MEDIA chuyên tổ chức sự kiện trọn gói, livestream chuyên nghiệp, quay phim doanh nghiệp và xây dựng thương hiệu cá nhân uy tín tại TP.HCM."
        keywords="tổ chức sự kiện tphcm, livestream sự kiện, quay phim sự kiện, xây dựng nhân hiệu, heona media"
      />

      {/* Hero Section */}
      <Section className="pt-10 pb-8 md:pt-20 md:pb-16 relative overflow-hidden bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />

        <div className="absolute top-24 left-5 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-24 right-5 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-10 left-5 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-10 right-5 w-4 h-4 border-b border-r border-white/20" />

        {/* Semi-transparent overlay for hero content */}
        <div className="relative z-10 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            {/* Left Content */}
            <div className="animate-slide-up relative">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <div className="text-xs uppercase tracking-[0.2em] text-secondary font-mono font-bold">
                  Tổ chức sự kiện • Sản xuất media
                </div>
              </div>

              <h1 className="font-heading font-extrabold text-2xl md:text-4xl lg:text-[41px] leading-[3rem] mb-8 tracking-tight">
                GIẢI PHÁP TRUYỀN THÔNG <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#9d7aff] to-secondary drop-shadow-[0_0_10px_rgba(111,58,255,0.5)]">
                  ĐỒNG BỘ & TOÀN DIỆN
                </span>
              </h1>

              <div className="flex flex-col gap-8 mb-10">
                {/* Event Description Block */}
                <div className="pl-5 border-l-4 border-primary/50 hover:border-primary transition-colors duration-300">
                  <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Tổ chức sự kiện chuyên nghiệp
                  </h3>
                  <p className="text-textMuted text-base mb-3 leading-relaxed">
                    Từ khai trương, hội nghị đến Year End Party, HEONA MEDIA xây dựng trải nghiệm sự kiện rõ ràng, kiểm soát tốt chất lượng và ngân sách.
                  </p>
                  <div className="bg-white/5 p-3 rounded border border-white/5 text-white/90 italic text-xs">
                    “Tư duy sản xuất tinh gọn, đội ngũ kỹ thuật lành nghề và phong cách làm việc kỷ luật.”
                  </div>
                </div>

                {/* Personal Branding Description Block */}
                <div className="pl-5 border-l-4 border-secondary/50 hover:border-secondary transition-colors duration-300">
                  <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Xây dựng Nhân hiệu cá nhân
                  </h3>
                  <p className="text-textMuted text-base mb-3 leading-relaxed">
                    Đồng hành từ gốc rễ: khai mở giá trị thật, định hình phong cách riêng và tạo hệ sinh thái nội dung giúp bạn tỏa sáng bền vững.
                  </p>
                  <div className="bg-white/5 p-3 rounded border border-white/5 text-textMuted text-xs italic">
                    Không phô diễn, không màu mè, chỉ là chính bạn nhưng phiên bản rõ ràng hơn, sâu sắc hơn.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/projects" className="group relative px-8 py-4 rounded-none clip-path-slant bg-white text-bgMain font-bold text-sm transition-all hover:bg-secondary hover:text-white overflow-hidden" aria-label="Khám phá các dự án tiêu biểu của Heona Media">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    XEM DỰ ÁN <ArrowRight size={16} />
                  </span>
                </Link>
                <Link to="/contact" className="px-8 py-4 rounded-none clip-path-slant border border-white/20 bg-white/5 backdrop-blur text-white font-bold text-sm hover:bg-secondary hover:border-secondary hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300" aria-label="Liên hệ nhận báo giá dịch vụ">
                  NHẬN BÁO GIÁ NHANH
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-xs text-textMuted font-mono tracking-tight pt-6 border-t border-white/5">
                <span className="flex items-center gap-2"><Radio size={16} className="text-primary" /> Livestream – Media</span>
                <span className="flex items-center gap-2"><Hexagon size={16} className="text-primary" /> Chi phí minh bạch</span>
              </div>
            </div>

            {/* Right Visual (Slider) */}
            <div className="relative animate-fade-in delay-200 group perspective-1000 sticky top-24">
              <div className="absolute -inset-3 border border-white/5 rounded-xl skew-y-2 group-hover:skew-y-1 transition-transform duration-700"></div>
              <div className="absolute -inset-3 border border-primary/20 rounded-xl skew-y-2 blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>

              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] bg-bgSoft">
                {/* Only render current slide for better performance */}
                <div className="absolute inset-0">
                  <ProgressiveImage
                    src={HERO_IMAGES[currentSlide]}
                    alt={HERO_ALTS[currentSlide]}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    width="800"
                    height="600"
                    delay={0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bgMain via-transparent to-transparent opacity-40"></div>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 ${index === currentSlide
                        ? 'w-8 h-2 bg-primary rounded-full'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Previous/Next Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Dịch vụ Tóm tắt */}
      <Section className="relative border-t border-white/5 pt-16 pb-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="text-center mb-12">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">[ SERVICES ]</div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl">Dịch vụ trọng tâm của HEONA MEDIA</h2>
          <p className="text-textMuted text-base mt-4 max-w-3xl mx-auto">
            Heona Media là đơn vị truyền thông tập trung vào 2 mảng cốt lõi: Tổ chức sự kiện chuyên nghiệp và Xây dựng nhân hiệu cá nhân chuẩn chiến lược – chuẩn hệ sinh thái.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/pricing" className="group relative bg-[#111115] border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col" aria-label="Chi tiết dịch vụ Tổ chức sự kiện">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8 relative z-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-heading font-bold text-2xl group-hover:text-primary transition-colors">Tổ chức sự kiện</h3>
                <ArrowRight className="text-white/20 group-hover:text-primary -translate-x-2 group-hover:translate-x-0 transition-all w-6 h-6" />
              </div>
              <p className="text-textMuted text-sm mb-6 leading-relaxed">
                Lên ý tưởng – kịch bản – thi công – vận hành trọn gói theo mục tiêu doanh nghiệp.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {['Lễ khai trương – khánh thành', 'Hội nghị – hội thảo – họp báo', 'Tiệc tất niên – Year End Party', 'Activation – Roadshow', 'Ra mắt sản phẩm'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-textMuted group-hover:text-white transition-colors">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/5">
                <span className="text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded text-secondary font-mono uppercase tracking-wide">Ý tưởng bám sát mục tiêu</span>
                <span className="text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded text-secondary font-mono uppercase tracking-wide">Thi công đúng timeline</span>
              </div>
            </div>
          </Link>

          <Link to="/pricing" className="group relative bg-[#111115] border border-white/10 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-500 flex flex-col" aria-label="Chi tiết dịch vụ Xây dựng thương hiệu">
            <div className="absolute inset-0 bg-gradient-to-l from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8 relative z-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-heading font-bold text-2xl group-hover:text-secondary transition-colors">Xây dựng nhân hiệu cá nhân</h3>
                <ArrowRight className="text-white/20 group-hover:text-secondary -translate-x-2 group-hover:translate-x-0 transition-all w-6 h-6" />
              </div>
              <p className="text-textMuted text-sm mb-6 leading-relaxed">
                Chiến lược – nội dung – hình ảnh – hệ sinh thái. Đồng hành trọn gói để thương hiệu của bạn thật sự tỏa sáng.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  'Tư vấn & Định hình thông điệp & phong cách cá nhân',
                  'Sản xuất nội dung chuyên sâu (bài viết – video – podcast)',
                  'Xây kênh social (Facebook – TikTok – Group cộng đồng)',
                  'Coaching 1:1: xuất hiện tự tin – nói chuyện thuyết phục – tạo ảnh hưởng',
                  'Chụp ảnh – quay video nhân hiệu (profile, series nội dung)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-textMuted group-hover:text-white transition-colors">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="text-sm font-bold text-white mb-3">Điểm mạnh của Heona:</div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-primary font-mono uppercase tracking-wide bg-white/5 border border-white/10 px-3 py-2 rounded block w-fit">
                    • Hiểu ngành: Coaching – Healing – Phát triển bản thân
                  </span>
                  <span className="text-sm font-bold text-primary font-mono uppercase tracking-wide bg-white/5 border border-white/10 px-3 py-2 rounded block w-fit">
                    • Xây thương hiệu cá nhân: Thật – Sâu – Chạm cảm xúc
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Section>

      {/* Dự án nổi bật */}
      <Section narrow className="relative pb-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-2">[ PROJECTS ]</div>
          <h2 className="font-heading font-extrabold text-4xl">DỰ ÁN TIÊU BIỂU</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.slice(0, 4).map((item, index) => (
            <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-bgCard hover:border-primary/50 transition-all duration-500">
              <ProgressiveImage
                src={item.image}
                alt={`Dự án ${item.title} - ${item.category} do Heona Media thực hiện`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                delay={index * 100}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-xs font-mono text-primary mb-1 px-2 py-1 bg-primary/20 w-fit rounded border border-primary/30 backdrop-blur-sm">
                  {item.category}
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-white leading-tight mb-1">{item.title}</h3>
                <p className="text-textMuted text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects" className="group relative px-10 py-4 bg-white text-bgMain font-heading font-bold text-base tracking-wider rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(111,58,255,0.6)] flex items-center gap-2 overflow-hidden" aria-label="Xem tất cả dự án">
            <span className="relative z-10">XEM TẤT CẢ DỰ ÁN</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="absolute inset-0 bg-white mix-blend-screen opacity-0 group-hover:opacity-20"></span>
          </Link>
        </div>
      </Section>

      {/* Testimonials Section (New) */}
      <Section narrow className="relative py-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">[ TESTIMONIALS ]</div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl">KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-[#111115]/50 border border-white/5 p-8 rounded-xl relative hover:border-primary/30 transition-colors duration-300">
              <Quote size={40} className="absolute top-6 right-6 text-white/5" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  {testimonial.avatar ? (
                    <ProgressiveImage src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" delay={index * 50} />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">{testimonial.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-textMuted">{testimonial.role}{testimonial.company && ` - ${testimonial.company}`}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} className="text-secondary fill-secondary" />)}
              </div>
              <p className="text-textMuted text-sm italic leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact Info Section - Enhanced CTA */}
      <Section narrow className="relative pt-8 pb-16 border-t border-white/5 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto bg-[#111115] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] -z-10 rounded-full group-hover:bg-primary/30 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/20 blur-[80px] -z-10 rounded-full group-hover:bg-secondary/30 transition-colors duration-700"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1">
              <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                Kết nối ngay
              </div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-5 text-white">Thông tin liên hệ</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group/item">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-0.5">Hotline / Zalo</div>
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-lg font-bold text-white hover:text-secondary transition-colors">{contactInfo.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group/item">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-0.5">Email</div>
                    <a href={`mailto:${contactInfo.email}`} className="text-lg font-bold text-white break-all hover:text-secondary transition-colors">{contactInfo.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group/item">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-textMuted uppercase tracking-wider mb-0.5">Địa chỉ</div>
                    <div className="text-base text-white leading-snug">{contactInfo.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Link to="/contact" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-white text-black font-bold text-base rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(111,58,255,0.5)]" aria-label="Gửi yêu cầu tư vấn ngay">
                Gửi yêu cầu tư vấn <ArrowRight className="ml-2" size={18} />
              </Link>
              <div className="mt-3 text-center text-xs text-textMuted flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Phản hồi nhanh trong 24h
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
