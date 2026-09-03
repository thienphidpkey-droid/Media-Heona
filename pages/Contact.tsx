
import React, { useState, useRef, useEffect } from 'react';
import { PageHero, Section } from '../components/Section';
import { Card } from '../components/Card';
import { Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle, Facebook, ExternalLink, Youtube, Clock } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import emailjs from '@emailjs/browser';
import { SEO } from '../components/SEO';
import { ZaloIcon } from '../components/Footer';

// Đảm bảo các ID này đúng với trong EmailJS Dashboard của bạn
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const Contact: React.FC = () => {
    const { contactInfo } = useContent();
    const form = useRef<HTMLFormElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [cooldown, setCooldown] = useState<number>(0);

    // Countdown cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.current) return;

        // Anti-spam Honeypot Check: bot fills invisible trap input
        const botTrap = form.current.elements.namedItem('website_bot_trap') as HTMLInputElement | null;
        if (botTrap && botTrap.value) {
            console.warn('Bot detected and neutralized via honeypot.');
            setIsSubmitting(false);
            setSubmitStatus('success');
            if (form.current) form.current.reset();
            return;
        }

        // Rate-limit check
        if (cooldown > 0) {
            alert(`Vui lòng đợi ${cooldown} giây trước khi gửi thêm yêu cầu.`);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        emailjs
            .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
                publicKey: PUBLIC_KEY,
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                    setIsSubmitting(false);
                    setSubmitStatus('success');
                    setCooldown(45);
                    if (form.current) form.current.reset();
                    setTimeout(() => setSubmitStatus('idle'), 5000);
                },
                (error) => {
                    console.error('FAILED...', error);
                    setIsSubmitting(false);
                    setSubmitStatus('error');
                    // Lấy thông báo lỗi cụ thể để hiển thị
                    setErrorMessage(error.text || "Lỗi kết nối đến dịch vụ Email.");

                    // Hiển thị alert để người dùng biết ngay lập tức
                    alert(`Gửi thất bại: ${error.text}. Vui lòng kiểm tra lại Service ID hoặc kết nối Gmail.`);
                },
            );
    };

    return (
        <>
            <SEO
                title="Liên Hệ"
                description="Liên hệ HEONA MEDIA để nhận tư vấn và báo giá tổ chức sự kiện, dịch vụ media trọn gói. Hotline: 0931 899 427. Địa chỉ: Gò Vấp, TP.HCM."
                url="/contact"
            />
            <PageHero title="Liên hệ HEONA MEDIA" sub="Gửi thông tin để chúng tôi tư vấn giải pháp truyền thông & sự kiện phù hợp nhất cho bạn." />

            <Section narrow>
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
                    <Card noHover className="p-6">
                        <h2 className="font-heading font-bold text-xl mb-1">Thông tin liên hệ</h2>
                        <p className="text-xs text-textMuted mb-6">HEONA MEDIA – Truyền thông • Branding • Sự kiện</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-textMuted uppercase mb-0.5">Phone / Zalo</div>
                                    <div className="font-medium text-white text-sm">{contactInfo.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-textMuted uppercase mb-0.5">Email</div>
                                    <div className="font-medium text-white text-sm">{contactInfo.email}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-textMuted uppercase mb-0.5">Địa chỉ</div>
                                    <div className="font-medium text-white text-sm">{contactInfo.address}</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4">
                                <div className="text-[10px] text-textMuted uppercase mb-3">Kết nối mạng xã hội</div>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href={contactInfo.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded bg-blue-600/5 border border-blue-600/20 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:bg-blue-600/10 transition-all group"
                                        aria-label="Fanpage Facebook"
                                    >
                                        <Facebook size={18} className="text-blue-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                        <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Fanpage Heona Media</span>
                                        <ExternalLink size={12} className="ml-auto opacity-50 group-hover:text-blue-400" />
                                    </a>

                                    <a
                                        href={contactInfo.zalo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded bg-blue-700/5 border border-blue-700/20 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(29,78,216,0.2)] hover:bg-blue-700/10 transition-all group"
                                        aria-label="Chat Zalo"
                                    >
                                        <ZaloIcon size={18} className="text-blue-700 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                        <span className="text-sm font-medium text-white group-hover:text-blue-500 transition-colors">Chat Zalo ngay</span>
                                        <ExternalLink size={12} className="ml-auto opacity-50 group-hover:text-blue-500" />
                                    </a>

                                    {contactInfo.youtube && (
                                        <a
                                            href={contactInfo.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded bg-red-600/5 border border-red-600/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:bg-red-600/10 transition-all group"
                                            aria-label="Youtube Channel"
                                        >
                                            <Youtube size={18} className="text-red-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                            <span className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">Heona Media channel</span>
                                            <ExternalLink size={12} className="ml-auto opacity-50 group-hover:text-red-400" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-borderSubtle text-[10px] text-textMuted italic">
                            Vui lòng để lại nội dung chi tiết, Heona Media sẽ phản hồi trong thời gian sớm nhất.
                        </div>
                    </Card>

                    <Card noHover className="p-6">
                        <h2 className="font-heading font-bold text-xl mb-1">Gửi yêu cầu báo giá</h2>
                        <p className="text-xs text-textMuted mb-6">Cho chúng tôi biết nhu cầu của bạn, đội ngũ sẽ tư vấn gói dịch vụ phù hợp.</p>

                        <form ref={form} onSubmit={sendEmail} className="space-y-5">
                            {/* Honeypot anti-spam trap: invisible to humans, attracts spam bots */}
                            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                                <label htmlFor="website_bot_trap">Do not fill this</label>
                                <input
                                    type="text"
                                    id="website_bot_trap"
                                    name="website_bot_trap"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Họ tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Nhập họ tên..."
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Công ty</label>
                                    <input
                                        type="text"
                                        name="company"
                                        placeholder="Tên công ty..."
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="SĐT liên hệ..."
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Email..."
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Loại dịch vụ</label>
                                    <select
                                        name="service"
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all appearance-none"
                                    >
                                        <option value="">Chọn loại dịch vụ</option>
                                        <option value="Xây dựng thương hiệu">Xây dựng thương hiệu</option>
                                        <option value="Tổ chức sự kiện">Tổ chức sự kiện</option>
                                        <option value="Truyền thông">Truyền thông</option>
                                        <option value="Hình ảnh thương hiệu">Hình ảnh thương hiệu</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-textMuted font-medium">Ngân sách dự kiến</label>
                                    <select
                                        name="budget"
                                        className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all appearance-none"
                                    >
                                        <option value="">Chưa xác định</option>
                                        <option value="Dưới 50 triệu">Dưới 50 triệu</option>
                                        <option value="50 – 100 triệu">50 – 100 triệu</option>
                                        <option value="100 – 300 triệu">100 – 300 triệu</option>
                                        <option value="Trên 300 triệu">Trên 300 triệu</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-textMuted font-medium">Nội dung yêu cầu</label>
                                <textarea
                                    name="message"
                                    placeholder="Mô tả chi tiết..."
                                    className="bg-[#111116] border border-borderSubtle rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:bg-[#15151c] transition-all min-h-[120px]"
                                ></textarea>
                            </div>

                            <div className="pt-1">
                                {submitStatus === 'success' && (
                                    <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 animate-fade-in text-sm">
                                        <CheckCircle size={16} />
                                        <span>Gửi thành công! Chúng tôi sẽ sớm liên hệ lại với bạn.</span>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 animate-fade-in text-sm">
                                        <AlertCircle size={16} />
                                        <div className="flex flex-col">
                                            <span>Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hotline.</span>
                                            {errorMessage && <span className="text-xs opacity-80 mt-1">Chi tiết: {errorMessage}</span>}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || cooldown > 0}
                                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> Đang gửi thông tin...
                                        </>
                                    ) : cooldown > 0 ? (
                                        <>
                                            <Clock size={16} /> Đã gửi thành công (Thử lại sau {cooldown}s)
                                        </>
                                    ) : (
                                        "Gửi thông tin & Nhận báo giá"
                                    )}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </Section>
        </>
    );
};
