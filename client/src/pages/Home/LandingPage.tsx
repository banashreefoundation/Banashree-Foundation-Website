// LandingPage.tsx - Simplified: Just handles carousel/hero section, header is now separate in App.tsx
import HeroCarousel from "./HeroCarousel";
import SectionHeroCarousel from "./SectionHeroCarousel";

// Props to toggle between full carousel (home) or section hero (programs/projects/events/campaigns)
type LandingPageProps = {
  showOnlyHeaderImage?: boolean;
  activeSectionIs: string;
};

export default function LandingPage({ showOnlyHeaderImage = false, activeSectionIs = '' }: LandingPageProps) {
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* Hero Section - Carousel is now completely separate from header */}
      {!showOnlyHeaderImage ? (
        // Home page: Show full hero carousel
        <div className="relative mt-0">
          <HeroCarousel />
        </div>
      ) : (
        // Other sections (programs, projects, events, campaigns): Show section-specific hero
        <div className="relative mt-0">
          <SectionHeroCarousel section={activeSectionIs as 'programs' | 'projects' | 'events' | 'campaigns'} />
        </div>
      )}
    </div>
  );
}
