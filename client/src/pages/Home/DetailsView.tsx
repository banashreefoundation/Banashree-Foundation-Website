import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Calendar, Users, Target, MapPin, Share2, Copy, Check } from 'lucide-react';
import { Project } from '../../services/apiService';
import ImageWithFallback from '@/components/ImageWithFallback';
import { SERVER_BASE } from '@/utils/imageApi';
import { Button } from '@/components/ui/button';
import { getDynamicContent } from './dynamicContent';
import Header from '@/components/Header';

type EntityType = 'project' | 'program' | 'event' | 'campaign';

interface DetailsViewProps {
  entityType: EntityType;
}

export default function DetailsView({ entityType }: DetailsViewProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Get logo from dynamic content
  const dynamicContent = getDynamicContent();
  const { logo } = dynamicContent;

  // Configuration based on entity type
  const config = {
    project: {
      apiEndpoint: '/api/v1/projects',
      backPath: '/#projects',
      backLabel: 'Back to Projects',
      title: 'Project',
      fallbackType: 'project' as const,
    },
    program: {
      apiEndpoint: '/api/v1/programs',
      backPath: '/#programs',
      backLabel: 'Back to Programs',
      title: 'Program',
      fallbackType: 'program' as const,
    },
    event: {
      apiEndpoint: '/api/v1/events',
      backPath: '/#events',
      backLabel: 'Back to Events',
      title: 'Event',
      fallbackType: 'event' as const,
    },
    campaign: {
      apiEndpoint: '/api/v1/campaigns',
      backPath: '/#campaigns',
      backLabel: 'Back to Campaigns',
      title: 'Campaign',
      fallbackType: 'campaign' as const,
    },
  };

  const currentConfig = config[entityType];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching ${entityType} with ID:`, id);
        const response = await fetch(`${SERVER_BASE}${currentConfig.apiEndpoint}/${id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) throw new Error(`${currentConfig.title} not found`);
        
        const result = await response.json();
        console.log('Response data:', result);
        
        // Handle both direct data and nested data response formats
        const fetchedData = result.data || result;
        console.log('Image field:', fetchedData.image);
        setData(fetchedData);
        
        // Log constructed image URL after state is set
        setTimeout(() => {
          console.log('Constructed image URL:', getImage());
        }, 100);
      } catch (err) {
        console.error(`Error fetching ${entityType}:`, err);
        setError(err instanceof Error ? err.message : `Failed to load ${entityType}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError(`Invalid ${entityType} URL`);
      setLoading(false);
    }
  }, [id, entityType, currentConfig]);

  const getImage = (): string => {
    if (!data) return '';
    
    // Helper to construct proper URL
    const constructUrl = (imgPath: string): string => {
      // If it's a full URL, use it directly
      if (imgPath.startsWith('http')) {
        return imgPath;
      }
      // If image already starts with /uploads/, use it directly
      if (imgPath.startsWith('/uploads/')) {
        // Encode the filename part to handle spaces
        const parts = imgPath.split('/');
        const filename = parts[parts.length - 1];
        const encodedFilename = encodeURIComponent(filename);
        const path = parts.slice(0, -1).join('/');
        return `${SERVER_BASE}${path}/${encodedFilename}`;
      }
      // Otherwise prepend /uploads/
      return `${SERVER_BASE}/uploads/${encodeURIComponent(imgPath)}`;
    };
    
    // Handle different image field names
    if (data.image) {
      return constructUrl(data.image);
    }
    if (data.images && data.images.length > 0) {
      return constructUrl(data.images[0]);
    }
    if (data.media?.images && data.media.images.length > 0) {
      return constructUrl(data.media.images[0]);
    }
    if (data.mediaUrl) {
      return constructUrl(data.mediaUrl);
    }
    return '';
  };

  const getTitle = () => {
    if (!data) return '';
    return data.projectName || data.title || data.name || 'Untitled';
  };

  const getTagline = () => {
    if (!data) return '';
    return data.tagLine || data.tagline || data.description || '';
  };

  const getCategory = () => {
    if (!data) return '';
    return data.program || data.category || data.focusAreas || '';
  };

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const title = encodeURIComponent(getTitle());
    const url = encodeURIComponent(shareUrl);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <ImageWithFallback
            src={logo}
            alt="Loading..."
            className="w-32 h-32 mx-auto mb-6 animate-pulse"
            fallbackType="logo"
          />
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#830f00] mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading {entityType} details...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentConfig.title} Not Found</h2>
          <p className="text-gray-600 mb-6">{error || `The ${entityType} you are looking for does not exist.`}</p>
          <Button 
            onClick={() => navigate(currentConfig.backPath)}
            className="bg-[#830f00] hover:bg-[#6b0d00]"
          >
            <ArrowLeft size={16} className="mr-2" />
            {currentConfig.backLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(currentConfig.backPath)}
            className="flex items-center gap-2 text-[#830f00] hover:text-[#6b0d00] transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>{currentConfig.backLabel}</span>
          </button>
          
          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm mr-2">Share:</span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="Share on WhatsApp"
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-lg transition-all ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={copied ? 'Link copied!' : 'Copy link'}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Image & Title */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="relative h-[500px]">
            <ImageWithFallback
              src={getImage()}
              alt={getTitle()}
              className="w-full h-full object-cover"
              fallbackType={currentConfig.fallbackType}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
              {getCategory() && (
                <span className="inline-block bg-[#830f00] text-white px-4 py-2 rounded-lg font-bold text-sm mb-4 shadow-lg">
                  {getCategory()}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                {getTitle()}
              </h1>
              {getTagline() && (
                <p className="text-xl text-gray-200 italic font-medium drop-shadow-md">
                  {getTagline()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Key Info Cards - Project specific */}
        {entityType === 'project' && data.projectObjective && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {data.projectObjective && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <Target className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Objective</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{data.projectObjective}</p>
              </div>
            )}

            {data.projectLocation && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <MapPin className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Location</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{data.projectLocation}</p>
              </div>
            )}

            {data.collaboratingPartners && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <Users className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Partners</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{data.collaboratingPartners}</p>
              </div>
            )}
          </div>
        )}

        {/* Event specific info */}
        {entityType === 'event' && (data.startDateTime || data.endDateTime || data.venue) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {data.venue && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <MapPin className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Venue</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{data.venue}</p>
              </div>
            )}

            {data.startDateTime && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <Calendar className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Start Date</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {new Date(data.startDateTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {data.targetAudience && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#830f00] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#830f00]/10 p-3 rounded-full">
                    <Users className="text-[#830f00]" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Target Audience</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{data.targetAudience}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {(data.projectDescription || data.detailedDescription || data.description || data.campaignStory) && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {data.projectDescription || data.detailedDescription || data.description || data.campaignStory}
                </p>
              </div>
            )}

            {/* Key Activities - Projects */}
            {data.keyActivities && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Key Activities
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {data.keyActivities}
                </p>
              </div>
            )}

            {/* Expected Outcome - Projects */}
            {data.expectedOutcome && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">🌟</span>
                  Expected Outcome
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {data.expectedOutcome}
                </p>
              </div>
            )}

            {/* Target Beneficiaries - Projects */}
            {data.targetBeneficiaries && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">👥</span>
                  Target Beneficiaries
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {data.targetBeneficiaries}
                </p>
              </div>
            )}

            {/* Goals - Programs */}
            {(data.goal || (data.goals && data.goals.length > 0)) && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Goals
                </h2>
                {data.goal ? (
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{data.goal}</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {data.goals.map((goal: string, idx: number) => (
                      <li key={idx} className="text-gray-700 leading-relaxed">{goal}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Impact - Programs/Events */}
            {data.impact && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">💫</span>
                  Impact
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {data.impact}
                </p>
              </div>
            )}

            {/* Metrics */}
            {data.metrics && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#830f00] mb-4 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Metrics & Impact
                </h2>
                {typeof data.metrics === 'string' ? (
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {data.metrics}
                  </p>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {data.metrics.map((metric: string, idx: number) => (
                      <li key={idx} className="text-gray-700 leading-relaxed">{metric}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Call to Action */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#830f00] to-[#a01200] rounded-xl shadow-2xl p-8 text-white sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Support This {currentConfig.title}</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Your contribution can make a real difference in the lives of those we serve. Every donation helps us move closer to our goals.
              </p>
              
              <a 
                href="/#contribute"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/#contribute';
                }}
              >
                <Button 
                  className="w-full bg-white text-[#830f00] hover:bg-gray-100 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Heart size={24} className="mr-2" fill="currentColor" />
                  Donate Now
                </Button>
              </a>

              <div className="mt-8 pt-8 border-t border-white/30">
                <h4 className="font-bold mb-4 text-lg">{currentConfig.title} Details</h4>
                <div className="space-y-3 text-sm">
                  {getCategory() && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Category:</span>
                      <span className="font-semibold">{getCategory()}</span>
                    </div>
                  )}
                  {data.projectLocation && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Location:</span>
                      <span className="font-semibold">{data.projectLocation}</span>
                    </div>
                  )}
                  {data.venue && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Venue:</span>
                      <span className="font-semibold">{data.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
