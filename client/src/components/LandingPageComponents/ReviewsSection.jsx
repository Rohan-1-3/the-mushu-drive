import React, { useEffect, useRef, useState } from "react";
import ReviewCard from "./ReviewCard";
import { reviews } from "../../data";

function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });
  const carouselRef = useRef(null);

  // Number of cards to show based on screen size
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = getCardsPerView();
      if (newCardsPerView !== cardsPerView) {
        setCardsPerView(newCardsPerView);
        // Adjust current index if needed to prevent showing empty space
        const newMaxIndex = Math.max(0, reviews.length - newCardsPerView);
        if (currentIndex > newMaxIndex) {
          setCurrentIndex(newMaxIndex);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, cardsPerView]);

  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev >= maxIndex ? 0 : prev + 1;
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev <= 0 ? maxIndex : prev - 1;
      return newIndex;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
            Join thousands of satisfied users who trust Mini Drive for their storage needs
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 group"
                aria-label="Previous reviews"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 group"
                aria-label="Next reviews"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl mx-4 md:mx-12">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translate3d(-${currentIndex * (100 / cardsPerView)}%, 0, 0)`,
                width: '100%',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={`${review.name}-${index}`}
                  className="flex-shrink-0 flex-grow-0 px-2 md:px-3"
                  style={{ 
                    width: `${100 / cardsPerView}%`,
                    minWidth: `${100 / cardsPerView}%`,
                    maxWidth: `${100 / cardsPerView}%`,
                    flexBasis: `${100 / cardsPerView}%`,
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="h-full">
                    <ReviewCard {...review} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default ReviewsSection;
