
import React from 'react';
import { PageHero, Section } from '../components/Section';
import { Card } from '../components/Card';
import { Eye, Target, Diamond, Award } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

export const About: React.FC = () => {
    return (
        <>
            <SEO
                title="Về Chúng Tôi"
                description="Câu chuyện thương hiệu HEONA MEDIA - Hành trình kiến tạo những sự kiện tử tế và xây dựng thương hiệu cá nhân chuyên nghiệp."
                url="/about"
            />
            <Section className="pt-10 pb-10 md:pt-16 md:pb-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-slide-up">
                        <div className="text-xs uppercase tracking-[0.18em] text-secondary font-medium mb-3">Giới thiệu</div>
                        <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-5 leading-tight">
                            Về <span className="text-primary">HEONA MEDIA</span>
                        </h1>
                        <p className="text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            HEONA MEDIA là đơn vị tổ chức sự kiện & sản xuất media thực chiến, tập trung vào
                            chất lượng thi công, quy trình rõ ràng và chi phí minh bạch cho doanh nghiệp.
                        </p>
                        <p className="text-textMuted text-base md:text-lg leading-relaxed">
                            Được thành lập với sứ mệnh đồng hành cùng những người đang mang trong mình giá trị và khát khao lan tỏa.
                        </p>
                    </div>
                    <div className="relative animate-fade-in delay-200">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-bgSoft">
                            <ProgressiveImage src="https://i.postimg.cc/Wb8YrJPS/ava.jpg" alt="About Heona" className="w-full h-full object-cover" delay={200} />
                        </div>
                        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-20 -z-10"></div>
                    </div>
                </div>
            </Section>

            <Section narrow>
                <div className="mb-12 text-center animate-fade-in">
                    <span className="text-secondary font-mono text-xs tracking-[0.3em] uppercase block mb-3">CÂU CHUYỆN THƯƠNG HIỆU</span>
                    <h2 className="font-heading font-black text-3xl md:text-5xl leading-tight mb-6 relative inline-block">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#cfc0ff] to-white drop-shadow-lg">
                            GIỚI THIỆU HEONA MEDIA
                        </span>
                        <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    </h2>
                </div>

                <Card className="mb-16 p-8 md:p-10 border-primary/20 bg-gradient-to-b from-[#15151b] to-[#0b0b0d]" noHover>
                    <div className="space-y-6 text-textMuted text-base leading-7 text-justify md:text-left">
                        <p><span className="text-white font-bold text-lg block mb-2">Xin chào,</span> Heona Media xin được gửi lời chào trân trọng và lời cảm ơn sâu sắc đến Quý khách hàng và đối tác đã quan tâm đến dịch vụ của chúng tôi.</p>

                        <p>Công ty TNHH Truyền thông Heona Media được ra đời ngày <strong>12/02/2025</strong> – trong giai đoạn bùng nổ mạnh mẽ của Công nghệ và Truyền thông, khi ngày càng nhiều chuyên gia mong muốn lan tỏa giá trị của mình đến với cộng đồng.</p>

                        <div className="grid md:grid-cols-2 gap-8 my-8">
                            <div className="bg-white/5 p-6 rounded-lg border-l-4 border-primary">
                                <strong className="text-white block mb-2 text-lg">Lĩnh vực chuyên sâu</strong>
                                Chúng tôi là đơn vị truyền thông chuyên cung cấp giải pháp <strong>xây dựng thương hiệu cá nhân</strong> và <strong>tổ chức sự kiện chuyên nghiệp</strong> trong lĩnh vực giáo dục, phát triển bản thân và tâm linh.
                            </div>
                            <div className="bg-white/5 p-6 rounded-lg border-l-4 border-secondary">
                                <strong className="text-white block mb-2 text-lg">Cam kết hành động</strong>
                                Với đội ngũ trẻ, năng động, sáng tạo, Heona Media cam kết đồng hành cùng Quý khách hàng một cách <strong>chân thật – chuyên nghiệp – tử tế</strong>.
                            </div>
                        </div>

                        <p>Heona Media ra đời với sứ mệnh đồng hành cùng những người đang mang trong mình giá trị và khát khao lan tỏa, giúp họ tỏa sáng theo cách riêng và chạm đến trái tim của cộng đồng.</p>

                        <p>Chúng tôi tin rằng, mỗi cá nhân đều mang trong mình một giá trị độc nhất và điều tuyệt vời nhất chính là khi bạn chọn lan tỏa điều đó đến thế giới.</p>

                        <div className="text-center mt-10">
                            <p className="text-xl md:text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-relaxed">
                                “Heona Media – Tỏa sáng theo cách riêng của bạn!”
                            </p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/10">
                            <h3 className="font-heading font-bold text-lg text-white mb-5 flex items-center gap-3">
                                <Award className="text-primary" size={20} /> Thông tin thương hiệu
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5 text-sm">
                                <div className="p-4 bg-bgMain rounded border border-white/5">
                                    <span className="text-textMuted block text-xs uppercase tracking-wider mb-1.5">Tên công ty</span>
                                    <strong className="text-white text-base">CÔNG TY TNHH TRUYỀN THÔNG HEONA MEDIA</strong>
                                </div>
                                <div className="p-4 bg-bgMain rounded border border-white/5">
                                    <span className="text-textMuted block text-xs uppercase tracking-wider mb-1.5">Tên thương hiệu</span>
                                    <strong className="text-white text-base">Heona Media</strong>
                                </div>
                                <div className="p-4 bg-bgMain rounded border border-white/5">
                                    <span className="text-textMuted block text-xs uppercase tracking-wider mb-1.5">Slogan</span>
                                    <strong className="text-white text-base">“Tỏa sáng theo cách riêng của bạn!”</strong>
                                </div>
                                <div className="p-4 bg-bgMain rounded border border-white/5">
                                    <span className="text-textMuted block text-xs uppercase tracking-wider mb-1.5">Lĩnh vực hoạt động</span>
                                    <strong className="text-white text-base">Truyền thông – Xây dựng thương hiệu cá nhân – Tổ chức sự kiện</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="h-full flex flex-col p-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 border border-primary/20">
                            <Eye size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-3 text-white">Tầm nhìn</h3>
                        <p className="text-sm text-textMuted leading-relaxed flex-grow">
                            Heona định hướng trở thành đơn vị hàng đầu trong lĩnh vực truyền thông và tổ chức sự kiện chuyên biệt cho lĩnh vực giáo dục và tâm linh, dựa trên sự tử tế, khác biệt và chân thật.
                        </p>
                    </Card>

                    <Card className="h-full flex flex-col p-6">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-5 border border-secondary/20">
                            <Target size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-3 text-white">Sứ mệnh</h3>
                        <p className="text-sm text-textMuted leading-relaxed flex-grow">
                            Đồng hành cùng những người đang mang trong mình giá trị và khát khao lan tỏa, giúp họ tỏa sáng theo cách riêng và chạm đến trái tim cộng đồng. Heona Media cam kết làm việc với tinh thần chân thật – chuyên nghiệp – tử tế.
                        </p>
                    </Card>

                    <Card className="h-full flex flex-col p-6">
                        <div className="w-12 h-12 rounded-full bg-[#cfc0ff]/10 flex items-center justify-center text-[#cfc0ff] mb-5 border border-[#cfc0ff]/20">
                            <Diamond size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-3 text-white">Giá trị cốt lõi</h3>
                        <p className="text-sm text-textMuted leading-relaxed mb-5">
                            Những giá trị định hình nên phong cách làm việc của Heona Media:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {['Chân thật', 'Sáng tạo', 'Tử tế', 'Tự tin', 'Phát triển', 'Phụng sự', 'Đồng hành', 'Chuyên nghiệp'].map(val => (
                                <span key={val} className="text-xs px-3 py-1 rounded bg-white/10 border border-white/20 text-white font-medium shadow-sm">
                                    {val}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-stretch">
                    <div className="rounded-2xl overflow-hidden border border-borderSubtle h-72 md:h-auto">
                        <ProgressiveImage src="https://i.postimg.cc/J4xYJBWP/ava2.jpg" alt="Heona Team" className="w-full h-full object-cover" delay={300} />
                    </div>
                    <div className="flex flex-col gap-6">
                        <Card className="p-6">
                            <h3 className="font-heading font-bold text-xl mb-2">Đơn vị sản xuất sự kiện & media thực chiến</h3>
                            <p className="text-sm text-textMuted mb-4">HEONA MEDIA được xây dựng bởi đội ngũ có kinh nghiệm nhiều năm trong lĩnh vực tổ chức sự kiện, livestream và truyền thông.</p>
                            <p className="text-sm text-white font-medium mb-2">Chúng tôi tập trung vào:</p>
                            <ul className="grid grid-cols-1 gap-2 text-sm text-textMuted mb-5">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Chất lượng thi công, kiểm soát chi tiết từng hạng mục.</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Timeline rõ ràng, có người chịu trách nhiệm ở từng bước.</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Chi phí minh bạch, báo giá theo hạng mục cụ thể.</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Đồng hành cùng doanh nghiệp từ khâu ý tưởng đến triển khai.</li>
                            </ul>
                            <div className="flex gap-2 flex-wrap">
                                {['Tinh gọn', 'Kỷ luật', 'Minh bạch', 'Hiệu quả'].map(tag => (
                                    <span key={tag} className="text-xs px-3 py-1 bg-[#2a2a35] border border-white/10 rounded-full text-white/80">{tag}</span>
                                ))}
                            </div>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-heading font-bold text-xl mb-2">Đội ngũ & cách làm việc</h3>
                            <p className="text-sm text-textMuted mb-3">Đội ngũ kỹ thuật – điều phối – media trẻ, linh hoạt, đã triển khai nhiều định dạng sự kiện khác nhau.</p>
                            <ul className="space-y-2 text-sm text-textMuted">
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0"></span>Producer & event executive theo sát từ brief đến tổng duyệt.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0"></span>Đội ngũ kỹ thuật sân khấu, âm thanh, ánh sáng, LED.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0"></span>Team media: quay phim, chụp ảnh, dựng hậu kỳ, livestream.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0"></span>Quy trình làm việc rõ ràng, cập nhật tiến độ cho khách hàng.</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </Section>
        </>
    );
};
