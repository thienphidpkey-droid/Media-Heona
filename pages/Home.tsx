
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { ArrowRight, Hexagon, Radio, Phone, Mail, MapPin, Quote, Star } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

const HERO_IMAGES = [
  "https://i.postimg.cc/hvSh7Y9d/a1.jpg",
  "https://i.postimg.cc/zvJ3RQnW/a2.jpg",
  "https://i.postimg.cc/6q9TGPdG/a3.jpg"
];

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

      <Section className="pt-10 pb-8 md:pt-20 md:pb-16 relative overflow-hidden bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />

        <div className="absolute top-24 left-5 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-24 right-5 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-10 left-5 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-10 right-5 w-4 h-4 border-b border-r border-white/20" />

        <div className="relative z-10 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
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
                <div className="pl-5 border-l-4 border-primary/50 hover:border-primary transition-colors duration-300">
                  <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Tổ chức sự kiện chuyên nghiệp
                  </h3>
                  <p className="text-textMuted text-base mb-3 leading-relaxed">
                    Từ khai trương, hội nghị đến Year End Party, HEONA MEDIA xây dựng trải nghiệm sự kiện rõ ràng, kiểm soát tốt chất lượng và ngân sách.
                  </p>
                </div>

                <div className="pl-5 border-l-4 border-secondary/50 hover:border-secondary transition-colors duration-300">
                  <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Xây dựng Nhân hiệu cá nhân
                  </h3>
                  <p className="text-textMuted text-base mb-3 leading-relaxed">
                    Đồng hành từ gốc rễ: khai mở giá trị thật, định hình phong cách riêng và tạo hệ sinh thái nội dung giúp bạn tỏa sáng bền vững.
                  </p>
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

            <div className="relative animate-fade-in delay-200 group perspective-1000 sticky top-24 hidden lg:block">
              <div className="absolute -inset-3 border border-white/5 rounded-xl skew-y-2 group-hover:skew-y-1 transition-transform duration-700"></div>
              <div className="absolute -inset-3 border border-primary/20 rounded-xl skew-y-2 blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>

              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] bg-bgSoft">
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
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative border-t border-white/5 pt-12 md:pt-16 pb-12 md:pb-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="text-center mb-8 md:mb-12">
          <div className="text-[10px] md:text-xs font-mono text-primary uppercase tracking-widest mb-1 md:mb-2">[ SERVICES ]</div>
          <h2 className="font-heading font-extrabold text-2xl md:text-4xl px-4">Dịch vụ trọng tâm</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          <Link to="/pricing" className="group relative bg-[#111115] border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col" aria-label="Chi tiết dịch vụ Tổ chức sự kiện">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 md:p-8 relative z-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3 md:mb-5">
                <h3 className="font-heading font-bold text-[13px] md:text-2xl group-hover:text-primary transition-colors leading-tight">Tổ chức sự kiện</h3>
                <ArrowRight className="text-white/20 group-hover:text-primary transition-all w-4 h-4 md:w-6 md:h-6 hidden md:block" />
              </div>
              <p className="text-textMuted text-[10px] md:text-sm mb-3 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">
                Lên ý tưởng – kịch bản – thi công – vận hành trọn gói theo mục tiêu doanh nghiệp.
              </p>

              <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-8 flex-grow">
                {['Khai trương', 'Hội nghị', 'Year End Party', 'Activation'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3 text-[10px] md:text-sm text-textMuted group-hover:text-white transition-colors">
                    <div className="mt-1 md:mt-1.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Link>

          <Link to="/pricing" className="group relative bg-[#111115] border border-white/10 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-500 flex flex-col" aria-label="Chi tiết dịch vụ Xây dựng thương hiệu">
            <div className="absolute inset-0 bg-gradient-to-l from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 md:p-8 relative z-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3 md:mb-5">
                <h3 className="font-heading font-bold text-[13px] md:text-2xl group-hover:text-secondary transition-colors leading-tight">Xây dựng nhân hiệu</h3>
                <ArrowRight className="text-white/20 group-hover:text-secondary transition-all w-4 h-4 md:w-6 md:h-6 hidden md:block" />
              </div>
              <p className="text-textMuted text-[10px] md:text-sm mb-3 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">
                Chiến lược – nội dung – hình ảnh. Đồng hành trọn gói.
              </p>

              <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-8 flex-grow">
                {[
                  'Định hình phong cách',
                  'Sản xuất nội dung',
                  'Coaching 1:1',
                  'Quay chụp profile'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3 text-[10px] md:text-sm text-textMuted group-hover:text-white transition-colors">
                    <div className="mt-1 md:mt-1.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-secondary shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Link>

          <Link to="/pricing" className="col-span-2 lg:col-span-1 group relative bg-[#111115] border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col" aria-label="Chi tiết dịch vụ Chụp ảnh Profile">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 md:p-8 relative z-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3 md:mb-5">
                <h3 className="font-heading font-bold text-[14px] md:text-2xl group-hover:text-primary transition-colors leading-tight">Chụp ảnh profile cá nhân</h3>
                <ArrowRight className="text-white/20 group-hover:text-primary transition-all w-4 h-4 md:w-6 md:h-6 hidden md:block" />
              </div>
              <p className="text-textMuted text-[10px] md:text-sm mb-3 md:mb-6 leading-relaxed">
                Ghi lại thần thái chuyên nghiệp, khẳng định uy tín và sự đột phá trong sự nghiệp của bạn.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] md:text-sm font-bold bg-white/5 border border-white/10 px-2 md:px-4 py-1.5 md:py-2 rounded text-secondary font-mono uppercase tracking-wide">Concept độc bản</span>
                <span className="text-[10px] md:text-sm font-bold bg-white/5 border border-white/10 px-2 md:px-4 py-1.5 md:py-2 rounded text-secondary font-mono uppercase tracking-wide">Hậu kỳ tỉ mỉ</span>
              </div>
            </div>
          </Link>
        </div>
      </Section>

      <Section narrow className="relative pb-12 md:pb-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="flex flex-col items-center mb-8 md:mb-10 text-center">
          <div className="text-[10px] md:text-xs font-mono text-secondary uppercase tracking-widest mb-1 md:mb-2">[ PROJECTS ]</div>
          <h2 className="font-heading font-extrabold text-2xl md:text-4xl">DỰ ÁN TIÊU BIỂU</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {projects.slice(0, 4).map((item, index) => (
            <div key={item.id} className="group relative h-32 md:h-auto md:aspect-video rounded-xl overflow-hidden border border-white/10 bg-bgCard hover:border-primary/50 transition-all duration-500">
              <ProgressiveImage
                src={item.image}
                alt={`Dự án ${item.title} - ${item.category} do Heona Media thực hiện`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                delay={index * 100}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

              <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-[8px] md:text-xs font-mono text-primary mb-1 md:mb-1.5 px-1.5 md:px-2 py-0.5 md:py-1 bg-primary/20 w-fit rounded border border-primary/30 backdrop-blur-sm">
                  {item.category}
                </div>
                <h3 className="font-heading font-bold text-xs md:text-2xl text-white leading-tight mb-1 line-clamp-2">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex justify-center">
          <Link to="/projects" className="group relative px-6 md:px-10 py-3 md:py-4 bg-white text-bgMain font-heading font-bold text-xs md:text-base tracking-wider rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(111,58,255,0.6)] flex items-center gap-2 overflow-hidden" aria-label="Xem tất cả dự án">
            <span className="relative z-10">XEM TẤT CẢ DỰ ÁN</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </Section>

      <Section narrow className="relative py-12 md:py-16 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="text-center mb-8 md:mb-12">
          <div className="text-[10px] md:text-xs font-mono text-primary uppercase tracking-widest mb-1 md:mb-2">[ TESTIMONIALS ]</div>
          <h2 className="font-heading font-extrabold text-2xl md:text-4xl">KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <div key={testimonial.id} className="bg-[#111115]/50 border border-white/5 p-5 md:p-8 rounded-xl relative hover:border-primary/30 transition-colors duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                    {testimonial.avatar ? (
                      <ProgressiveImage src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" delay={index * 50} />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center text-white font-bold text-base md:text-lg">{testimonial.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-white text-sm md:text-sm truncate">{testimonial.name}</div>
                    <div className="text-xs md:text-xs text-textMuted truncate">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-textMuted text-[13px] md:text-sm italic leading-relaxed line-clamp-3">"{testimonial.content}"</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section narrow className="relative pt-8 pb-12 md:pb-16 border-t border-white/5 bg-gradient-to-b from-[#0b0b0d]/50 to-[#08080a]/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto bg-[#111115] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="font-heading font-bold text-xl md:text-3xl mb-4 text-white">Kết nối với chúng tôi</h2>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center md:justify-start mb-6">
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                  <Phone size={16} /> <span className="text-sm md:text-lg font-bold">{contactInfo.phone}</span>
                </a>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Link to="/contact" className="flex items-center justify-center w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black font-bold text-sm md:text-base rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all">
                Gửi yêu cầu tư vấn <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
