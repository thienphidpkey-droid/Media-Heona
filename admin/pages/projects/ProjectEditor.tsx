// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Plus, Trash2,
  Image, CheckCircle2, Clock,
  MoveUp, MoveDown, AlertCircle, Video,
  Search, FolderPlus, X
} from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { ProjectsService, ClientsService } from '../../services/db';
import { useToast } from '../../components/Toast';
import { MediaPickerModal } from '../../components/MediaPickerModal';
export const ProjectEditor: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const isNew = !id || id === "new";
	const existing = !isNew ? ProjectsService.getById(id) : void 0;
	const clients = ClientsService.getAll();
	const [title, setTitle] = useState(existing?.title || "");
	const [slug, setSlug] = useState(existing?.slug || "");
	const [clientId, setClientId] = useState(existing?.clientId || "");
	const [clientName, setClientName] = useState(existing?.clientName || "");
	const [category, setCategory] = useState(existing?.category || "Expert Spotlight");
	const [industry, setIndustry] = useState(existing?.industry || "Giáo dục & Đào tạo");
	const [location, setLocation] = useState(existing?.location || "TP. Hồ Chí Minh");
	const [startDate, setStartDate] = useState(existing?.startDate || "");
	const [endDate, setEndDate] = useState(existing?.endDate || "");
	const [coverImage, setCoverImage] = useState(existing?.image || "/images/project-1.webp");
	const [featuredVideo, setFeaturedVideo] = useState(existing?.featuredVideo || "");
	const [status, setStatus] = useState(existing?.status || "draft");
	const [description, setDescription] = useState(existing?.description || "");
	const [projectIntro, setProjectIntro] = useState(existing?.projectIntro || "");
	const [clientBackground, setClientBackground] = useState(existing?.clientBackground || "");
	const [challenge, setChallenge] = useState(existing?.challenge || "");
	const [projectGoals, setProjectGoals] = useState(existing?.projectGoals || "");
	const AVAILABLE_SERVICES = [
		"Brand Strategy",
		"Personal Branding",
		"Content Strategy",
		"Photography",
		"Video Production",
		"TikTok",
		"Facebook",
		"YouTube",
		"Event Production",
		"Event Content",
		"Social Media Management",
		"Design",
		"Livestream"
	];
	const [selectedServices, setSelectedServices] = useState(existing?.services || ["Personal Branding", "Content Strategy"]);
	const [solutionSummary, setSolutionSummary] = useState(existing?.solutionSummary || "");
	const [processSteps, setProcessSteps] = useState(existing?.processSteps && existing.processSteps.length > 0 ? existing.processSteps : [
		{
			id: "1",
			stepNumber: "01",
			title: "Research & Strategy",
			description: "Nghiên cứu thị trường và định vị thương hiệu."
		},
		{
			id: "2",
			stepNumber: "02",
			title: "Concept Development",
			description: "Phát triển ý tưởng và bộ nhận diện truyền thông."
		},
		{
			id: "3",
			stepNumber: "03",
			title: "Production",
			description: "Tổ chức sản xuất hình ảnh, video và sự kiện."
		},
		{
			id: "4",
			stepNumber: "04",
			title: "Content Distribution",
			description: "Phân phối nội dung đa kênh TikTok, FB, YouTube."
		}
	]);
	const [results, setResults] = useState(existing?.results || []);
	const [qualitativeText, setQualitativeText] = useState(existing?.qualitativeResults?.join("\n") || "Xây dựng hoàn chỉnh hình ảnh chuyên gia chuẩn giáo dục.\nĐịnh hình hệ thống Content Pillar nhất quán.\nTạo kênh chuyển đổi học viên tự nhiên.");
	const [testiName, setTestiName] = useState(existing?.testimonial?.name || "");
	const [testiPos, setTestiPos] = useState(existing?.testimonial?.position || "");
	const [testiCompany, setTestiCompany] = useState(existing?.testimonial?.company || "");
	const [testiContent, setTestiContent] = useState(existing?.testimonial?.content || "");
	const [testiAvatar, setTestiAvatar] = useState(existing?.testimonial?.avatar || "/images/testimonial-1.webp");
	const [testiVideoUrl, setTestiVideoUrl] = useState(existing?.testimonial?.videoUrl || "");
	const [gallery, setGallery] = useState(existing?.gallery || [
		"/images/project-1.webp",
		"/images/project-2.webp",
		"/images/project-3.webp"
	]);
	const [newGalleryUrl, setNewGalleryUrl] = useState("");
	const [seoTitle, setSeoTitle] = useState(existing?.seo?.title || "");
	const [metaDesc, setMetaDesc] = useState(existing?.seo?.metaDescription || "");
	const [focusKeyword, setFocusKeyword] = useState(existing?.seo?.focusKeyword || "");
	const [canonicalUrl, setCanonicalUrl] = useState(existing?.seo?.canonicalUrl || "");
	const [robotsIndex, setRobotsIndex] = useState(existing?.seo?.robotsIndex !== false);
	const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
	const [mediaTarget, setMediaTarget] = useState("cover");
	const [previewOpen, setPreviewOpen] = useState(false);
	const [lastSavedTime, setLastSavedTime] = useState("Vừa xong");
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [activeNavId, setActiveNavId] = useState("sec-info");
	useEffect(() => {
		setHasUnsavedChanges(true);
	}, [
		title,
		slug,
		clientId,
		clientName,
		category,
		industry,
		location,
		startDate,
		endDate,
		coverImage,
		featuredVideo,
		status,
		description,
		projectIntro,
		clientBackground,
		challenge,
		projectGoals,
		selectedServices,
		solutionSummary,
		processSteps,
		results,
		qualitativeText,
		testiName,
		testiPos,
		testiCompany,
		testiContent,
		testiAvatar,
		testiVideoUrl,
		gallery,
		seoTitle,
		metaDesc,
		focusKeyword,
		canonicalUrl,
		robotsIndex
	]);
	useEffect(() => {
		if (isNew && title && !slug) {
			const gen = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			setSlug(gen);
		}
	}, [
		title,
		isNew,
		slug
	]);
	useEffect(() => {
		if (!previewOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setPreviewOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = originalOverflow;
		};
	}, [previewOpen]);
	const isSec1Valid = Boolean(title.trim() && coverImage.trim());
	const isSec2Valid = Boolean(projectIntro.trim() || challenge.trim());
	const isSec3Valid = Boolean(selectedServices.length > 0);
	const isSec4Valid = Boolean(processSteps.length > 0 && processSteps.every((s) => s.title.trim()));
	const isSec5Valid = Boolean(results.length > 0 || qualitativeText.trim());
	const isSec6Valid = Boolean(testiName.trim() && testiContent.trim());
	const isSec7Valid = Boolean(coverImage.trim() || gallery.length > 0);
	const isSec8Valid = Boolean(seoTitle.trim() || metaDesc.trim());
	const navSections = [
		{
			id: "sec-info",
			num: "01",
			title: "Thông tin dự án",
			isValid: isSec1Valid,
			hasWarning: !title.trim()
		},
		{
			id: "sec-overview",
			num: "02",
			title: "Tổng quan bài toán",
			isValid: isSec2Valid
		},
		{
			id: "sec-solution",
			num: "03",
			title: "Giải pháp Heona",
			isValid: isSec3Valid
		},
		{
			id: "sec-process",
			num: "04",
			title: "Quy trình thực hiện",
			isValid: isSec4Valid
		},
		{
			id: "sec-results",
			num: "05",
			title: "Kết quả đạt được",
			isValid: isSec5Valid
		},
		{
			id: "sec-testimonial",
			num: "06",
			title: "Đánh giá khách hàng",
			isValid: isSec6Valid
		},
		{
			id: "sec-media",
			num: "07",
			title: "Thư viện Media",
			isValid: isSec7Valid
		},
		{
			id: "sec-seo",
			num: "08",
			title: "Cấu hình SEO",
			isValid: isSec8Valid
		}
	];
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 130;
			for (let i = navSections.length - 1; i >= 0; i--) {
				const el = document.getElementById(navSections[i].id);
				if (el) {
					if (scrollPosition >= el.offsetTop) {
						setActiveNavId(navSections[i].id);
						break;
					}
				}
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const scrollToSection = (secId) => {
		setActiveNavId(secId);
		const element = document.getElementById(secId);
		if (element) element.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const toggleService = (srv) => {
		setSelectedServices((prev) => prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]);
	};
	const handleAddStep = () => {
		const nextNum = (processSteps.length + 1).toString().padStart(2, "0");
		setProcessSteps((prev) => [...prev, {
			id: Date.now().toString(),
			stepNumber: nextNum,
			title: "Bước mới",
			description: "Mô tả chi tiết bước thực hiện..."
		}]);
	};
	const handleRemoveStep = (idx) => {
		setProcessSteps((prev) => prev.filter((_, i) => i !== idx));
	};
	const handleMoveStep = (idx, direction) => {
		const targetIdx = direction === "up" ? idx - 1 : idx + 1;
		if (targetIdx < 0 || targetIdx >= processSteps.length) return;
		const updated = [...processSteps];
		const temp = updated[idx];
		updated[idx] = updated[targetIdx];
		updated[targetIdx] = temp;
		updated.forEach((step, i) => {
			step.stepNumber = (i + 1).toString().padStart(2, "0");
		});
		setProcessSteps(updated);
	};
	const handleAddResult = () => {
		setResults((prev) => [...prev, {
			id: Date.now().toString(),
			number: "100K+",
			label: "Chỉ số mới"
		}]);
	};
	const handleRemoveResult = (idx) => {
		setResults((prev) => prev.filter((_, i) => i !== idx));
	};
	const handleAddGalleryImage = (url) => {
		if (!url.trim()) return;
		setGallery((prev) => [...prev, url.trim()]);
		setNewGalleryUrl("");
	};
	const handleRemoveGalleryImage = (idx) => {
		setGallery((prev) => prev.filter((_, i) => i !== idx));
	};
	const handleSave = (targetStatus) => {
		if (!title.trim()) {
			showToast("Vui lòng nhập tên dự án tại Mục 01", "error");
			scrollToSection("sec-info");
			return;
		}
		const currentStatus = targetStatus || status;
		const qualitativeResults = qualitativeText.split("\n").map((t) => t.trim()).filter(Boolean);
		const saved = ProjectsService.save({
			id: isNew ? void 0 : existing?.id,
			title,
			slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			category,
			clientId,
			clientName: clientName || clients.find((c) => c.id === clientId)?.name || "Khách hàng",
			industry,
			services: selectedServices,
			location,
			startDate,
			endDate,
			image: coverImage,
			coverImage,
			featuredVideo,
			status: currentStatus,
			description: description || projectIntro,
			projectIntro,
			clientBackground,
			challenge,
			projectGoals,
			solutionSummary,
			processSteps,
			results,
			qualitativeResults,
			gallery,
			testimonial: testiName || testiContent ? {
				name: testiName || "Khách hàng ẩn danh",
				position: testiPos,
				company: testiCompany,
				content: testiContent,
				avatar: testiAvatar,
				videoUrl: testiVideoUrl
			} : void 0,
			seo: {
				title: seoTitle || `${title} - Heona Media Case Study`,
				metaDescription: metaDesc || description || projectIntro,
				focusKeyword,
				canonicalUrl,
				robotsIndex
			}
		});
		if (targetStatus) setStatus(targetStatus);
		setHasUnsavedChanges(false);
		const now = /* @__PURE__ */ new Date();
		setLastSavedTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
		showToast(currentStatus === "draft" ? "Đã lưu bản nháp dự án!" : "Đã lưu và xuất bản Case Study thành công!", "success");
		if (isNew) navigate(`/admin/projects/${saved.id}`, { replace: true });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-[1440px] mx-auto px-4 sm:px-6 pb-24 text-gray-100 antialiased",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-white/[0.06]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => navigate("/admin/projects"),
						className: "p-2 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg border border-white/[0.08] transition-colors shrink-0",
						title: "Quay lại danh sách dự án",
						children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-extrabold uppercase tracking-wider text-primary",
									children: isNew ? "Tạo Case Study mới" : "Biên tập Case Study"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-gray-600",
									children: "•"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 text-[11px] text-gray-400",
									children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-gray-500" }), /* @__PURE__ */ jsx("span", { children: hasUnsavedChanges ? "Có thay đổi chưa lưu" : `Đã lưu lúc ${lastSavedTime}` })]
								})
							]
						}), /* @__PURE__ */ jsx("h1", {
							className: "text-base sm:text-lg font-bold text-white truncate max-w-sm sm:max-w-md md:max-w-lg",
							children: title || "Dự án chưa đặt tên"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex lg:hidden items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setPreviewOpen(true),
							className: "px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 text-primary" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Xem trước"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => handleSave("draft"),
							className: "px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors",
							children: "Lưu nháp"
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => handleSave("published"),
							className: "px-4 py-2 text-xs font-bold text-black bg-primary hover:bg-primary/90 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shadow-xs",
							children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: status === "published" ? "Cập nhật" : "Xuất bản" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "lg:hidden sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 mb-6 bg-[#0b0b0d]/95 backdrop-blur-md border-b border-white/[0.06] overflow-x-auto no-scrollbar",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1.5 min-w-max",
					children: navSections.map((sec) => {
						const isActive = activeNavId === sec.id;
						return /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => scrollToSection(sec.id),
							className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive ? "bg-primary text-black font-bold shadow-xs" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-semibold",
									children: sec.num
								}),
								/* @__PURE__ */ jsx("span", { children: sec.title }),
								sec.isValid && /* @__PURE__ */ jsx(CheckCircle2, { className: `w-3 h-3 ${isActive ? "text-black" : "text-emerald-400"}` })
							]
						}, sec.id);
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-[299px_minmax(0,1fr)] gap-8 items-start",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "hidden lg:block sticky top-[80px] self-start w-[299px] p-2 space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "px-2 py-1 mb-2",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-gray-500",
								children: "Mục lục"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-1",
							children: navSections.map((sec) => {
								const isActive = activeNavId === sec.id;
								return /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => scrollToSection(sec.id),
									className: `w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between group ${isActive ? "bg-primary text-black font-bold shadow-xs" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"}`,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 truncate",
										children: [/* @__PURE__ */ jsx("span", {
											className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? "bg-black/20 text-black" : "bg-white/[0.06] text-gray-400 group-hover:text-white"}`,
											children: sec.num
										}), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: sec.title
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "shrink-0 ml-1.5 flex items-center",
										children: sec.isValid ? /* @__PURE__ */ jsx(CheckCircle2, { className: `w-3.5 h-3.5 ${isActive ? "text-black" : "text-emerald-400"}` }) : sec.hasWarning ? /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 text-amber-400" }) : /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white/20" })
									})]
								}, sec.id);
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 pt-3 border-t border-white/[0.06] px-2 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-[11px] text-gray-400",
									children: [/* @__PURE__ */ jsx("span", { children: "Trạng thái:" }), /* @__PURE__ */ jsx("span", {
										className: `font-bold uppercase text-[10px] px-2 py-0.5 rounded ${status === "published" ? "bg-emerald-500/15 text-emerald-400" : status === "review" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400"}`,
										children: status === "published" ? "Đã xuất bản" : status === "review" ? "Chờ duyệt" : "Bản nháp"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "w-full bg-white/[0.08] rounded-full h-1 overflow-hidden",
									children: /* @__PURE__ */ jsx("div", {
										className: "bg-primary h-full transition-all duration-300",
										style: { width: `${navSections.filter((s) => s.isValid).length / navSections.length * 100}%` }
									})
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[10px] text-gray-500 text-center",
									children: [
										"Hoàn thiện ",
										navSections.filter((s) => s.isValid).length,
										"/8 phần"
									]
								})
							]
						}),
						/* Actions Block inside Sidebar */
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 pt-3 border-t border-white/[0.06] space-y-2 px-1",
							children: [
								/* Primary button: Xuất bản / Cập nhật */
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleSave("published"),
									className: "w-full py-2.5 px-3 text-xs font-bold text-black bg-primary hover:bg-primary/90 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs cursor-pointer",
									children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: status === "published" ? "Cập nhật" : "Xuất bản" })]
								}),
								/* Secondary row: Xem trước + Lưu nháp */
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-2",
									children: [
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setPreviewOpen(true),
											className: "py-2 px-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 text-primary" }), /* @__PURE__ */ jsx("span", { children: "Xem trước" })]
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handleSave("draft"),
											className: "py-2 px-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors text-center cursor-pointer",
											children: "Lưu nháp"
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("main", {
					className: "w-full min-w-0 space-y-10",
					children: [
						/* @__PURE__ */ jsxs("section", {
							id: "sec-info",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "01"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Thông tin dự án"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Tên, danh mục mũi nhọn, thông tin đối tác và hình ảnh nhận diện"
								})] }), isSec1Valid ? /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Đầy đủ"]
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-xs text-amber-400 font-medium",
									children: "Bắt buộc tên & ảnh bìa"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
										children: ["Tên dự án / Case Study ", /* @__PURE__ */ jsx("span", {
											className: "text-rose-400",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: title,
										onChange: (e) => setTitle(e.target.value),
										placeholder: "Ví dụ: Định vị thương hiệu cá nhân & Kênh TikTok Chuyên gia Trainer Thanh Nguyên",
										className: "w-full h-11 px-3.5 bg-[#111116] rounded-lg border border-white/[0.08] text-sm font-semibold text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5",
										children: "Đường dẫn tĩnh (Slug URL)"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center bg-[#111116] border border-white/[0.08] rounded-lg px-3.5 h-10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/12 transition-all",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs text-gray-500 select-none mr-1 font-medium",
											children: "https://heona.vn/projects/"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: slug,
											onChange: (e) => setSlug(e.target.value),
											placeholder: "dinh-vi-thuong-hieu-thanh-nguyen",
											className: "flex-1 bg-transparent text-xs font-medium text-primary outline-none"
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Nhóm dịch vụ mũi nhọn"
										}), /* @__PURE__ */ jsxs("select", {
											value: category,
											onChange: (e) => setCategory(e.target.value),
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 cursor-pointer transition-all",
											children: [
												/* @__PURE__ */ jsx("option", {
													className: "bg-[#15151b] text-white",
													value: "Expert Spotlight",
													children: "Expert Spotlight (Hình ảnh chuyên gia / Giảng viên)"
												}),
												/* @__PURE__ */ jsx("option", {
													className: "bg-[#15151b] text-white",
													value: "School Story",
													children: "School Story (Nội dung thương hiệu trường học / Tuyển sinh)"
												}),
												/* @__PURE__ */ jsx("option", {
													className: "bg-[#15151b] text-white",
													value: "Event to Content",
													children: "Event to Content (Chuyển sự kiện thành tài sản truyền thông)"
												})
											]
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Khách hàng / Đối tác"
										}), /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ jsxs("select", {
												value: clientId,
												onChange: (e) => {
													setClientId(e.target.value);
													const matched = clients.find((c) => c.id === e.target.value);
													if (matched) setClientName(matched.name);
												},
												className: "w-full h-10 px-2.5 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary cursor-pointer transition-all",
												children: [/* @__PURE__ */ jsx("option", {
													className: "bg-[#15151b] text-white",
													value: "",
													children: "-- Chọn đối tác --"
												}), clients.map((c) => /* @__PURE__ */ jsx("option", {
													className: "bg-[#15151b] text-white",
													value: c.id,
													children: c.name
												}, c.id))]
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												placeholder: "Hoặc nhập tên...",
												value: clientName,
												onChange: (e) => setClientName(e.target.value),
												className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
											})]
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Lĩnh vực (Industry)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: industry,
											onChange: (e) => setIndustry(e.target.value),
											placeholder: "Ví dụ: Giáo dục & Đào tạo, EdTech...",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Địa điểm (Location)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: location,
											onChange: (e) => setLocation(e.target.value),
											placeholder: "Ví dụ: TP. Hồ Chí Minh, Toàn quốc...",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Ngày bắt đầu"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: startDate,
												onChange: (e) => setStartDate(e.target.value),
												placeholder: "01/2024",
												className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Ngày hoàn thành"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: endDate,
												onChange: (e) => setEndDate(e.target.value),
												placeholder: "Hiện tại hoặc 06/2024",
												className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Trạng thái xuất bản"
											}), /* @__PURE__ */ jsxs("select", {
												value: status,
												onChange: (e) => setStatus(e.target.value),
												className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-xs font-semibold text-white outline-none focus:border-primary cursor-pointer transition-all",
												children: [
													/* @__PURE__ */ jsx("option", {
														className: "bg-[#15151b] text-white",
														value: "published",
														children: "Đã xuất bản (Published)"
													}),
													/* @__PURE__ */ jsx("option", {
														className: "bg-[#15151b] text-white",
														value: "draft",
														children: "Bản nháp (Draft)"
													}),
													/* @__PURE__ */ jsx("option", {
														className: "bg-[#15151b] text-white",
														value: "review",
														children: "Đang xét duyệt (Review)"
													}),
													/* @__PURE__ */ jsx("option", {
														className: "bg-[#15151b] text-white",
														value: "archived",
														children: "Lưu trữ (Archived)"
													})
												]
											})] })
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "pt-3 space-y-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Ảnh bìa đại diện (Cover Image)"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col sm:flex-row items-start sm:items-center gap-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "relative w-36 h-24 rounded-lg overflow-hidden ring-1 ring-white/[0.08] bg-[#111116] shrink-0",
												children: /* @__PURE__ */ jsx("img", {
													src: coverImage,
													alt: "Cover Preview",
													className: "w-full h-full object-cover"
												})
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex-1 w-full space-y-2",
												children: [/* @__PURE__ */ jsx("div", {
													className: "flex items-center gap-2",
													children: /* @__PURE__ */ jsxs("button", {
														type: "button",
														onClick: () => {
															setMediaTarget("cover");
															setMediaPickerOpen(true);
														},
														className: "px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-white/[0.08] shrink-0",
														children: [/* @__PURE__ */ jsx(Image, { className: "w-3.5 h-3.5 text-primary" }), /* @__PURE__ */ jsx("span", { children: "Chọn ảnh từ Thư viện" })]
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: coverImage,
													onChange: (e) => setCoverImage(e.target.value),
													placeholder: "Hoặc dán URL hình ảnh...",
													className: "w-full h-9 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all"
												})]
											})]
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Video nổi bật (YouTube, Vimeo hoặc Video URL)"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center bg-[#111116] border border-white/[0.08] rounded-lg px-3 h-10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/12 transition-all",
											children: [/* @__PURE__ */ jsx(Video, { className: "w-4 h-4 text-gray-500 mr-2 shrink-0" }), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: featuredVideo,
												onChange: (e) => setFeaturedVideo(e.target.value),
												placeholder: "https://www.youtube.com/watch?v=...",
												className: "flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
											})]
										})] })]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-overview",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "02"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Tổng quan bài toán"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Bối cảnh xuất phát điểm, nút thắt thách thức và mục tiêu hướng tới"
								})] }), isSec2Valid && /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Đã nhập"]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [
									/* Card 1: Project Intro */
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-2.5 flex flex-col",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Giới thiệu ngắn dự án (Project Introduction)"
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 4,
												value: projectIntro,
												onChange: (e) => setProjectIntro(e.target.value),
												placeholder: "Tóm tắt bối cảnh và quy mô triển khai dự án trong 2-3 câu ngắn gọn...",
												className: "w-full flex-1 p-3 bg-[#0b0b0d] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
											})
										]
									}),
									/* Card 2: Client Background */
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-2.5 flex flex-col",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Bối cảnh khách hàng (Client Background)"
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 4,
												value: clientBackground,
												onChange: (e) => setClientBackground(e.target.value),
												placeholder: "Vị thế của đối tác, các hoạt động đã làm trước khi đồng hành cùng Heona...",
												className: "w-full flex-1 p-3 bg-[#0b0b0d] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
											})
										]
									}),
									/* Card 3: Challenge */
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-2.5 flex flex-col",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Thách thức gặp phải (Challenge)"
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 4,
												value: challenge,
												onChange: (e) => setChallenge(e.target.value),
												placeholder: "Những khó khăn, rào cản về định hình phong cách, kịch bản nội dung hay chuyển đổi...",
												className: "w-full flex-1 p-3 bg-[#0b0b0d] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
											})
										]
									}),
									/* Card 4: Project Goals */
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-2.5 flex flex-col",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
												children: "Mục tiêu dự án (Project Goals)"
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 4,
												value: projectGoals,
												onChange: (e) => setProjectGoals(e.target.value),
												placeholder: "Các mục tiêu cụ thể cần hoàn thành về nhận diện thương hiệu, tương tác và học viên...",
												className: "w-full flex-1 p-3 bg-[#0b0b0d] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
											})
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-solution",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "03"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Giải pháp Heona"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Các dịch vụ thực thi và chiến lược giải pháp tổng thể"
								})] }), /* @__PURE__ */ jsxs("span", {
									className: "text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full",
									children: [
										"Đã chọn ",
										selectedServices.length,
										" dịch vụ"
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
									children: "Dịch vụ triển khai (Chọn nhiều - Click để bật/tắt):"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-2",
									children: AVAILABLE_SERVICES.map((srv) => {
										const isChecked = selectedServices.includes(srv);
										return /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => toggleService(srv),
											className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isChecked ? "bg-primary text-black font-bold shadow-xs" : "bg-[#111116] text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12]"}`,
											children: [/* @__PURE__ */ jsx("span", { children: srv }), isChecked ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-black shrink-0" }) : /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3 text-gray-500 shrink-0" })]
										}, srv);
									})
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
									children: "Mô tả giải pháp & chiến lược Heona Media đã thực hiện"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 7,
									value: solutionSummary,
									onChange: (e) => setSolutionSummary(e.target.value),
									placeholder: "Mô tả cách tiếp cận độc đáo của Heona Media: Chuẩn hóa Concept cá nhân, xây dựng Content Pillar, quy trình quay dựng tinh gọn...",
									className: "w-full p-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
								})] })]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-process",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "04"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Quy trình thực hiện"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Các bước tiến hành tuần tự từ nghiên cứu đến bàn giao"
								})] }), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleAddStep,
									className: "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[13px] font-semibold rounded-lg transition-colors border border-white/[0.08]",
									children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Thêm bước mới" })]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: processSteps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
									className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] hover:border-white/[0.12] space-y-3 transition-colors",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5 flex-1 min-w-0",
											children: [/* @__PURE__ */ jsx("span", {
												className: "w-8 h-8 rounded-lg bg-white/[0.04] text-primary font-bold text-xs flex items-center justify-center shrink-0",
												children: step.stepNumber
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												placeholder: "Tiêu đề bước...",
												value: step.title,
												onChange: (e) => {
													const updated = [...processSteps];
													updated[idx].title = e.target.value;
													setProcessSteps(updated);
												},
												className: "flex-1 h-9 px-3 bg-[#0b0b0d] border border-white/[0.08] rounded-lg text-sm font-semibold text-white outline-none focus:border-primary transition-colors"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 shrink-0",
											children: [
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleMoveStep(idx, "up"),
													disabled: idx === 0,
													className: "p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors",
													title: "Di chuyển lên",
													children: /* @__PURE__ */ jsx(MoveUp, { className: "w-4 h-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleMoveStep(idx, "down"),
													disabled: idx === processSteps.length - 1,
													className: "p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors",
													title: "Di chuyển xuống",
													children: /* @__PURE__ */ jsx(MoveDown, { className: "w-4 h-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleRemoveStep(idx),
													className: "p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors",
													title: "Xóa bước này",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
												})
											]
										})]
									}), /* @__PURE__ */ jsx("textarea", {
										rows: 2,
										placeholder: "Mô tả chi tiết những công việc thực hiện trong bước này...",
										value: step.description,
										onChange: (e) => {
											const updated = [...processSteps];
											updated[idx].description = e.target.value;
											setProcessSteps(updated);
										},
										className: "w-full p-2.5 bg-[#0b0b0d] border border-white/[0.08] rounded-lg text-sm text-gray-200 outline-none focus:border-primary transition-colors"
									})]
								}, step.id || idx))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-results",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "05"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Kết quả đạt được"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Thành quả định tính, giá trị chuyển đổi và tác động sau dự án"
								})] }), isSec5Valid && /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Đã nhập"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-4",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
										children: "Kết quả đạt được (Mỗi dòng là một gạch đầu dòng):"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-gray-500",
										children: "Xuống dòng để tạo mục mới"
									})]
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 6,
									value: qualitativeText,
									onChange: (e) => setQualitativeText(e.target.value),
									placeholder: "Ví dụ:\nĐịnh vị hoàn chỉnh hình ảnh chuyên gia đào tạo chuẩn mực.\nĐịnh hình bộ tài sản Content Pillar nhất quán.\nTạo kênh thu hút học viên hoàn toàn tự nhiên.",
									className: "w-full p-3.5 bg-[#111116] rounded-xl border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12 placeholder:text-gray-600 transition-all leading-relaxed"
								})] })
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-testimonial",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "06"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Đánh giá khách hàng (Testimonial)"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs text-gray-400",
										children: "Lời nhận xét, chức danh đối tác và liên kết video phỏng vấn"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0",
										children: "★ Xuất hiện ở Trang chủ"
									})]
								})] }), isSec6Valid && /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Đã có đánh giá"]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4 p-3 bg-[#111116] rounded-xl border border-white/[0.06]",
										children: [/* @__PURE__ */ jsx("img", {
											src: testiAvatar,
											alt: "Testimonial Avatar",
											className: "w-12 h-12 rounded-full object-cover ring-1 ring-white/10 shrink-0"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 space-y-1",
											children: [/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => {
													setMediaTarget("testi");
													setMediaPickerOpen(true);
												},
												className: "px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-[13px] font-semibold text-white rounded-lg transition-colors border border-white/[0.08] inline-flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Image, { className: "w-3.5 h-3.5 text-primary" }), /* @__PURE__ */ jsx("span", { children: "Chọn ảnh đại diện" })]
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: testiAvatar,
												onChange: (e) => setTestiAvatar(e.target.value),
												placeholder: "URL ảnh đại diện...",
												className: "w-full h-8 px-1 bg-transparent border-b border-white/[0.06] text-xs text-gray-400 outline-none focus:border-primary"
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Họ tên người đánh giá"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: testiName,
											onChange: (e) => setTestiName(e.target.value),
											placeholder: "Ví dụ: Trainer Thanh Nguyên",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary transition-all"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Chức danh / Vị trí"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: testiPos,
											onChange: (e) => setTestiPos(e.target.value),
											placeholder: "Ví dụ: Giảng viên & Chuyên gia Huấn luyện",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary transition-all"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Tên công ty / Doanh nghiệp"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: testiCompany,
											onChange: (e) => setTestiCompany(e.target.value),
											placeholder: "Ví dụ: Học viện Kỹ năng Mềm",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary transition-all"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Link video phỏng vấn (Video Testimonial)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: testiVideoUrl,
											onChange: (e) => setTestiVideoUrl(e.target.value),
											placeholder: "https://youtube.com/watch?v=...",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary transition-all"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
										children: "Nội dung nhận xét / Lời chứng thực"
									}), /* @__PURE__ */ jsx("textarea", {
										rows: 4,
										value: testiContent,
										onChange: (e) => setTestiContent(e.target.value),
										placeholder: "Nhập nhận xét chân thật từ khách hàng về chất lượng dịch vụ, sự tận tâm và kết quả đạt được sau dự án...",
										className: "w-full p-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary placeholder:text-gray-600 transition-all leading-relaxed"
									})] })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-media",
							className: "scroll-mt-[90px] pb-10 border-b border-white/[0.06] space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "07"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Thư viện Media"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Hình ảnh dự án thực tế, hậu trường sản xuất và khoảnh khắc ấn tượng"
								})] }), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										setMediaTarget("gallery");
										setMediaPickerOpen(true);
									},
									className: "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[13px] font-semibold rounded-lg transition-colors border border-white/[0.08]",
									children: [/* @__PURE__ */ jsx(FolderPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Chọn từ Media Library" })]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "text",
										value: newGalleryUrl,
										onChange: (e) => setNewGalleryUrl(e.target.value),
										placeholder: "Nhập hoặc dán link URL ảnh mới vào đây...",
										className: "flex-1 h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-all",
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddGalleryImage(newGalleryUrl);
											}
										}
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleAddGalleryImage(newGalleryUrl),
										className: "h-10 px-4 bg-white/[0.06] hover:bg-white/[0.1] text-white text-[13px] font-semibold rounded-lg transition-colors shrink-0",
										children: "Thêm ảnh"
									})]
								}), gallery.length > 0 ? /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
									children: gallery.map((imgUrl, idx) => /* @__PURE__ */ jsxs("div", {
										className: "relative aspect-video rounded-xl overflow-hidden ring-1 ring-white/[0.06] bg-[#111116] group",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: imgUrl,
												alt: `Gallery ${idx + 1}`,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleRemoveGalleryImage(idx),
													className: "p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg transition-colors",
													title: "Xóa ảnh",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
												})
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "absolute bottom-1.5 left-2 text-[10px] font-medium bg-black/70 px-1.5 py-0.5 rounded text-gray-300",
												children: ["#", idx + 1]
											})
										]
									}, idx))
								}) : /* @__PURE__ */ jsxs("div", {
									className: "p-8 text-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01]",
									children: [/* @__PURE__ */ jsx(Image, { className: "w-7 h-7 text-gray-600 mx-auto mb-2" }), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-gray-400",
										children: "Chưa có hình ảnh nào trong thư viện dự án"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "sec-seo",
							className: "scroll-mt-[90px] pb-10 space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded",
										children: "08"
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-base font-bold text-white leading-snug tracking-tight",
										children: "Cấu hình SEO & Google Preview"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400",
									children: "Tối ưu thẻ tìm kiếm, từ khóa trọng tâm và hiển thị trên Google"
								})] }), isSec8Valid && /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Đã cấu hình SEO"]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#111116] rounded-xl border border-white/[0.06] space-y-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-primary" }), "Mô phỏng hiển thị trên Google Search"]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-gray-500 font-medium",
												children: "google.com"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-3.5 bg-[#202124] rounded-lg space-y-1",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx("div", {
														className: "w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary",
														children: "H"
													}), /* @__PURE__ */ jsxs("div", {
														className: "text-[11px] leading-tight text-[#bdc1c6]",
														children: [/* @__PURE__ */ jsx("span", { children: "Heona Media" }), /* @__PURE__ */ jsxs("span", {
															className: "text-[10px] text-[#9aa0a6] ml-1",
															children: ["https://heona.vn › projects › ", slug || "slug-du-an"]
														})]
													})]
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-sm sm:text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug",
													children: seoTitle || (title ? `${title} — Heona Media` : "Tiêu đề Case Study chuẩn SEO")
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-xs text-[#bdc1c6] leading-relaxed line-clamp-2",
													children: metaDesc || description || projectIntro || "Khám phá dự án truyền thông và xây dựng thương hiệu cá nhân đột phá được Heona Media triển khai với quy trình tối ưu và kết quả ấn tượng."
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300",
											children: "Tiêu đề SEO (SEO Title)"
										}), /* @__PURE__ */ jsxs("span", {
											className: `text-[11px] font-medium ${seoTitle.length >= 40 && seoTitle.length <= 65 ? "text-emerald-400 font-semibold" : seoTitle.length > 65 ? "text-rose-400 font-semibold" : "text-gray-500"}`,
											children: [seoTitle.length, "/60 ký tự"]
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: seoTitle,
										onChange: (e) => setSeoTitle(e.target.value),
										placeholder: "Ví dụ: Case Study Trainer Thanh Nguyên — Xây Dựng Thương Hiệu Triệu View | Heona Media",
										className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary placeholder:text-gray-600 transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300",
											children: "Mô tả SEO (Meta Description)"
										}), /* @__PURE__ */ jsxs("span", {
											className: `text-[11px] font-medium ${metaDesc.length >= 120 && metaDesc.length <= 160 ? "text-emerald-400 font-semibold" : metaDesc.length > 160 ? "text-rose-400 font-semibold" : "text-gray-500"}`,
											children: [metaDesc.length, "/160 ký tự"]
										})]
									}), /* @__PURE__ */ jsx("textarea", {
										rows: 3,
										value: metaDesc,
										onChange: (e) => setMetaDesc(e.target.value),
										placeholder: "Tóm tắt nội dung hấp dẫn để người tìm kiếm trên Google click vào xem Case Study...",
										className: "w-full p-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-gray-200 outline-none focus:border-primary placeholder:text-gray-600 transition-colors leading-relaxed"
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Từ khóa chính (Focus Keyword)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: focusKeyword,
											onChange: (e) => setFocusKeyword(e.target.value),
											placeholder: "Ví dụ: thương hiệu cá nhân tiktok",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary transition-colors"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1.5",
											children: "Canonical URL (Tùy chọn)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: canonicalUrl,
											onChange: (e) => setCanonicalUrl(e.target.value),
											placeholder: "https://heona.vn/projects/...",
											className: "w-full h-10 px-3 bg-[#111116] rounded-lg border border-white/[0.08] text-sm text-white outline-none focus:border-primary transition-colors"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-3.5 bg-[#111116] rounded-lg border border-white/[0.06]",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-white block",
											children: "Cho phép Google lập chỉ mục (Index Google)"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-gray-400",
											children: "Bật để bot tìm kiếm Google cào dữ liệu và xếp hạng bài viết này"
										})] }), /* @__PURE__ */ jsxs("label", {
											className: "relative inline-flex items-center cursor-pointer",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: robotsIndex,
												onChange: (e) => setRobotsIndex(e.target.checked),
												className: "sr-only peer"
											}), /* @__PURE__ */ jsx("div", { className: "w-10 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" })]
										})]
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(MediaPickerModal, {
				isOpen: mediaPickerOpen,
				onClose: () => setMediaPickerOpen(false),
				onSelect: (url) => {
					if (mediaTarget === "cover") setCoverImage(url);
					else if (mediaTarget === "testi") setTestiAvatar(url);
					else if (mediaTarget === "gallery") setGallery((prev) => [...prev, url]);
					showToast("Đã cập nhật hình ảnh", "success");
				}
			}),
			previewOpen && typeof document !== "undefined" && createPortal(/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fade-in",
				onClick: (e) => {
					if (e.target === e.currentTarget) setPreviewOpen(false);
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-[#111116] border border-white/[0.08] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white my-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#0b0b0d]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-gray-200 uppercase tracking-wider",
									children: "Xem trước Case Study"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-gray-500 hidden sm:inline font-medium",
									children: "(ESC để đóng)"
								})
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setPreviewOpen(false),
							className: "text-xs px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold rounded-lg transition-colors flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Đóng" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 overflow-y-auto p-6 md:p-8 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "px-3 py-1 bg-primary/20 text-primary font-semibold text-xs rounded-full",
										children: category
									}),
									clientName && /* @__PURE__ */ jsxs("span", {
										className: "px-3 py-1 bg-white/[0.04] text-gray-300 font-medium text-xs rounded-full",
										children: ["Khách hàng: ", clientName]
									}),
									industry && /* @__PURE__ */ jsx("span", {
										className: "px-3 py-1 bg-white/[0.04] text-gray-400 text-xs rounded-full",
										children: industry
									}),
									location && /* @__PURE__ */ jsxs("span", {
										className: "px-3 py-1 bg-white/[0.04] text-gray-400 text-xs rounded-full",
										children: ["📍 ", location]
									})
								]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl md:text-3xl font-black text-white leading-tight",
								children: title || "Tên dự án chưa đặt"
							}),
							(description || projectIntro) && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-gray-300 leading-relaxed italic border-l-2 border-primary pl-4 py-1",
								children: description || projectIntro
							}),
							coverImage && /* @__PURE__ */ jsx("div", {
								className: "relative rounded-xl overflow-hidden ring-1 ring-white/[0.08]",
								children: /* @__PURE__ */ jsx("img", {
									src: coverImage,
									alt: title,
									className: "w-full h-72 md:h-96 object-cover"
								})
							}),
							(clientBackground || challenge || projectGoals) && /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-3 pt-2",
								children: [
									clientBackground && /* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#0b0b0d] rounded-xl space-y-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-primary uppercase",
											children: "Bối cảnh"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-300 leading-relaxed",
											children: clientBackground
										})]
									}),
									challenge && /* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#0b0b0d] rounded-xl space-y-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-rose-400 uppercase",
											children: "Thách thức"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-300 leading-relaxed",
											children: challenge
										})]
									}),
									projectGoals && /* @__PURE__ */ jsxs("div", {
										className: "p-4 bg-[#0b0b0d] rounded-xl space-y-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-emerald-400 uppercase",
											children: "Mục tiêu"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-300 leading-relaxed",
											children: projectGoals
										})]
									})
								]
							}),
							selectedServices.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-white/[0.02] space-y-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold text-gray-300",
									children: "Dịch vụ triển khai:"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5",
									children: selectedServices.map((srv, idx) => /* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-md bg-primary/15 text-primary text-xs font-semibold",
										children: srv
									}, idx))
								})]
							}),
							solutionSummary && /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-[#0b0b0d] space-y-1",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold text-gray-300 uppercase",
									children: "Chiến lược & Giải pháp:"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-300 leading-relaxed",
									children: solutionSummary
								})]
							}),
							processSteps.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold uppercase tracking-wider text-gray-400",
									children: "Quy trình thực hiện"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: processSteps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
										className: "p-3.5 bg-white/[0.02] rounded-xl space-y-1",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-xs font-bold text-primary",
											children: [
												step.stepNumber,
												". ",
												step.title
											]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-400",
											children: step.description
										})]
									}, idx))
								})]
							}),
							results.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold uppercase tracking-wider text-gray-400",
									children: "Kết Quả Đạt Được (KPIs)"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-white/[0.06]",
									children: results.map((r, i) => /* @__PURE__ */ jsxs("div", {
										className: "text-center p-3 bg-white/[0.02] rounded-xl",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-2xl font-black text-primary",
											children: r.number || "---"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-400 mt-1",
											children: r.label || "Chỉ số"
										})]
									}, i))
								})]
							}),
							qualitativeText && /* @__PURE__ */ jsxs("div", {
								className: "p-4 bg-white/[0.02] rounded-xl space-y-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold uppercase tracking-wider text-gray-300",
									children: "Thành quả định tính:"
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-1 text-xs text-gray-300 list-disc list-inside",
									children: qualitativeText.split("\n").filter(Boolean).map((line, idx) => /* @__PURE__ */ jsx("li", { children: line }, idx))
								})]
							}),
							gallery.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold uppercase tracking-wider text-gray-400",
									children: "Hình ảnh dự án (Gallery)"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-3 gap-2",
									children: gallery.map((img, idx) => /* @__PURE__ */ jsx("img", {
										src: img,
										alt: "gallery preview",
										className: "w-full aspect-video object-cover rounded-lg ring-1 ring-white/[0.06]"
									}, idx))
								})]
							}),
							testiName && /* @__PURE__ */ jsxs("div", {
								className: "p-5 bg-[#0b0b0d] rounded-xl flex flex-col sm:flex-row gap-4 items-start",
								children: [/* @__PURE__ */ jsx("img", {
									src: testiAvatar,
									alt: testiName,
									className: "w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-white/10"
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1 flex-1",
									children: [
										/* @__PURE__ */ jsxs("p", {
											className: "text-sm italic text-gray-200 leading-relaxed",
											children: [
												"\"",
												testiContent || "Đánh giá từ khách hàng...",
												"\""
											]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-white pt-1",
											children: testiName
										}),
										/* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-gray-400",
											children: [
												testiPos,
												" ",
												testiCompany ? `• ${testiCompany}` : ""
											]
										})
									]
								})]
							})
						]
					})]
				})
			}), document.body)
		]
	});
};
export default ProjectEditor;