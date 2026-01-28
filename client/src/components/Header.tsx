import { Button } from "@/components/ui/button";
import { HeartHandshake, Menu, X, ChevronDown } from "lucide-react";
import { getDynamicContent } from "@/pages/Home/dynamicContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useState, useEffect } from "react";

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

interface HeaderProps {
  // Header is now always white background, separated from carousel
}

export default function Header({ }: HeaderProps = {}) {
  const dynamicContent = getDynamicContent();
  const { navLinks, logo } = dynamicContent;
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
    <header className="sticky top-0 z-50 bg-white shadow-md py-2">
      <div className="flex justify-between items-center px-4 sm:px-10">
        <div className="flex items-center gap-4 sm:gap-12">
          <a href="/">
            <ImageWithFallback
              src={logo}
              alt="Logo"
              className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-contain"
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
                    // Navigate to home page first if not there
                    if (window.location.pathname !== "/") {
                      window.location.href = `/${to}`;
                    } else {
                      window.location.hash = to;
                    }
                  }}
                  className={`transition flex items-center gap-1 ${
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
                              // Navigate to home page with projects hash
                              if (window.location.pathname !== "/") {
                                window.location.href = '/#projects';
                              } else {
                                window.location.hash = '#projects';
                              }
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
                href={id === "home" ? "/" : `/${to}`}
                onClick={(e) => {
                  e.preventDefault();
                  
                  // Navigate to home page first
                  if (window.location.pathname !== "/") {
                    window.location.href = `/${to}`;
                  } else {
                    // Already on home page, just update hash
                    window.location.hash = to;
                  }
                }}
                className={`transition py-2 ${
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

      <div className="flex items-center gap-4">
        <a 
          href="/#volunteer" 
          className="hidden md:block"
          onClick={(e) => {
            if (window.location.pathname !== "/") {
              e.preventDefault();
              window.location.href = '/#volunteer';
            }
          }}
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#830f00] text-[#830f00] hover:bg-[#830f00] hover:text-white"
          >
            <HeartHandshake size={18} />
            Join Us And Become A Volunteer
          </Button>
        </a>
        <a 
          href="/#contribute"
          onClick={(e) => {
            if (window.location.pathname !== "/") {
              e.preventDefault();
              window.location.href = '/#contribute';
            }
          }}
        >
          <Button className="bg-[#830f00] hover:bg-[#6b0d00] text-white">
            Contribute
          </Button>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#830f00]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4">
            {navLinks.map(({ to, label, id }) => (
              <a
                key={label}
                href={id === "home" ? "/" : `/${to}`}
                className="py-3 border-b border-gray-200 text-[#6e4e3a] hover:text-[#830f00]"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  
                  // Navigate to home page first if not there
                  if (window.location.pathname !== "/") {
                    window.location.href = `/${to}`;
                  } else {
                    window.location.hash = to;
                  }
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="/#volunteer"
              className="py-3 border-b border-gray-200 text-[#6e4e3a] hover:text-[#830f00]"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                if (window.location.pathname !== "/") {
                  window.location.href = '/#volunteer';
                } else {
                  window.location.hash = '#volunteer';
                }
              }}
            >
              Join Us And Become A Volunteer
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
