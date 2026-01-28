// LandingPage.tsx
import { Button } from "@/components/ui/button";
import { HeartHandshake, Menu, X, ChevronDown } from "lucide-react";
import { getDynamicContent } from "./dynamicContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useEffect, useState, useMemo } from "react";
import HeroCarousel from "./HeroCarousel";

// Props to toggle background images / mode
type LandingPageProps = {
  showOnlyHeaderImage?: boolean;
  activeSectionIs: string;
};

// Project categories for submenu
const projectCategories = [
  "All",
  "Animal Welfare And Rescue",
  "Elderly Care",
  "Water Conservation",
  "Child Care And Education",
  "Farmer Empowerment",
  "Community Building, Cultural & Social Upliftment",
  "Gurukul Systems",
];

export default function LandingPage({ showOnlyHeaderImage = false, activeSectionIs = '' }: LandingPageProps) {
  // Call getDynamicContent inside the component so it runs after cache is loaded
  const dynamicContent = useMemo(() => getDynamicContent(), []);
  const { hero, navLinks, logo } = dynamicContent;
  const [activeHash, setActiveHash] = useState(window.location.hash || "#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#home");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);


  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* Hero Section container - responsive height */}
      {!showOnlyHeaderImage ? (
        // Use HeroCarousel for home page
        <div className="relative">
          <HeroCarousel />
          
          {/* Header overlay on carousel */}
          <header className="flex justify-between items-center px-4 sm:px-10 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-4 sm:gap-12">
              <a href="#home">
                <ImageWithFallback
                  src={logo}
                  alt="Logo"
                  className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-contain"
                  fallbackType="logo"
                />
              </a>
              <nav className="hidden md:flex gap-10 font-semibold items-center">
                {navLinks.map(({ to, label, id }) => (
                  id === "projects" ? (
                    // Projects with dropdown submenu
                    <div 
                      key={label} 
                      className="relative"
                      onMouseEnter={() => setIsProjectsMenuOpen(true)}
                      onMouseLeave={() => setIsProjectsMenuOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setIsProjectsMenuOpen(!isProjectsMenuOpen);
                          window.location.hash = to;
                        }}
                        className={`transition flex items-center gap-1 py-2 ${
                          activeHash === to
                            ? "text-[#830f00] border-b-2 border-[#830f00]"
                            : "text-[#6e4e3a] hover:text-[#830f00]"
                        }`}
                      >
                        {label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isProjectsMenuOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isProjectsMenuOpen && (
                        <div className="absolute top-full left-0 pt-2 z-[100]">
                          <div className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl border border-[#830f00]/30 min-w-[380px] py-4 backdrop-blur-sm">
                            <div className="px-6 py-3 border-b-2 border-[#830f00]/20 mb-3">
                              <p className="text-sm font-bold text-[#830f00] uppercase tracking-wider">Filter by Category</p>
                            </div>
                            <div className="max-h-[450px] overflow-y-auto px-2 custom-scrollbar">
                              {projectCategories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setIsProjectsMenuOpen(false);
                                    sessionStorage.setItem('selectedProjectCategory', category);
                                    window.location.hash = '#projects';
                                  }}
                                  className={`w-full text-left block px-5 py-3.5 my-1 text-[15px] rounded-lg transition-all duration-300 font-medium group relative overflow-hidden
                                    ${category === "All" 
                                      ? "bg-gradient-to-r from-[#830f00] to-[#a01200] text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]" 
                                      : "text-[#4a4a4a] hover:bg-gradient-to-r hover:from-[#830f00] hover:to-[#a01200] hover:text-white hover:shadow-md hover:transform hover:scale-[1.02]"
                                    }`}
                                >
                                  <span className="relative z-10 flex items-center gap-3">
                                    {category === "All" && (
                                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                                    )}
                                    <span className={category === "All" ? "font-semibold" : ""}>{category}</span>
                                  </span>
                                  {category !== "All" && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#830f00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Other nav links
                    <a
                      key={label}
                      href={to}
                      onClick={(e) => {
                        // Special handling for About Us link
                        if (id === "about") {
                          e.preventDefault();
                          // First navigate to home, then scroll to about
                          window.location.hash = "#home";
                          setTimeout(() => {
                            window.location.hash = "#about";
                          }, 100);
                        }
                      }}
                      className={`transition ${
                        activeHash === to
                          ? "text-[#830f00] border-b-2 border-[#830f00]"
                          : "text-[#6e4e3a] hover:text-[#830f00]"
                      }`}
                    >
                      {label}
                    </a>
                  )
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <HeartHandshake className="text-red-800 hidden sm:block" />
              <span className="text-xs font-medium hidden lg:inline">
                Join Us And Become A Volunteer
              </span>
              {activeSectionIs !== "contribute" && (
                <a href="#contribute">
                  <Button className="bg-[#830f00] text-white px-3 py-1.5 sm:px-6 sm:py-2 flex gap-2 items-center rounded-md text-xs sm:text-sm">
                    {hero.contributeText}
                  </Button>
                </a>
              )}
              {/* Hamburger Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center md:hidden">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5">
                <X className="w-8 h-8 text-gray-800" />
              </button>
              <nav className="flex flex-col gap-8 text-center">
                {navLinks.map(({ to, label, id }) => (
                  <a
                    key={label}
                    href={to}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      // Special handling for About Us link
                      if (id === "about") {
                        e.preventDefault();
                        // First navigate to home, then scroll to about
                        window.location.hash = "#home";
                        setTimeout(() => {
                          window.location.hash = "#about";
                        }, 100);
                      }
                    }}
                    className={`text-2xl font-semibold transition ${
                      activeHash === to
                        ? "text-[#830f00]"
                        : "text-[#6e4e3a] hover:text-[#830f00]"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      ) : (
        // For other sections (programs, projects, events, campaigns)
        // Show ONLY the header navigation - SectionHeroCarousel handles the hero image
        <div>
          <header className="flex justify-between items-center px-4 sm:px-10 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-4 sm:gap-12">
              <a href="#home">
                <ImageWithFallback
                  src={logo}
                  alt="Logo"
                  className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-contain"
                  fallbackType="logo"
                />
              </a>
              <nav className="hidden md:flex gap-10 font-semibold items-center">
                {navLinks.map(({ to, label, id }) => (
                  id === "projects" ? (
                    // Projects with dropdown submenu
                    <div 
                      key={label} 
                      className="relative"
                      onMouseEnter={() => setIsProjectsMenuOpen(true)}
                      onMouseLeave={() => setIsProjectsMenuOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setIsProjectsMenuOpen(!isProjectsMenuOpen);
                          window.location.hash = to;
                        }}
                        className={`transition flex items-center gap-1 py-2 ${
                          activeHash === to
                            ? "text-[#830f00] border-b-2 border-[#830f00]"
                            : "text-[#6e4e3a] hover:text-[#830f00]"
                        }`}
                      >
                        {label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isProjectsMenuOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isProjectsMenuOpen && (
                        <div className="absolute top-full left-0 pt-2 z-[100]">
                          <div className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl border border-[#830f00]/30 min-w-[380px] py-4 backdrop-blur-sm">
                            <div className="px-6 py-3 border-b-2 border-[#830f00]/20 mb-3">
                              <p className="text-sm font-bold text-[#830f00] uppercase tracking-wider">Filter by Category</p>
                            </div>
                            <div className="max-h-[450px] overflow-y-auto px-2 custom-scrollbar">
                              {projectCategories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setIsProjectsMenuOpen(false);
                                    sessionStorage.setItem('selectedProjectCategory', category);
                                    window.location.hash = '#projects';
                                  }}
                                  className={`w-full text-left block px-5 py-3.5 my-1 text-[15px] rounded-lg transition-all duration-300 font-medium group relative overflow-hidden
                                    ${category === "All" 
                                      ? "bg-gradient-to-r from-[#830f00] to-[#a01200] text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]" 
                                      : "text-[#4a4a4a] hover:bg-gradient-to-r hover:from-[#830f00] hover:to-[#a01200] hover:text-white hover:shadow-md hover:transform hover:scale-[1.02]"
                                    }`}
                                >
                                  <span className="relative z-10 flex items-center gap-3">
                                    {category === "All" && (
                                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                                    )}
                                    <span className={category === "All" ? "font-semibold" : ""}>{category}</span>
                                  </span>
                                  {category !== "All" && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#830f00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Other nav links
                    <a
                      key={label}
                      href={to}
                      onClick={(e) => {
                        if (id === "about") {
                          e.preventDefault();
                          window.location.hash = "#home";
                          setTimeout(() => {
                            window.location.hash = "#about";
                          }, 100);
                        }
                      }}
                      className={`transition ${
                        activeHash === to
                          ? "text-[#830f00] border-b-2 border-[#830f00]"
                          : "text-[#6e4e3a] hover:text-[#830f00]"
                      }`}
                    >
                      {label}
                    </a>
                  )
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <HeartHandshake className="text-red-800 hidden sm:block" />
              <span className="text-xs font-medium hidden lg:inline">
                Join Us And Become A Volunteer
              </span>
              {activeSectionIs !== "contribute" && (
                <a href="#contribute">
                  <Button className="bg-[#830f00] text-white px-3 py-1.5 sm:px-6 sm:py-2 flex gap-2 items-center rounded-md text-xs sm:text-sm">
                    {hero.contributeText}
                  </Button>
                </a>
              )}
              {/* Hamburger Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center md:hidden">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5">
                <X className="w-8 h-8 text-gray-800" />
              </button>
              <nav className="flex flex-col gap-8 text-center">
                {navLinks.map(({ to, label, id }) => (
                  <a
                    key={label}
                    href={to}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      // Special handling for About Us link
                      if (id === "about") {
                        e.preventDefault();
                        // First navigate to home, then scroll to about
                        window.location.hash = "#home";
                        setTimeout(() => {
                          window.location.hash = "#about";
                        }, 100);
                      }
                    }}
                    className={`text-2xl font-semibold transition ${
                      activeHash === to
                        ? "text-[#830f00]"
                        : "text-[#6e4e3a] hover:text-[#830f00]"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
