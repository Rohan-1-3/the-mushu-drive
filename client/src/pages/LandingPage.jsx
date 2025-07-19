import React from 'react';
import HeroSection from '../components/LandingPageComponents/HeroSection';
import FeaturesSection from '../components/LandingPageComponents/FeaturesSection';
import ReviewsSection from '../components/LandingPageComponents/ReviewsSection';
import FAQs from '../components/LandingPageComponents/FAQs';
import CTASection from '../components/LandingPageComponents/CTASection';
import Navbar from '../components/LandingPageComponents/NavBar';

function LandingPage() {
    return (
        <div className='dark: text-white'>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <ReviewsSection />
            <FAQs />
            <CTASection />
            <footer className="text-center py-6 text-gray-500 mt-2 text-xl">
                &copy; 2025 <a href="https://github.com/rohan-1-3/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Rohan-1-3</a>. All rights reserved.
            </footer>

        </div>
    );
}

export default LandingPage;