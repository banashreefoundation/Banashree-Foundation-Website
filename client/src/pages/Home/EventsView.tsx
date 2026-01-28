import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, LayoutGrid, List, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Event } from "../../services/apiService";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getEventImage } from "@/utils/imageLoader";
import { SERVER_BASE } from "@/utils/imageApi";
import SectionHeroCarousel from "./SectionHeroCarousel";

type ViewMode = 'card' | 'list';

const focusAreaCategories = [
    "All",
    "Animal Welfare",
    "Water Conservation",
    "Education",
    "Community Building",
    "Environmental",
    "Health & Wellness",
    "Technology",
    "Other"
];

interface EventsViewProps {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export default function EventsView({ 
  events: propEvents, 
  loading: propLoading, 
  error: propError 
}: EventsViewProps) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [events, setEvents] = useState<Event[]>(propEvents);
    const [loading, setLoading] = useState(propLoading);
    const [error, setError] = useState<string | null>(propError);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Show 4 events per page

    // Update state when props change
    useEffect(() => {
        setEvents(propEvents);
        setLoading(propLoading);
        setError(propError);
    }, [propEvents, propLoading, propError]);

    // Helper function to get image for event
    const getEventImageForIndex = (_event: Event, index: number) => {
        // Use configured default event images
        const eventImages = ['default1', 'default2', 'default3'] as const;
        const imageKey = eventImages[index % eventImages.length];
        return getEventImage(imageKey);
    };

    // Helper function to get event image URL
    const getEventImageUrl = (event: Event, index: number) => {
        // First priority: Use first image from media array if it exists
        if (event.media && event.media.length > 0) {
            const firstImage = event.media[0];
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
        
        // Fallback: Use default event images
        return getEventImageForIndex(event, index);
    };

    // Helper function to get category from focusAreas field
    const getEventCategory = (event: Event) => {
        const focusArea = event.focusAreas || "Other";
        
        // Map API focus area names to filter categories
        const categoryMap: { [key: string]: string } = {
            "Animal Welfare": "Animal Welfare",
            "Water Conservation": "Water Conservation",
            "Education": "Education",
            "Community Building": "Community Building",
            "Environmental": "Environmental",
            "Health": "Health & Wellness",
            "Health & Wellness": "Health & Wellness",
            "Technology": "Technology",
            "Tech": "Technology"
        };

        // Try exact match first
        if (categoryMap[focusArea]) {
            return categoryMap[focusArea];
        }

        // Try partial match
        for (const [key, value] of Object.entries(categoryMap)) {
            if (focusArea.toLowerCase().includes(key.toLowerCase()) || 
                key.toLowerCase().includes(focusArea.toLowerCase())) {
                return value;
            }
        }

        return "Other"; // Return Other if no match found
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to get color based on focus area
    const getEventColor = (focusArea: string) => {
        const colorMap: { [key: string]: { primary: string, light: string, dark: string } } = {
            "Animal Welfare": { primary: "#10b981", light: "#10b98115", dark: "#059669" }, // Green
            "Water Conservation": { primary: "#06b6d4", light: "#06b6d415", dark: "#0891b2" }, // Cyan
            "Education": { primary: "#f59e0b", light: "#f59e0b15", dark: "#d97706" }, // Amber
            "Community Building": { primary: "#8b5cf6", light: "#8b5cf615", dark: "#7c3aed" }, // Purple
            "Environmental": { primary: "#10b981", light: "#10b98115", dark: "#059669" }, // Green
            "Health & Wellness": { primary: "#ec4899", light: "#ec489915", dark: "#db2777" }, // Pink
            "Technology": { primary: "#3b82f6", light: "#3b82f615", dark: "#2563eb" }, // Blue
            "Other": { primary: "#6b7280", light: "#6b728015", dark: "#4b5563" } // Gray
        };

        return colorMap[focusArea] || colorMap["Other"];
    };

    // Helper function to get shortened tag for focus area
    const getShortenedTag = (focusArea: string) => {
        const tagMap: { [key: string]: string } = {
            "Animal Welfare": "AW",
            "Water Conservation": "WC",
            "Education": "EDU",
            "Community Building": "CB",
            "Environmental": "ENV",
            "Health & Wellness": "H&W",
            "Technology": "TECH",
            "Other": "OTH"
        };

        return tagMap[focusArea] || "OTH";
    };

    // Filter events based on active filter
    const filteredEvents = activeFilter === "All" 
        ? events 
        : events.filter((e) => {
            const category = getEventCategory(e);
            console.log(`Filtering: activeFilter="${activeFilter}", event.focusAreas="${e.focusAreas}", category="${category}"`);
            return category === activeFilter;
        });

    console.log('EventsView: Filtered events count:', filteredEvents.length);
    console.log('EventsView: Active filter:', activeFilter);

    // If no API data, show empty state instead of fallback since structure doesn't match
    const displayEvents = events.length > 0 ? filteredEvents : [];
    console.log('EventsView: Display events count:', displayEvents.length);

    // Pagination calculations
    const totalPages = Math.ceil(displayEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = displayEvents.slice(startIndex, endIndex);

    // Reset to first page when filter or events change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, displayEvents.length]);

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
                <SectionHeroCarousel section="events" />
            </div>
            
            {/* Events Content */}
            <div className="bg-[#f0f9ff] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header with View Toggle */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[#7c3aed] font-medium text-3xl mb-2 font-maku"
                                style={{ fontFamily: "Maku, sans-serif" }}>
                                Our Events
                            </div>
                            <p className="text-2xl font-semibold mb-1">Join us in making a difference,</p>
                            <p className="text-2xl font-semibold">one event at a time.</p>
                        </div>
                        
                        {/* View Toggle Buttons */}
                        <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-3 rounded-md transition-all duration-200 ${
                                    viewMode === 'card' 
                                        ? 'bg-[#7c3aed] text-white shadow-md' 
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
                                        ? 'bg-[#7c3aed] text-white shadow-md' 
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
                        <div className="text-lg">Loading events...</div>
                    </div>
                ) : (
                    <>
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            {focusAreaCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 rounded-full border transition-all duration-200 ${activeFilter === cat
                                            ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-md"
                                            : "text-[#7c3aed] border-[#7c3aed] hover:bg-[#7c3aed]/10"
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
                            {displayEvents.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg">
                                        No events found for "{activeFilter}" category.
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Try selecting "All" to see all available events.
                                    </p>
                                </div>
                            ) : (
                                currentEvents.map((e, idx) => {
                                    const eventColor = getEventColor(getEventCategory(e));
                                    return (
                                    <div
                                        key={e._id || idx}
                                        className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col md:flex-row border border-gray-200/50 relative mt-4 backdrop-blur-sm"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${eventColor.light} 0%, ${eventColor.light}08 50%, white 100%)`,
                                            boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
                                            overflow: "visible"
                                        }}
                                    >
                                        <div className="relative md:w-[40%] h-80">
                                            <ImageWithFallback
                                                src={getEventImageUrl(e, idx)}
                                                alt={e.title}
                                                className="object-cover w-full h-full rounded-l-xl"
                                                fallbackType="event"
                                            />
                                            {/* Enhanced Focus Area Tag */}
                                            <span
                                                className="absolute top-4 -left-6 text-sm text-white px-4 py-2 rounded-lg shadow-lg z-10 font-medium"
                                                style={{ 
                                                    backgroundColor: eventColor.primary,
                                                    boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
                                                }}
                                            >
                                                {e.focusAreas}
                                            </span>
                                        </div>
                                        <div className="p-6 md:w-[60%] flex flex-col relative z-10 justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 leading-tight"
                                                    style={{ color: eventColor.primary }}
                                                >
                                                    {e.title}
                                                </h3>

                                                {/* Event Details */}
                                                <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(e.startDateTime)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>⏰</span>
                                                        <span>{formatTime(e.startDateTime)} - {formatTime(e.endDateTime)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        <span>{e.venue}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                                                    <Users size={14} />
                                                    <span className="font-medium">Target: {e.targetAudience}</span>
                                                </div>

                                                <p className="text-sm text-gray-700 mb-3 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto">
                                                    {e.description}
                                                </p>

                                                {/* Additional Details */}
                                                <div className="text-xs space-y-2 mt-2">
                                                    <p className="flex items-start gap-2">
                                                        <span className="font-bold min-w-fit" style={{ color: eventColor.primary }}>🎯 Objectives:</span> 
                                                        <span className="text-gray-700">{e.objectives}</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <span className="font-bold min-w-fit" style={{ color: eventColor.primary }}>📈 Impact:</span> 
                                                        <span className="text-gray-700">{e.impact}</span>
                                                    </p>
                                                    {e.pocDetails && (
                                                        <p className="flex items-start gap-2">
                                                            <span className="font-bold min-w-fit" style={{ color: eventColor.primary }}>📞 Contact:</span>
                                                            <span className="text-gray-700">{e.pocDetails}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-auto pt-4">
                                                <Link to={`/event/${e._id}`} className="flex-1">
                                                    <Button 
                                                        variant="outline"
                                                        className="w-full transition-all duration-300 hover:text-white"
                                                        style={{ 
                                                            borderColor: eventColor.primary,
                                                            color: eventColor.primary
                                                        }}
                                                        onMouseEnter={(ev) => {
                                                            ev.currentTarget.style.backgroundColor = eventColor.primary;
                                                        }}
                                                        onMouseLeave={(ev) => {
                                                            ev.currentTarget.style.backgroundColor = 'transparent';
                                                        }}
                                                    >
                                                        <ExternalLink size={16} className="mr-2" />
                                                        Learn More
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    className="flex-1 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                    style={{ 
                                                        background: `linear-gradient(to right, ${eventColor.primary}, ${eventColor.dark})`
                                                    }}
                                                >
                                                    Register Now
                                                </Button>
                                                {e.donateOption && (
                                                    <a href="#contribute">
                                                        <Button 
                                                            variant="outline" 
                                                            className="transition-all duration-300 hover:text-white"
                                                            style={{ 
                                                                borderColor: eventColor.primary,
                                                                color: eventColor.primary
                                                            }}
                                                            onMouseEnter={(ev) => {
                                                                ev.currentTarget.style.backgroundColor = eventColor.primary;
                                                            }}
                                                            onMouseLeave={(ev) => {
                                                                ev.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            Donate
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })
                            )}
                          </div>
                        ) : (
                          // List View - Compact 2-column grid
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displayEvents.length === 0 ? (
                                <div className="text-center py-12 col-span-full">
                                    <p className="text-gray-600 text-lg">
                                        No events found for "{activeFilter}" category.
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Try selecting "All" to see all available events.
                                    </p>
                                </div>
                            ) : (
                                currentEvents.map((e, idx) => {
                                    const eventColor = getEventColor(getEventCategory(e));
                                    return (
                                    <div
                                        key={e._id || idx}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex border border-gray-100 overflow-hidden"
                                    >
                                        <div className="relative w-32 h-full flex-shrink-0">
                                            <ImageWithFallback
                                                src={getEventImageUrl(e, idx)}
                                                alt={e.title}
                                                className="object-cover w-full h-full"
                                                fallbackType="event"
                                            />
                                            <span className="absolute top-2 left-2 text-xs text-white px-2 py-1 rounded-md font-bold shadow-md"
                                                style={{ backgroundColor: eventColor.primary }}
                                                title={e.focusAreas}
                                            >
                                                {getShortenedTag(getEventCategory(e))}
                                            </span>
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 line-clamp-1"
                                                    style={{ color: eventColor.primary }}
                                                >
                                                    {e.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                                    <Calendar size={12} />
                                                    <span className="line-clamp-1">{formatDate(e.startDateTime)}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                                    <MapPin size={12} />
                                                    <span className="line-clamp-1">{e.venue}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/event/${e._id}`}>
                                                    <Button 
                                                        size="sm"
                                                        variant="outline"
                                                        className="hover:text-white text-xs px-3 py-1"
                                                        style={{ 
                                                            borderColor: eventColor.primary,
                                                            color: eventColor.primary
                                                        }}
                                                        onMouseEnter={(ev) => {
                                                            ev.currentTarget.style.backgroundColor = eventColor.primary;
                                                        }}
                                                        onMouseLeave={(ev) => {
                                                            ev.currentTarget.style.backgroundColor = 'transparent';
                                                        }}
                                                    >
                                                        <ExternalLink size={12} className="mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    size="sm"
                                                    className="text-white text-xs px-3 py-1"
                                                    style={{ 
                                                        background: `linear-gradient(to right, ${eventColor.primary}, ${eventColor.dark})`
                                                    }}
                                                >
                                                    Register
                                                </Button>
                                                {e.donateOption && (
                                                    <a href="#contribute">
                                                        <Button 
                                                            size="sm"
                                                            variant="outline"
                                                            className="hover:text-white text-xs px-3 py-1"
                                                            style={{ 
                                                                borderColor: eventColor.primary,
                                                                color: eventColor.primary
                                                            }}
                                                            onMouseEnter={(ev) => {
                                                                ev.currentTarget.style.backgroundColor = eventColor.primary;
                                                            }}
                                                            onMouseLeave={(ev) => {
                                                                ev.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            Donate
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })
                            )}
                          </div>
                        )}

                        {/* Pagination Controls */}
                        {displayEvents.length > 0 && totalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 mt-12 mb-8">
                                {/* Page Info Card */}
                                <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">Page</span>
                                        <div className="bg-[#7c3aed] text-white font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
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
                                                : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-md hover:shadow-lg hover:scale-105'
                                        }`}
                                    >
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">Previous</span>
                                    </Button>

                                    {/* Showing info */}
                                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                                        <span className="text-purple-700 text-sm font-medium">
                                            {startIndex + 1}-{Math.min(endIndex, displayEvents.length)} of {displayEvents.length}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-md hover:shadow-lg hover:scale-105'
                                        }`}
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>

                                {/* Mobile showing info */}
                                <div className="sm:hidden flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                                    <span className="text-purple-700 text-xs font-medium">
                                        Showing {startIndex + 1}-{Math.min(endIndex, displayEvents.length)} of {displayEvents.length}
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