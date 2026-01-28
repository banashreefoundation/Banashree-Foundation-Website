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
import { getHeroCarouselImages } from "@/utils/imageLoader";

export default function HeroCarousel() {
  // Get hero carousel slides from database
  // Automatically fetches all images with category='hero' and key='carousel'
  const heroSlides = useMemo(() => getHeroCarouselImages(), []);
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  return (
    <div className="relative w-full h-auto md:h-[700px]">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative w-full h-auto md:h-[700px]">
                {/* Background color */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: slide.bgColor }}
                />

                {/* Single Full-Width Hero Image - Both Mobile and Desktop */}
                <ImageWithFallback
                  src={slide.image}
                  alt={`Hero Slide ${slide.id}`}
                  className="absolute inset-0 w-full h-full z-0"
                  fallbackType="placeholder"
                />

               {/* <ImageWithFallback
                  src={slide.image}
                  alt={`Hero Slide ${slide.id}`}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  fallbackType="placeholder"
                /> */}

                {/* Hero Text Block */}
                <div className="relative md:absolute md:top-[210px] md:left-[120px] w-full md:w-[720px] px-4 py-8 md:p-0 text-center md:text-left z-30 pt-24 md:pt-0">
                  {/* <p
                    className="text-[#3c3c3c] text-xl sm:text-2xl md:text-3xl font-medium mb-4"
                    style={{ fontFamily: "Maku, sans-serif" }}
                  >
                    {slide.subtitle}
                  </p>
                  <h2 className="text-2xl sm:text-4xl md:text-[50px] font-bold leading-tight md:leading-snug text-[#41402c] whitespace-pre-line">
                    {slide.title}
                  </h2> */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Only show if multiple slides */}
        {heroSlides.length > 1 && (
          <>
            {/* Desktop Arrows */}
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 md:left-8 h-14 w-14" />
              <CarouselNext className="right-4 md:right-8 h-14 w-14" />
            </div>

            {/* Mobile Arrows */}
            <div className="md:hidden">
              <CarouselPrevious className="left-2 top-[200px] h-10 w-10" />
              <CarouselNext className="right-2 top-[200px] h-10 w-10" />
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
            onClick={() => window.location.hash = '#contribute'}
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
