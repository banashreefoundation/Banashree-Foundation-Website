import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Calendar, Users, Target, MapPin } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(currentConfig.backPath)}
            className="flex items-center gap-2 text-[#830f00] hover:text-[#6b0d00] transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>{currentConfig.backLabel}</span>
          </button>
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
