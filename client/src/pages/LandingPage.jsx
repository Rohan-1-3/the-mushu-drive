import React, { useEffect } from 'react';
import AOS from 'aos';
import HeroSection from '../components/LandingPageComponents/HeroSection';
import FeaturesSection from '../components/LandingPageComponents/FeaturesSection';
import ReviewsSection from '../components/LandingPageComponents/ReviewsSection';
import FAQs from '../components/LandingPageComponents/FAQs';
import CTASection from '../components/LandingPageComponents/CTASection';
import Navbar from '../components/LandingPageComponents/NavBar';
import Sidebar from '../components/ui/Sidebar';

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
        <div className='w-full min-h-screen text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'>
            {/* <Sidebar /> */}
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <ReviewsSection />
            <FAQs />
            <CTASection />
            <footer className="text-center py-6 text-text-light/60 dark:text-text-dark/60 mt-2 text-xl">
                &copy; 2025 <a href="https://github.com/rohan-1-3/" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent2-dark hover:underline">Rohan-1-3</a>. All rights reserved.
            </footer>

        </div>
    );
}

export default LandingPage;