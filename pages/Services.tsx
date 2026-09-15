
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/Section';
import { Zap, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

export const Services: React.FC = () => {
  const { services } = useContent();

  return (
    <>
      <SEO
        title="Dịch Vụ"
        description="Các gói dịch vụ của Heona Media: Tổ chức sự kiện trọn gói, Quay phim chụp ảnh sự kiện, Livestream, Xây dựng nhân hiệu và Booking KOLs."
        url="/services"
      />
      <PageHero
        title="Các gói dịch vụ"
        sub="Giải pháp linh hoạt, đồng hành cùng cá nhân & doanh nghiệp trong kỷ nguyên số."
      />

      <Section narrow>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={service.id} className="animate-fade-in h-full flex" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-full flex flex-col bg-[#111115]/60 backdrop-blur border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_20px_rgba(111,58,255,0.15)] transition-all duration-300 relative">

                <div className="relative h-48 overflow-hidden">
                  <ProgressiveImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    delay={index * 100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111115] to-transparent" />

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      {service.tag}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-6 -mt-8 relative z-10">
                  <h2 className="font-heading font-bold text-xl leading-snug mb-2 group-hover:text-primary transition-colors">{service.title}</h2>
                  {service.subTitle && <div className="text-secondary text-xs font-medium mb-3 tracking-wide">{service.subTitle}</div>}

                  <div className="w-12 h-[1px] bg-white/10 mb-4" />

                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {(service.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-textMuted group-hover:text-textMain transition-colors">
                        <Zap size={12} className="mt-[4px] text-secondary shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="mt-auto w-full py-3 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-center hover:bg-primary hover:border-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                  >
                    Nhận báo giá <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};