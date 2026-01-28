import { useState, useEffect } from "react";
import { Target, Heart, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campaign } from "../../services/apiService";
import ImageWithFallback from "@/components/ImageWithFallback";
import { SERVER_BASE } from "@/utils/imageApi";
import SectionHeroCarousel from "./SectionHeroCarousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ViewMode = 'card' | 'list';

interface CampaignsViewProps {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

export default function CampaignsView({ 
  campaigns: propCampaigns, 
  loading: propLoading, 
  error: propError 
}: CampaignsViewProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>(propCampaigns);
    const [loading, setLoading] = useState(propLoading);
    const [error, setError] = useState<string | null>(propError);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Show 4 campaigns per page

    // Update state when props change
    useEffect(() => {
        setCampaigns(propCampaigns);
        setLoading(propLoading);
        setError(propError);
    }, [propCampaigns, propLoading, propError]);

    // Helper function to get campaign image URL
    const getCampaignImageUrl = (mediaUrl: string) => {
        if (!mediaUrl) return '';
        // If it's already a full URL, return as-is
        if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
            return mediaUrl;
        }
        // If it starts with /uploads, prepend server base
        if (mediaUrl.startsWith('/uploads')) {
            return `${SERVER_BASE}${mediaUrl}`;
        }
        // If it starts with /images, it might be in public folder
        if (mediaUrl.startsWith('/images')) {
            return mediaUrl; // Let the browser try to load from public folder
        }
        // Otherwise assume it's a relative path to uploads
        return `${SERVER_BASE}/uploads/${mediaUrl}`;
    };

    // Filter only active campaigns
    const displayCampaigns = campaigns.filter(c => c.isActive);

    // Pagination calculations
    const totalPages = Math.ceil(displayCampaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCampaigns = displayCampaigns.slice(startIndex, endIndex);

    // Reset to first page when campaigns change
    useEffect(() => {
        setCurrentPage(1);
    }, [displayCampaigns.length]);

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

    const handleLearnMore = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedCampaign(null), 300);
    };

    return (
        <div className="bg-white">
            {/* Hero Section with Header Overlay */}
            <div className="relative w-full overflow-hidden">
                <SectionHeroCarousel section="campaigns" />
            </div>
            
            {/* Campaigns Content */}
            <div className="bg-[#f0f9ff] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header with View Toggle */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="text-[#1e40af] font-medium text-3xl mb-2 font-maku"
                                style={{ fontFamily: "Maku, sans-serif" }}>
                                Our Campaigns
                            </div>
                            <p className="text-2xl font-semibold mb-1">Support causes that matter,</p>
                            <p className="text-2xl font-semibold">make an impact today.</p>
                        </div>
                        
                        {/* View Toggle Buttons */}
                        <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-3 rounded-md transition-all duration-200 ${
                                    viewMode === 'card' 
                                        ? 'bg-[#1e40af] text-white shadow-md' 
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
                                        ? 'bg-[#1e40af] text-white shadow-md' 
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
                        <div className="text-lg">Loading campaigns...</div>
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'card' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                            {displayCampaigns.length === 0 ? (
                                <div className="text-center py-12 col-span-full">
                                    <p className="text-gray-600 text-lg">
                                        No active campaigns at the moment.
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Check back soon for new campaigns!
                                    </p>
                                </div>
                            ) : (
                                currentCampaigns.map((campaign, idx) => (
                                viewMode === 'card' ? (
                                    // Card View - Large horizontal cards
                                    <div
                                        key={campaign._id || idx}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row border border-gray-100 relative"
                                    >
                                        {/* Image Section */}
                                        <div className="relative md:w-[40%] h-[280px] md:h-auto md:max-h-[400px] overflow-visible group">
                                            <div className="w-full h-full overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                                <ImageWithFallback
                                                    src={getCampaignImageUrl(campaign.mediaUrl)}
                                                    alt={campaign.title}
                                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                                    fallbackType="campaign"
                                                />
                                            </div>
                                            
                                            {/* Campaign Badge - Slightly peeking out on left */}
                                            <span
                                                className="absolute top-4 -left-2 text-sm text-white px-4 py-2 rounded-lg shadow-lg z-20 font-medium bg-green-600"
                                                style={{ 
                                                    boxShadow: `0 4px 15px rgba(22, 163, 74, 0.4)`
                                                }}
                                            >
                                                Campaign #{campaign.campaignID}
                                            </span>
                                        </div>

                                        {/* Content Section - Compact */}
                                        <div className="flex-1 p-6 md:p-8 flex flex-col">
                                            {/* Header */}
                                            <div className="mb-4">
                                                <h3 className="text-xl md:text-2xl font-bold text-[#1e40af] mb-2 leading-tight line-clamp-2">
                                                    {campaign.title}
                                                </h3>
                                                <p className="text-sm md:text-base font-medium text-[#830f00] italic border-l-4 border-[#830f00] pl-3 line-clamp-2">
                                                    {campaign.tagline}
                                                </p>
                                            </div>

                                            {/* Goal Section - Light Green Highlighted Box */}
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border-l-4 border-green-600">
                                                <div className="flex items-start gap-2">
                                                    <div className="bg-green-600 text-white p-1.5 rounded-lg">
                                                        <Target size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Campaign Goal</p>
                                                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{campaign.goal}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Campaign Story - Truncated */}
                                            <div className="mb-4 flex-grow">
                                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                    {campaign.campaignStory}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-auto">
                                                <Button 
                                                    onClick={() => handleLearnMore(campaign)}
                                                    className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white hover:from-[#1e3a8a] hover:to-[#1e40af] shadow-md hover:shadow-lg transition-all duration-300 px-6 py-2 text-sm font-semibold"
                                                >
                                                    Learn More
                                                </Button>
                                                {campaign.donateOption === "true" && (
                                                    <a href="#contribute">
                                                        <Button className="bg-[#830f00] text-white hover:bg-[#6b0d00] transition-all duration-300 px-6 py-2 text-sm font-semibold flex items-center gap-2">
                                                            <Heart size={16} fill="white" />
                                                            Donate Now
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List View - Compact horizontal rows
                                    <div
                                        key={campaign._id || idx}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex border border-gray-100 overflow-hidden"
                                    >
                                        {/* Compact Image */}
                                        <div className="relative w-32 h-full flex-shrink-0">
                                            <ImageWithFallback
                                                src={getCampaignImageUrl(campaign.mediaUrl)}
                                                alt={campaign.title}
                                                className="object-cover w-full h-full"
                                                fallbackType="campaign"
                                            />
                                            <span className="absolute top-2 left-2 text-xs text-white px-2 py-1 rounded-md bg-green-600 font-bold shadow-md"
                                                title={`Campaign #${campaign.campaignID}`}
                                            >
                                                C#{campaign.campaignID}
                                            </span>
                                        </div>

                                        {/* Compact Content */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#1e40af] mb-1 line-clamp-1">
                                                    {campaign.title}
                                                </h3>
                                                <p className="text-xs font-medium text-[#830f00] italic mb-2 line-clamp-1">
                                                    {campaign.tagline}
                                                </p>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <Target size={12} className="text-green-600 flex-shrink-0" />
                                                    <p className="text-xs text-gray-700 line-clamp-1">{campaign.goal}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button 
                                                    onClick={() => handleLearnMore(campaign)}
                                                    size="sm"
                                                    className="bg-[#1e40af] text-white hover:bg-[#1e3a8a] text-xs px-3 py-1"
                                                >
                                                    Learn More
                                                </Button>
                                                {campaign.donateOption === "true" && (
                                                    <a href="#contribute">
                                                        <Button 
                                                            size="sm"
                                                            className="bg-[#830f00] text-white hover:bg-[#6b0d00] text-xs px-3 py-1 flex items-center gap-1"
                                                        >
                                                            <Heart size={12} fill="white" />
                                                            Donate
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {displayCampaigns.length > 0 && totalPages > 1 && (
                        <div className="flex flex-col items-center gap-4 mt-12 mb-8">
                            {/* Page Info Card */}
                            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Page</span>
                                    <div className="bg-[#1e40af] text-white font-bold text-base px-4 py-1.5 rounded-full min-w-[40px] text-center">
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
                                            : 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] shadow-md hover:shadow-lg hover:scale-105'
                                    }`}
                                >
                                    <ChevronLeft size={18} />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>

                                {/* Showing info */}
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                                    <span className="text-green-700 text-sm font-medium">
                                        {startIndex + 1}-{Math.min(endIndex, displayCampaigns.length)} of {displayCampaigns.length}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] shadow-md hover:shadow-lg hover:scale-105'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight size={18} />
                                </Button>
                            </div>

                            {/* Mobile showing info */}
                            <div className="sm:hidden flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                                <span className="text-green-700 text-xs font-medium">
                                    Showing {startIndex + 1}-{Math.min(endIndex, displayCampaigns.length)} of {displayCampaigns.length}
                                </span>
                            </div>
                        </div>
                    )}
                    </>
                )}

                {/* Campaign Details Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {selectedCampaign && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-[#1e40af] pr-8">
                                        {selectedCampaign.title}
                                    </DialogTitle>
                                    <DialogDescription className="text-base font-medium text-[#830f00] italic border-l-4 border-[#830f00] pl-4 mt-3">
                                        {selectedCampaign.tagline}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 mt-4">
                                    {/* Campaign Image */}
                                    <div className="relative h-[300px] rounded-xl overflow-hidden">
                                        <ImageWithFallback
                                            src={getCampaignImageUrl(selectedCampaign.mediaUrl)}
                                            alt={selectedCampaign.title}
                                            className="object-cover w-full h-full"
                                            fallbackType="event"
                                        />
                                        <div className="absolute top-4 left-4 bg-[#1e40af] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                                            Campaign #{selectedCampaign.campaignID}
                                        </div>
                                    </div>

                                    {/* Goal Section */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-[#1e40af]">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#1e40af] text-white p-2.5 rounded-lg">
                                                <Target size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#1e40af] uppercase tracking-wide mb-2">Campaign Goal</p>
                                                <p className="text-base font-medium text-gray-800">{selectedCampaign.goal}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campaign Story */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-3">Campaign Story</h4>
                                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                            {selectedCampaign.campaignStory}
                                        </p>
                                    </div>

                                    {/* Beneficiary Information */}
                                    {selectedCampaign.beneficiaryInformation && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">👤</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-[#1e40af] uppercase mb-2">Beneficiary</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.beneficiaryInformation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    {selectedCampaign.timeline && (
                                        <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">⏰</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-orange-700 uppercase mb-2">Timeline</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.timeline}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Impact */}
                                    {selectedCampaign.impactOfContribution && (
                                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">📈</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-green-700 uppercase mb-2">Impact of Your Contribution</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.impactOfContribution}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Specific Breakdown */}
                                    {selectedCampaign.specificBreakdown && (
                                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">💰</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-blue-700 uppercase mb-2">Fund Breakdown</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.specificBreakdown}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Campaign Updates */}
                                    {selectedCampaign.campaignUpdates && (
                                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">📢</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-purple-700 uppercase mb-2">Campaign Updates</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.campaignUpdates}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Endorsements */}
                                    {selectedCampaign.endorsementsOrPartnerships && (
                                        <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">⭐</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-yellow-700 uppercase mb-2">Endorsements & Partnerships</p>
                                                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedCampaign.endorsementsOrPartnerships}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons in Modal */}
                                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
                                        <Button 
                                            onClick={closeModal}
                                            variant="outline"
                                            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-6 text-base font-semibold"
                                        >
                                            Close
                                        </Button>
                                        {selectedCampaign.donateOption === "true" && (
                                            <a href="#contribute" className="flex-1" onClick={closeModal}>
                                                <Button className="w-full bg-[#830f00] text-white hover:bg-[#6b0d00] py-6 text-base font-semibold flex items-center justify-center gap-2">
                                                    <Heart size={20} fill="white" />
                                                    Donate Now
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
                </div>
            </div>
        </div>
    );
}
