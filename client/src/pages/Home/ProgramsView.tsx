import { useState, useEffect } from "react";
import { Heart, LayoutGrid, List, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Program } from "../../services/apiService";
import ImageWithFallback from "@/components/ImageWithFallback";
import { SERVER_BASE } from "@/utils/imageApi";
import SectionHeroCarousel from "./SectionHeroCarousel";

type ViewMode = 'card' | 'list';

interface ProgramsViewProps {
  programs: Program[];
  loading: boolean;
  error: string | null;
}

// Helper function to get image URL or fallback
const getImageSrc = (program: Program) => {
  // First priority: Use first image from media.images array if it exists
  if (program.media?.images && program.media.images.length > 0) {
    const firstImage = program.media.images[0];
    // If it's a full URL (starts with http), use it directly
    if (firstImage.startsWith('http')) {
      return firstImage;
    }
    // If it's a database image path (starts with /uploads), prepend server URL
    if (firstImage.startsWith('/uploads')) {
      return `${SERVER_BASE}${firstImage}`;
    }
    // Otherwise use it as is
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
  
  // Fallback: If no image in API response, show "no image" placeholder
  return '/images/program-placeholder.svg';
};

export default function ProgramsView({ 
  programs: propPrograms, 
  loading: propLoading, 
  error: propError 
}: ProgramsViewProps) {
  const [programs, setPrograms] = useState<Program[]>(propPrograms);
  const [loading, setLoading] = useState(propLoading);
  const [error, setError] = useState<string | null>(propError);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Show 4 programs per page

    // Update state when props change
    useEffect(() => {
        setPrograms(propPrograms);
        setLoading(propLoading);
        setError(propError);
    }, [propPrograms, propLoading, propError]);  // Pagination calculations
  const totalPages = Math.ceil(programs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = programs.slice(startIndex, endIndex);

  // Reset to first page when programs change
  useEffect(() => {
    setCurrentPage(1);
  }, [programs.length]);

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

  if (loading) {
    return (
      <div className="bg-[#fff5f5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading programs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section with Header Overlay */}
      <div className="relative">
        <SectionHeroCarousel section="programs" />
      </div>
      
      {/* Programs Content */}
      <div className="bg-[#fff5f5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with View Toggle */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="text-[#830f00] font-medium text-3xl mb-2 font-maku"
                  style={{ fontFamily: "Maku, sans-serif" }}>
                Our Programs
              </div>
              <p className="text-2xl font-semibold mb-1">Transforming Communities,</p>
              <p className="text-2xl font-semibold">Inspiring Lives</p>
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

        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No programs available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later for updates.</p>
          </div>
        ) : (
          <>
            {viewMode === 'card' ? (
              // Card View - Full-width horizontal cards
              <div className="space-y-12">
                {currentPrograms.map((p, idx) => (
                  <div
                    key={p._id || idx}
                    className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col md:flex-row border border-gray-200/50 relative backdrop-blur-sm"
                    style={{ 
                      background: `linear-gradient(135deg, #830f0015 0%, #830f0008 50%, white 100%)`,
                      boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 4px 15px rgba(131, 15, 0, 0.2)`,
                      overflow: "visible"
                    }}
                  >
                    <div className="relative md:w-1/3">
                      <ImageWithFallback
                        src={getImageSrc(p)}
                        alt={p.title}
                        className="w-full h-80 object-cover rounded-l-xl"
                        fallbackType="program"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow md:w-2/3 relative z-10 justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-[#830f00] mb-2 leading-tight">
                          {p.title}
                        </h3>
                        <p className="italic text-base mb-4 text-gray-600 font-medium">{p.tagline}</p>

                        <div className="text-sm mt-4 space-y-2">
                          <p className="flex items-start gap-2">
                            <span className="font-bold text-[#830f00] min-w-fit">🎯 Goal:</span> 
                            <span className="text-gray-700">{p.goal}</span>
                          </p>
                        </div>

                        <hr className="my-4 border-gray-300" />

                        <p className="text-base text-gray-700 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto">{p.detailedDescription}</p>
                      </div>

                      <div className="mt-auto">
                        <div className="flex gap-3">
                          <Link to={`/program/${p._id}`} className="flex-1">
                            <button className="w-full bg-white border-2 border-[#830f00] text-[#830f00] py-3 px-6 rounded-lg flex items-center justify-center gap-3 text-base font-medium hover:bg-[#830f00] hover:text-white transition-all duration-300 hover:scale-105">
                              <ExternalLink size={18} />
                              Learn More
                            </button>
                          </Link>
                          <a href="#contribute" className="flex-1"> 
                            <button className="w-full bg-gradient-to-r from-[#830f00] to-[#8B1201] text-white py-3 px-6 rounded-lg flex items-center justify-center gap-3 text-base font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <Heart size={18} className="text-white" />
                              Donate Now
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View - Compact 2-column grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPrograms.map((p, idx) => (
                  <div
                    key={p._id || idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex border border-gray-100 overflow-hidden"
                  >
                    <div className="relative w-32 h-full flex-shrink-0">
                      <ImageWithFallback
                        src={getImageSrc(p)}
                        alt={p.title}
                        className="object-cover w-full h-full"
                        fallbackType="program"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#830f00] mb-1 line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-600 italic mb-2 line-clamp-1">
                          {p.tagline}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-base">🎯</span>
                          <p className="text-xs text-gray-700 line-clamp-1">{p.goal}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/program/${p._id}`}>
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
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {programs.length > 0 && totalPages > 1 && (
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
                      {startIndex + 1}-{Math.min(endIndex, programs.length)} of {programs.length}
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
                    Showing {startIndex + 1}-{Math.min(endIndex, programs.length)} of {programs.length}
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
