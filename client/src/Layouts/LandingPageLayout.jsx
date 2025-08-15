import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../components/LandingPageComponents/Footer';

function LandingPageLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark">
            {/* header placeholder handled elsewhere (Navbar likely outside layout) */}
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPageLayout;