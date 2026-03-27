
import React from 'react';
import { PageHero, Section } from '../components/Section';
import { PricingPlan } from '../types';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { SEO } from '../components/SEO';

const PLANS: PricingPlan[] = [
  {
    id: 1,
    label: 'Gói cơ bản',
    name: 'Sự kiện nhỏ – vừa',
    desc: 'Phù hợp khai trương, ra mắt sản phẩm hoặc sự kiện nội bộ quy mô gọn.',
    features: ['Backdrop tiêu chuẩn', 'Âm thanh 2–4 line', 'Ánh sáng cơ bản', 'Nhân sự điều phối'],
    price: 'Từ 8.000.000đ',
    note: 'Chưa bao gồm chi phí địa điểm'
  },
  {
    id: 2,
    label: 'Gói chuyên nghiệp',
    name: 'Doanh nghiệp',
    desc: 'Phù hợp hội nghị khách hàng, hội thảo, chương trình cần hình ảnh chỉn chu.',
    features: ['Sân khấu 6–8m', 'LED P3 – 10m²', 'Âm thanh – ánh sáng nâng cao', 'Kịch bản & đạo diễn'],
    price: 'Từ 25.000.000đ',
    note: 'Áp dụng cho sự kiện tại TP.HCM',
    highlight: true
  },
  {
    id: 3,
    label: 'Gói toàn diện',
    name: 'Full giải pháp',
    desc: 'Tối ưu cho sự kiện lớn cần đồng bộ từ concept, thi công đến media.',
    features: ['Concept trọn gói',  'LED diện rộng', 'Media full coverage'],
    price: 'Từ 60.000.000đ',
    note: 'Ngân sách thiết kế riêng'
  }
];

export const Pricing: React.FC = () => {
  return (
    <>
      <SEO 
        title="Bảng Giá Dịch Vụ"
        description="Tham khảo bảng giá tổ chức sự kiện, cho thuê thiết bị và sản xuất media tại Heona Media. Chi phí minh bạch, tối ưu ngân sách cho doanh nghiệp."
        url="/pricing"
      />
      <PageHero title="Gói dịch vụ tham khảo" sub="Mức giá tham khảo. HEONA MEDIA sẽ xây dựng báo giá riêng theo quy mô và yêu cầu thực tế." />
      
      <Section narrow>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => (
            <div 
                key={plan.id}
                className={`flex flex-col rounded-2xl p-6 border transition-all duration-300 animate-fade-in group hover:border-primary hover:-translate-y-2 ${
                    plan.highlight 
                    ? 'bg-gradient-to-b from-[#1f1f28] to-bgCard border-primary shadow-xl shadow-primary/10 transform md:-translate-y-3' 
                    : 'bg-bgCard border-borderSubtle'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{plan.label}</div>
                <h3 className="font-heading font-bold text-2xl mb-2 text-white">{plan.name}</h3>
                <p className="text-sm text-textMuted mb-6 h-10 leading-relaxed">{plan.desc}</p>
                
                <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                <div className="text-xs text-textMuted mb-6">{plan.note}</div>

                <ul className="flex-grow space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-textMuted">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Check size={12} />
                            </div>
                            {f}
                        </li>
                    ))}
                </ul>

                <Link 
                    to="/contact" 
                    className={`w-full py-3 rounded-full text-sm font-bold text-center transition-all ${
                        plan.highlight
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40'
                        : 'border border-borderSubtle text-white hover:border-transparent hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white'
                    }`}
                >
                    Nhận báo giá
                </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};
