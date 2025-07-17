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
        </div>
    );
}

export default LandingPage;