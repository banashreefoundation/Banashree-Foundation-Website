import { useState, useEffect } from "react";
import { Heart, LayoutGrid, List, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Project } from "../../services/apiService";
import ImageWithFallback from "@/components/ImageWithFallback";
import { SERVER_BASE } from "@/utils/imageApi";
import SectionHeroCarousel from "./SectionHeroCarousel";

type ViewMode = 'card' | 'list';

const categories = [
    "All",
    "Animal Welfare And Rescue",
    "Elderly Care",
    "Water Conservation",
    "Child Care And Education",
    "Farmer Empowerment",
    "Community Building, Cultural & Social Upliftment",
    "Gurukul Systems",
];

interface ProjectCardsWithFilterProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

 

export default function ProjectCardsWithFilter({ 
  projects: propProjects, 
  loading: propLoading, 
  error: propError 
}: ProjectCardsWithFilterProps) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [projects, setProjects] = useState<Project[]>(propProjects);
    const [loading, setLoading] = useState(propLoading);
    const [error, setError] = useState<string | null>(propError);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Show 4 projects per page

    // Check for category from header navigation
    useEffect(() => {
        const savedCategory = sessionStorage.getItem('selectedProjectCategory');
        if (savedCategory && savedCategory !== activeFilter) {
            setActiveFilter(savedCategory);
            setCurrentPage(1); // Reset to first page when filter changes
            // Clear it after applying
            sessionStorage.removeItem('selectedProjectCategory');
        }
    }, [activeFilter]);

    // Listen for changes from header menu even when already on projects page
    useEffect(() => {
        const handleStorageChange = () => {
            const savedCategory = sessionStorage.getItem('selectedProjectCategory');
            if (savedCategory) {
                setActiveFilter(savedCategory);
                setCurrentPage(1);
                sessionStorage.removeItem('selectedProjectCategory');
                // Scroll to top of projects section
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        // Check every 100ms for category changes (when user clicks submenu)
        const interval = setInterval(handleStorageChange, 100);
        
        return () => clearInterval(interval);
    }, []);

    // Update state when props change
    useEffect(() => {
        setProjects(propProjects);
        setLoading(propLoading);
        setError(propError);
    }, [propProjects, propLoading, propError]);

    // Use fallback data if API fails and no projects provided
    useEffect(() => {
        if (propError && propProjects.length === 0) {
            setProjects([]);
        }
    }, [propError, propProjects]);

    // Helper function to get image for project
    const getProjectImageForIndex = (project: Project) => {
        // First priority: Use image from API response if it exists
        if (project.image) {
            // If it's a full URL (starts with http), use it directly
            if (project.image.startsWith('http')) {
                return project.image;
            }
            // If it's a database image path (starts with /uploads), prepend server URL
            if (project.image.startsWith('/uploads')) {
                return `${SERVER_BASE}${project.image}`;
            }
            // Otherwise use it as is
            return project.image;
        }
        
        // Fallback: If no image in API response, show "no image" placeholder
        return '/images/project-placeholder.svg';
    };

    // Helper function to get category from program field
    const getProjectCategory = (project: Project) => {
        const program = project.program || "Other";
        
        // Map API program names to filter categories
        const categoryMap: { [key: string]: string } = {
            "Animal Welfare": "Animal Welfare And Rescue",
            "Animal Welfare & Rescue": "Animal Welfare And Rescue", 
            "Animal Welfare And Rescue": "Animal Welfare And Rescue",
            "Elderly Care": "Elderly Care",
            "Water Conservation": "Water Conservation",
            "Child Care": "Child Care And Education",
            "Child Care & Education": "Child Care And Education",
            "Child Care And Education": "Child Care And Education",
            "Farmer Empowerment": "Farmer Empowerment",
            "Community Building": "Community Building, Cultural & Social Upliftment",
            "Community Building, Cultural & Social Upliftment": "Community Building, Cultural & Social Upliftment",
            "Gurukul Systems": "Gurukul Systems"
        };

        // Try exact match first
        if (categoryMap[program]) {
            return categoryMap[program];
        }

        // Try partial match
        for (const [key, value] of Object.entries(categoryMap)) {
            if (program.toLowerCase().includes(key.toLowerCase()) || 
                key.toLowerCase().includes(program.toLowerCase())) {
                return value;
            }
        }

        return program; // Return original if no match found
    };

    // Helper function to get shortened tag for program/category
    const getShortenedProgramTag = (program: string) => {
        const tagMap: { [key: string]: string } = {
            "Animal Welfare And Rescue": "AW",
            "Animal Welfare & Rescue": "AW",
            "Animal Welfare": "AW",
            "Elderly Care": "EC",
            "Water Conservation": "WC",
            "Child Care And Education": "EDU",
            "Child Care & Education": "EDU",
            "Child Care": "EDU",
            "Farmer Empowerment": "FE",
            "Community Building, Cultural & Social Upliftment": "CB",
            "Community Building": "CB",
            "Gurukul Systems": "GS",
            "Gurukul": "GS"
        };

        // Try to find a match
        for (const [key, value] of Object.entries(tagMap)) {
            if (program.includes(key) || key.includes(program)) {
                return value;
            }
        }

        // Return first 3 letters if no match
        return program.substring(0, 3).toUpperCase();
    };

    // Filter projects based on active filter
    const filteredProjects = activeFilter === "All" 
        ? projects 
        : projects.filter((p) => {
            const category = getProjectCategory(p);
            console.log(`Filtering: activeFilter="${activeFilter}", project.program="${p.program}", category="${category}"`);
            return category === activeFilter;
        });

    console.log('ProjectsView: Filtered projects count:', filteredProjects.length);

    // If no API data, show empty state instead of fallback since structure doesn't match
    const displayProjects = projects.length > 0 ? filteredProjects : [];

    // Pagination calculations
    const totalPages = Math.ceil(displayProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProjects = displayProjects.slice(startIndex, endIndex);

    // Reset to first page when filter or projects change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, displayProjects.length]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            {/* Hero Section with Header Overlay */}
            <div className="relative">
                <SectionHeroCarousel section="projects" />
            </div>
            
            {/* Projects Content */}
            <div className="bg-[#fff5f5] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header with View Toggle */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[#830f00] font-medium text-3xl mb-2 font-maku"
                                style={{ fontFamily: "Maku, sans-serif" }}>
                                Our Projects
                            </div>
                            <p className="text-2xl font-semibold mb-1">Experience innovation, learning,</p>
                            <p className="text-2xl font-semibold">and connection through our curated projects.</p>
                        </div>
                        
                        {/* View Toggle Buttons */}
                        <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-3 rounded-md transition-all duration-200 ${
                                    viewMode === 'card' 
                                        ? 'bg-[#830f00] text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Card View"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-md transition-all duration-200 ${
                                    viewMode === 'list' 
                                        ? 'bg-[#830f00] text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="List View"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                {error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading projects...</div>
                    </div>
                ) : (
                    <>
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 rounded-full border ${activeFilter === cat
                                            ? "bg-[#7f1d1d] text-white"
                                            : "text-[#7f1d1d] border-[#7f1d1d]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Cards/List */}
                        {viewMode === 'card' ? (
                          // Card View - Original space-y layout with original styling
                          <div className="space-y-12">
                            {displayProjects.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg">
                                        No projects found for "{activeFilter}" category.
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Try selecting "All" to see all available projects.
                                    </p>
                                </div>
                            ) : (
                                currentProjects.map((p, idx) => (
                                    <div
                                        key={p._id || idx}
                                        className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col md:flex-row border border-gray-200/50 relative mt-4 backdrop-blur-sm"
                                        style={{ 
                                            background: `linear-gradient(135deg, #830f0015 0%, #830f0008 50%, white 100%)`,
                                            boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 4px 15px rgba(131, 15, 0, 0.2)`,
                                            overflow: "visible"
                                        }}
                                    >
                                        <div className="relative md:w-[40%] h-80">
                                            <ImageWithFallback
                                                src={getProjectImageForIndex(p)}
                                                alt={p.projectName}
                                                className="object-cover w-full h-full rounded-l-xl"
                                                fallbackType="project"
                                            />
                                            {/* Enhanced Program Category Tag */}
                                            <span
                                                className="absolute top-4 -left-6 text-sm text-white px-4 py-2 rounded-lg shadow-lg z-10 font-medium bg-[#830f00]"
                                                style={{ 
                                                    boxShadow: `0 4px 15px rgba(131, 15, 0, 0.4)`
                                                }}
                                            >
                                                {p.program}
                                            </span>
                                        </div>
                                        <div className="p-6 md:w-[60%] flex flex-col relative z-10 justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#830f00] mb-2 leading-tight">
                                                    {p.projectName}
                                                </h3>
                                                <p className="italic text-sm mb-3 text-gray-600 font-medium">
                                                    {p.tagLine}
                                                </p>

                                                {/* Details with enhanced styling */}
                                                <div className="text-xs space-y-2 mt-3">
                                                    <p className="flex items-start gap-2">
                                                        <span className="font-bold text-[#830f00] min-w-fit">🎯 Objective:</span> 
                                                        <span className="text-gray-700 text-xs">{p.projectObjective}</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <span className="font-bold text-[#830f00] min-w-fit">🤝 Partners:</span> 
                                                        <span className="text-gray-700 text-xs">{p.collaboratingPartners}</span>
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-700 mt-3 mb-3 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto">
                                                    {p.projectDescription}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-auto">
                                                <div className="flex gap-3">
                                                    <Link to={`/project/${p._id}`} className="flex-1">
                                                        <button className="w-full bg-white border-2 border-[#830f00] text-[#830f00] py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#830f00] hover:text-white transition-all duration-300 hover:scale-105">
                                                            <ExternalLink size={16} />
                                                            Learn More
                                                        </button>
                                                    </Link>
                                                    <a href="#contribute" className="flex-1">
                                                        <button className="w-full bg-gradient-to-r from-[#830f00] to-[#8B1201] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                                            <Heart size={16} className="text-white" />
                                                            Donate Now
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                          </div>
                        ) : (
                          // List View - Compact 2-column grid
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displayProjects.length === 0 ? (
                                <div className="text-center py-12 col-span-full">
                                    <p className="text-gray-600 text-lg">
                                        No projects found for "{activeFilter}" category.
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Try selecting "All" to see all available projects.
                                    </p>
                                </div>
                            ) : (
                                currentProjects.map((p, idx) => (
                                    <div
                                        key={p._id || idx}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex border border-gray-100 overflow-hidden"
                                    >
                                        <div className="relative w-32 h-full flex-shrink-0">
                                            <ImageWithFallback
                                                src={getProjectImageForIndex(p)}
                                                alt={p.projectName}
                                                className="object-cover w-full h-full"
                                                fallbackType="project"
                                            />
                                            <span className="absolute top-2 left-2 text-xs text-white px-2 py-1 rounded-md bg-[#830f00] font-bold shadow-md"
                                                title={p.program}
                                            >
                                                {getShortenedProgramTag(p.program)}
                                            </span>
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#830f00] mb-1 line-clamp-1">
                                                    {p.projectName}
                                                </h3>
                                                <p className="text-xs font-medium text-gray-600 italic mb-2 line-clamp-1">
                                                    {p.tagLine}
                                                </p>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <span className="text-base">🎯</span>
                                                    <p className="text-xs text-gray-700 line-clamp-1">{p.projectObjective}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/project/${p._id}`}>
                                                    <Button 
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-[#830f00] text-[#830f00] hover:bg-[#830f00] hover:text-white text-xs px-3 py-1 flex items-center gap-1"
                                                    >
                                                        <ExternalLink size={12} />
                                                        View
                                                    </Button>
                                                </Link>
                                                <a href="#contribute">
                                                    <Button 
                                                        size="sm"
                                                        className="bg-[#830f00] text-white hover:bg-[#6b0d00] text-xs px-3 py-1 flex items-center gap-1"
                                                    >
                                                        <Heart size={12} fill="white" />
                                                        Donate
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                          </div>
                        )}

                        {/* Pagination Controls */}
                        {displayProjects.length > 0 && totalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 mt-12 mb-8">
                                {/* Page Info Card */}
                                <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">Page</span>
                                        <div className="bg-[#830f00] text-white font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
                                            {currentPage}
                                        </div>
                                        <span className="text-sm text-gray-600">of</span>
                                        <div className="bg-gray-100 text-gray-700 font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
                                            {totalPages}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#830f00] text-white hover:bg-[#6b0d00] shadow-md hover:shadow-lg hover:scale-105'
                                        }`}
                                    >
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">Previous</span>
                                    </Button>

                                    {/* Showing info */}
                                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
                                        <span className="text-red-700 text-sm font-medium">
                                            {startIndex + 1}-{Math.min(endIndex, displayProjects.length)} of {displayProjects.length}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#830f00] text-white hover:bg-[#6b0d00] shadow-md hover:shadow-lg hover:scale-105'
                                        }`}
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>

                                {/* Mobile showing info */}
                                <div className="sm:hidden flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
                                    <span className="text-red-700 text-xs font-medium">
                                        Showing {startIndex + 1}-{Math.min(endIndex, displayProjects.length)} of {displayProjects.length}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
}
