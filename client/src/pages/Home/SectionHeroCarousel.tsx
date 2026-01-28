import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ImageWithFallback";
import { 
  getProgramsHeroImages, 
  getProjectsHeroImages, 
  getEventsHeroImages,
  getCampaignsHeroImages 
} from "@/utils/imageLoader";

type SectionType = 'programs' | 'projects' | 'events' | 'campaigns';

interface SectionHeroCarouselProps {
  section: SectionType;
}

export default function SectionHeroCarousel({ section }: SectionHeroCarouselProps) {
  // Get hero images based on section type
  const heroSlides = useMemo(() => {
    switch (section) {
      case 'programs':
        return getProgramsHeroImages();
      case 'projects':
        return getProjectsHeroImages();
      case 'events':
        return getEventsHeroImages();
      case 'campaigns':
        return getCampaignsHeroImages();
      default:
        return [];
    }
  }, [section]);
  
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  // If no hero images found, show simple placeholder
  if (heroSlides.length === 0) {
    const placeholderMap = {
      programs: { image: '/images/program-placeholder.svg' },
      projects: { image: '/images/project-placeholder.svg' },
      events: { image: '/images/event-placeholder.svg' },
      campaigns: { image: '/images/campaign-placeholder.svg' },
    };
    
    const placeholder = placeholderMap[section];
    
    return (
      <div className="relative w-full h-[300px] md:h-[700px]">
        <ImageWithFallback
          src={placeholder.image}
          alt={`${section} Hero`}
          className="w-full h-full"
          fallbackType={section === 'programs' ? 'program' : section === 'projects' ? 'project' : section === 'events' ? 'event' : 'campaign'}
        />
        {/* Donate Now Button */}
        <div className="absolute bottom-6 right-6 z-30">
          <Button 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>Donate Now</span>
          </Button>
        </div>
      </div>
    );
  }

  // Single image - no carousel needed
  if (heroSlides.length === 1) {
    const slide = heroSlides[0];
    return (
      <div className="relative w-full h-[300px] md:h-[700px]">
        <ImageWithFallback
          src={slide.image}
          alt={`${section} Hero`}
          className="w-full h-full"
          fallbackType={section === 'programs' ? 'program' : section === 'projects' ? 'project' : section === 'events' ? 'event' : 'campaign'}
        />
        {/* Donate Now Button */}
        <div className="absolute bottom-6 right-6 z-30">
          <Button 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <Heart className="w-5 h-5 fill-current" />
            <span className="hidden sm:inline">Donate Now</span>
            <span className="sm:hidden">Donate</span>
          </Button>
        </div>
      </div>
    );
  }

  // Multiple images - show carousel
  return (
    <div className="relative w-full h-[300px] md:h-[700px] overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin]}
        className="w-full h-full"
      >
        <CarouselContent className="ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 basis-full">
              <div className="relative w-full h-[300px] md:h-[700px]">
                {/* Full-width Hero Image */}
                <ImageWithFallback
                  src={slide.image}
                  alt={`${section} Hero ${slide.id}`}
                  className="w-full h-full"
                  fallbackType={section === 'programs' ? 'program' : section === 'projects' ? 'project' : section === 'events' ? 'event' : 'campaign'}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Only show if multiple slides */}
        {heroSlides.length > 1 && (
          <>
            {/* Desktop Arrows */}
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 md:left-8 h-12 w-12" />
              <CarouselNext className="right-4 md:right-8 h-12 w-12" />
            </div>

            {/* Mobile Arrows */}
            <div className="md:hidden">
              <CarouselPrevious className="left-2 h-10 w-10" />
              <CarouselNext className="right-2 h-10 w-10" />
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {heroSlides.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
                />
              ))}
            </div>
          </>
        )}

        {/* Donate Now Button */}
        <div className="absolute bottom-6 right-6 z-30">
          <Button 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <Heart className="w-5 h-5 fill-current" />
            <span className="hidden sm:inline">Donate Now</span>
            <span className="sm:hidden">Donate</span>
          </Button>
        </div>
      </Carousel>
    </div>
  );
}
