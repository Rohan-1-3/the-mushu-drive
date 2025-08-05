import React, { useEffect } from 'react';
import AOS from 'aos';
import HeroSection from '../components/LandingPageComponents/HeroSection';
import FeaturesSection from '../components/LandingPageComponents/FeaturesSection';
import ReviewsSection from '../components/LandingPageComponents/ReviewsSection';
import FAQs from '../components/LandingPageComponents/FAQs';
import CTASection from '../components/LandingPageComponents/CTASection';
import Navbar from '../components/LandingPageComponents/NavBar';

function LandingPage() {
    // Initialize AOS globally for the entire page
    useEffect(() => {
        AOS.init({ 
            duration: 1000,
            once: false,
            offset: 50,
            easing: 'ease-out-cubic',
            disable: 'phone' // Disable on mobile for better performance
        });
    }, []);

    return (
        <div className='w-full min-h-screen text-black dark:text-white bg-white dark:bg-black'>
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