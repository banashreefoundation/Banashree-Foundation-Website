import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Program, Project, Event } from "../../services/apiService";
import { getDynamicContent } from "./dynamicContent";
import { SERVER_BASE } from "@/utils/imageApi";
import ImageWithFallback from "@/components/ImageWithFallback";

interface AboutAndProgramsSectionProps {
  programs: Program[];
  projects: Project[];
  events: Event[];
  loading: boolean;
  error: string | null;
}

export default function AboutAndProgramsSection({ 
  programs: propPrograms, 
  projects: propProjects, 
  events: propEvents,
  loading: propLoading, 
  error: propError 
}: AboutAndProgramsSectionProps) {
	// Call getDynamicContent inside the component so it runs after cache is loaded
	const dynamicContent = useMemo(() => getDynamicContent(), []);
	
	const [programs, setPrograms] = useState<Program[]>(propPrograms);
	const [projects, setProjects] = useState<Project[]>(propProjects);
	const [events, setEvents] = useState<Event[]>(propEvents);
	const [loading, setLoading] = useState(propLoading);
	const [error, setError] = useState<string | null>(propError);
	
	// Ref for events carousel
	const eventsScrollRef = useRef<HTMLDivElement>(null);
	
	// Common limit for programs, projects, and events
	const ITEMS_LIMIT = 2;

	// Update state when props change
	useEffect(() => {
		setPrograms(propPrograms);
		setProjects(propProjects);
		setEvents(propEvents);
		setLoading(propLoading);
		setError(propError);
	}, [propPrograms, propProjects, propEvents, propLoading, propError]);

	// Helper function to get image for program
	const getProgramImageSrc = (program: Program) => {
		// First priority: Use first image from media.images array if it exists
		if (program.media?.images && program.media.images.length > 0) {
			const firstImage = program.media.images[0];
			if (firstImage.startsWith('http')) {
				return firstImage;
			}
			if (firstImage.startsWith('/uploads')) {
				return `${SERVER_BASE}${firstImage}`;
			}
			return firstImage;
		}
		
		// Second priority: Use deprecated image field if it exists
		if (program.image) {
			if (program.image.startsWith('http')) {
				return program.image;
			}
			if (program.image.startsWith('/uploads')) {
				return `${SERVER_BASE}${program.image}`;
			}
			return program.image;
		}
		
		// Return empty string - ImageWithFallback will handle the fallback
		return '';
	};

	// Helper function to get image for project
	const getProjectImageSrc = (project: Project) => {
		// First priority: Use image from API response if it exists
		if (project.image) {
			if (project.image.startsWith('http')) {
				return project.image;
			}
			if (project.image.startsWith('/uploads')) {
				return `${SERVER_BASE}${project.image}`;
			}
			return project.image;
		}
		
		// Return empty string - ImageWithFallback will handle the fallback
		return '';
	};

	// Helper function to format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	// Helper function to get background color for event card
	const getEventBgColor = (index: number) => {
		const colors = ["#09AC8E", "#8C1201", "#D09C1F"];
		return colors[index % colors.length];
	};

	// Scroll function for events carousel
	const scrollEvents = (direction: 'left' | 'right') => {
		if (!eventsScrollRef.current) return;
		const container = eventsScrollRef.current;
		const cardWidth = 476; // Updated width for larger cards (450px + gap)
		container.scrollBy({ 
			left: direction === "left" ? -cardWidth : cardWidth, 
			behavior: "smooth" 
		});
	};

	return (
		<div className="bg-white">
			{/* Events Section */}
			<section className="bg-[#FFF5F5] py-4 border-t-4 border-white">
				<div className="w-full px-4">
					{loading ? (
						<div className="flex justify-center items-center h-32">
							<div className="text-lg">Loading events...</div>
						</div>
					) : (
						<div className="relative w-full">
							{events.length > 0 ? (
								<>
									{/* Navigation Buttons */}
									<button
										onClick={() => scrollEvents("left")}
										className="absolute z-30 -left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all duration-200 hover:scale-110"
									>
										<ChevronLeft className="w-8 h-8 text-[#830f00]" />
									</button>
									<button
										onClick={() => scrollEvents("right")}
										className="absolute z-30 -right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all duration-200 hover:scale-110"
									>
										<ChevronRight className="w-8 h-8 text-[#830f00]" />
									</button>

									{/* Scrollable Events */}
									<div 
										ref={eventsScrollRef}
										className="flex gap-6 overflow-x-auto pb-4 px-20" 
										style={{ 
											scrollbarWidth: 'none', 
											msOverflowStyle: 'none',
											scrollSnapType: 'x mandatory'
										}}
									>
										{events.map((event, idx) => (
											<div 
												key={event._id || idx} 
												className="flex-none w-[450px] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-8 border border-gray-200/50 relative mt-4 backdrop-blur-sm flex flex-col"
												style={{ 
													scrollSnapAlign: 'start',
													background: `linear-gradient(135deg, ${getEventBgColor(idx)}15 0%, ${getEventBgColor(idx)}08 50%, white 100%)`,
													boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 4px 15px rgba(${getEventBgColor(idx).slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(',')}, 0.2)`,
													minHeight: '330px',
													maxHeight: '330px'
												}}
											>
												{/* Focus Area Tag - Enhanced with glow effect */}
												<span 
													className="absolute -top-3 left-4 text-sm text-white px-4 py-2 rounded-lg shadow-lg z-10 font-medium"
													style={{ 
														backgroundColor: getEventBgColor(idx),
														boxShadow: `0 4px 15px rgba(${getEventBgColor(idx).slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(',')}, 0.4)`
													}}
												>
													{event.focusAreas}
												</span>
												
												<div className="flex items-center gap-4 mb-4 mt-4">
													<h4 className="font-bold text-xl leading-tight line-clamp-2" style={{ color: getEventBgColor(idx) }}>
														{event.title}
													</h4>
												</div>
												<div className="mb-3 space-y-2">
													<p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
														📅 <span className="font-semibold truncate">{formatDate(event.startDateTime)}</span>
													</p>
													<p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
														📍 <span className="font-semibold line-clamp-1">{event.venue}</span>
													</p>
													<p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
														🎯 <span className="font-semibold line-clamp-1">{event.targetAudience}</span>
													</p>
												</div>
												<p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
													{event.description}
												</p>
												<div className="flex justify-between items-center mt-auto">
													<a href="#events">
														<p 
															className="text-sm font-semibold cursor-pointer hover:underline transition-all duration-200 hover:scale-105"
															style={{ color: getEventBgColor(idx) }}
														>
															Show More &gt;&gt;
														</p>
													</a>
												</div>
											</div>
										))}
									</div>
								</>
							) : (
								// Fallback message when no events data
								<div className="text-center py-8">
									<p className="text-gray-600">No upcoming events at the moment. Check back soon!</p>
								</div>
							)}
						</div>
					)}

					{/* View All Button */}
					<div className="text-center mt-10">
						<a href="#events">
						<Button className="bg-[#830f00] text-white px-6 py-2 rounded-md">
							View All
						</Button>
						</a>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="max-w-6xl mx-auto px-4 pt-20 pb-8 flex flex-col lg:flex-row justify-between items-center gap-10" style={{ scrollMarginTop: '100px' }}>
				<div className="lg:w-1/2">
					<p className="text-[#830f00] font-medium text-2xl mb-2 font-maku" style={{ fontFamily: 'Maku, sans-serif' }}>{dynamicContent.aboutData.subHeading}</p>
					{/* <h2 className="text-3xl lg:text-4xl font-bold text-[#41402c] mb-4 whitespace-pre-line">
						{dynamicContent.aboutData.heading}
					</h2> */}
		    	<p
					className="text-gray-700 text-base leading-relaxed mb-6"
					dangerouslySetInnerHTML={{
						__html: dynamicContent.aboutData.description.replace(/\n\n/g, "<br /><br />")
					}}
					/>

					{/* <Button className="bg-[#830f00] text-white px-6 py-2 rounded-md">Read More</Button> */}
				</div>

				<div className="lg:w-1/2">
					<div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-xl shadow-lg">
						<iframe
							className="w-full h-[50vh]"
							src={dynamicContent.aboutData.videoUrl}
							title="About Us Video"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
				</div>
			</section>

			{/* Vision & Mission Section */}
			<section className="bg-gradient-to-br from-[#830f00]/5 via-white to-[#830f00]/5 py-16 border-t-4 border-white">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center mb-12">
						<p className="text-[#830f00] font-medium text-3xl mb-2 font-maku" style={{ fontFamily: 'Maku, sans-serif' }}>Our Vision & Mission</p>
						<h3 className="text-2xl lg:text-2xl font-bold text-[#41402c]">
							Guiding Our Path Forward
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Vision Card */}
						<div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-8 border-t-4 border-[#09AC8E]">
							<div className="flex items-center gap-4 mb-6">
								<div className="bg-gradient-to-br from-[#09AC8E] to-[#09AC8E]/70 p-4 rounded-full">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</div>
								<h4 className="text-2xl font-bold text-[#09AC8E]">Our Vision</h4>
							</div>
							<p className="text-gray-700 text-base leading-relaxed">
								{dynamicContent.aboutData["Our Vision"]}
							</p>
						</div>

						{/* Mission Card */}
						<div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-8 border-t-4 border-[#830f00]">
							<div className="flex items-center gap-4 mb-6">
								<div className="bg-gradient-to-br from-[#830f00] to-[#830f00]/70 p-4 rounded-full">
									<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h4 className="text-2xl font-bold text-[#830f00]">Our Mission</h4>
							</div>
							<p className="text-gray-700 text-base leading-relaxed">
								{dynamicContent.aboutData["Our Mission"]}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Programs Section */}
			<section className="bg-[#FFF5F5] py-16">
				<div className="max-w-6xl mx-auto px-4">
					<p className="text-[#830f00] font-medium text-3xl mb-2 font-maku" style={{ fontFamily: 'Maku, sans-serif' }}>Our Programs</p>
					<h3 className="text-2xl lg:text-2xl font-bold text-[#41402c] mb-8 ">
						{dynamicContent.aboutData.heading}
					</h3>

					{error && (
						<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
							{error}
						</div>
					)}

					{loading ? (
						<div className="flex justify-center items-center h-32">
							<div className="text-lg">Loading programs...</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							{programs.length > 0 ? (
								programs.slice(0, ITEMS_LIMIT).map((program, idx) => (
									<div key={program._id || idx}>
										<div className="flex items-center gap-3 text-[#8B1201] mb-1">
											<ImageWithFallback
												src={getProgramImageSrc(program)}
												alt={program.title}
												className="h-12 w-12 mt-3 object-cover rounded"
												fallbackType="program"
											/>
											<h4 className="font-bold text-3xl">{program.title}</h4>
										</div>
										<p className="ml-16 text-gray-700 text-sm">{program.detailedDescription}</p>
										<a href="#programs">
											<p className="ml-16 text-[#8B1201] text-sm font-medium mt-1 cursor-pointer hover:underline">Read More &gt;&gt;</p>
										</a>
									</div>
								))
							) : (
								// Show no data message when no programs available
								<div className="col-span-2 text-center py-8">
									<p className="text-gray-600 text-lg">No programs available at the moment.</p>
									<p className="text-gray-500 text-sm mt-2">Please check back later for updates.</p>
								</div>
							)}
						</div>
					)}

					{/* View All Button */}
					<div className="text-center mt-10">
						<a href="#programs">
						<Button className="bg-[#830f00] text-white px-6 py-2 rounded-md">
							View All
						</Button>
						</a> 
					</div>
				</div>
			</section>


				{/* Projects Section */}
			<section className="bg-[#FFF5F5] py-16 border-t-4 border-white">
				<div className="max-w-6xl mx-auto px-4">
					<p className="text-[#830f00] font-medium text-3xl mb-2 font-maku" style={{ fontFamily: 'Maku, sans-serif' }}>Our Projects</p>
					<h3 className="text-2xl lg:text-2xl font-bold text-[#41402c] mb-8 ">
						{dynamicContent.aboutData.heading}
					</h3>

					{loading ? (
						<div className="flex justify-center items-center h-32">
							<div className="text-lg">Loading projects...</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							{projects.length > 0 ? (
								projects.slice(0, ITEMS_LIMIT).map((project, idx) => (
									<div key={project._id || idx}>
										<div className="flex items-center gap-3 text-[#8B1201] mb-1">
											<ImageWithFallback
												src={getProjectImageSrc(project)}
												alt={project.projectName}
												className="h-12 w-12 mt-3 object-cover rounded"
												fallbackType="project"
											/>
											<h4 className="font-bold text-3xl">{project.projectName}</h4>
										</div>
										<p className="ml-16 text-gray-700 text-sm">{project.projectDescription}</p>
										<a href="#projects">
											<p className="ml-16 text-[#8B1201] text-sm font-medium mt-1 cursor-pointer hover:underline">Read More &gt;&gt;</p>
										</a>
									</div>
								))
							) : (
								// Show no data message when no projects available
								<div className="col-span-2 text-center py-8">
									<p className="text-gray-600 text-lg">No projects available at the moment.</p>
									<p className="text-gray-500 text-sm mt-2">Please check back later for updates.</p>
								</div>
							)}
						</div>
					)}

					{/* View All Button */}
					<div className="text-center mt-10">
						<a href="#projects">
						<Button className="bg-[#830f00] text-white px-6 py-2 rounded-md">
							View All
						</Button>
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}


