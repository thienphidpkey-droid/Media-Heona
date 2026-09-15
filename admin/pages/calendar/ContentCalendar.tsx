import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticlesService, ProjectsService } from '../../services/db';

export const ContentCalendar: React.FC = () => {
  const articles = ArticlesService.getAll();
  const projects = ProjectsService.getAll();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Lịch Nội Dung (Content Calendar)</h1>
          <p className="text-xs text-gray-400 mt-1">
            Theo dõi tiến độ xuất bản bài viết và case study theo dòng thời gian.
          </p>
        </div>
      </div>

      {/* Calendar Timeline Card */}
      <div className="bg-[#111116] p-6 rounded-2xl border border-white/[0.06] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h2 className="text-base font-bold text-white">Tháng 09 / 2026</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Bài viết</span>
            <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Dự án</span>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl bg-[#16161d] border border-white/[0.06] flex items-center justify-between hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{a.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {a.category} • Tác giả: {a.author}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 capitalize">
                  {a.status}
                </span>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">{a.publishedAt || a.createdAt}</p>
              </div>
            </div>
          ))}

          {projects.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-[#16161d] border border-primary/20 flex items-center justify-between hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary text-black flex items-center justify-center shrink-0 shadow-xs">
                  <Briefcase className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{p.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {p.category} • Khách hàng: {p.clientName || 'Heona Partners'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-primary/20 text-primary border border-primary/30">
                  Case Study
                </span>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">{p.startDate || '2026-09-01'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
