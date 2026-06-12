
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { PageHero, Section } from '../components/Section';
import { Project } from '../types';
import { X, Filter } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

interface ProjectItemProps {
  project: Project;
  onSelect: (image: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onSelect }) => {
  const [imageIndex] = useState(() => Math.floor(Math.random() * 1000));

  return (
    <div className="h-full flex flex-col bg-[#111115]/80 backdrop-blur-md border border-white/5 rounded-xl p-3 md:p-5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(111,58,255,0.15)] transition-all duration-300 group animate-fade-in">
      <div
        className="rounded-lg overflow-hidden mb-3 md:mb-4 cursor-pointer relative h-32 md:h-auto md:aspect-video"
        onClick={() => onSelect(project.image)}
      >
        <ProgressiveImage
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          delay={imageIndex % 10 * 100}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-md border border-white/20 px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-white transition-all transform translate-y-2 group-hover:translate-y-0">
            Xem ảnh
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 md:gap-1.5 mb-1 md:mb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-heading font-bold text-sm md:text-xl text-white group-hover:text-primary transition-colors leading-tight pr-1 md:pr-2 line-clamp-1">
            {project.title}
          </h3>
        </div>
        <div>
          <span className="text-[8px] md:text-[10px] font-mono text-secondary border border-white/10 bg-white/5 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded uppercase tracking-wider whitespace-nowrap">
            {project.category}
          </span>
        </div>
      </div>
      <p className="text-[10px] md:text-sm text-textMuted mt-1 md:mt-2 leading-relaxed line-clamp-2 md:line-clamp-none">{project.description}</p>
    </div>
  );
};

export const Projects: React.FC = () => {
  const { projects } = useContent();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);
    return ['All', ...uniqueCats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <>
      <SEO
        title="Dự Án Tiêu Biểu"
        description="Tham khảo các dự án tổ chức sự kiện, sản phẩm media, TVC doanh nghiệp và các chiến dịch xây dựng thương hiệu cá nhân do HEONA MEDIA thực hiện."
        url="/projects"
      />
      <PageHero
        title="Dự án tiêu biểu"
        sub="Khám phá các sự kiện và sản phẩm truyền thông mà HEONA MEDIA đã thực hiện bằng sự tận tâm và chuyên nghiệp."
      />

      <Section narrow className="min-h-[60vh]">
        <div className="flex flex-wrap items-center gap-2 md:gap-2.5 mb-8 md:mb-10 animate-fade-in">
          <div className="mr-1 md:mr-2 p-1.5 md:p-2 rounded-full bg-white/5 text-textMuted">
            <Filter size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide transition-all duration-300 ${activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                  : 'bg-[#111115] border border-white/10 text-textMuted hover:text-white hover:border-white/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredProjects.map((p) => (
              <ProjectItem key={p.id} project={p} onSelect={setSelectedImage} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-sm md:text-base text-textMuted border border-dashed border-white/10 rounded-xl bg-white/5">
            Không tìm thấy dự án nào trong danh mục này.
          </div>
        )}
      </Section>

      {selectedImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="relative max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <ProgressiveImage
              src={selectedImage}
              alt="Full preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10 animate-slide-up select-none"
              loading="eager"
              delay={0}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};