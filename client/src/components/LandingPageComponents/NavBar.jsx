import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMobileDetection from '../../hooks/useMobileDetection';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isMobile = useMobileDetection();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="w-full px-6 py-4 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10">
            <div className="relative z-10 mx-auto flex justify-between items-center">

                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rotate-45 rounded-sm shadow-lg bg-primary"></div>
                    <span className="font-bold tracking-widest text-text-dark">MINI DRIVE</span>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-6 text-sm tracking-wider">
                    <a href="#" className="text-text-dark hover:text-accent2-dark transition-colors duration-300">HOME</a>
                    <a href="#" className="text-text-dark hover:text-accent2-dark transition-colors duration-300">ABOUT</a>
                    <a href="#" className="text-text-dark hover:text-accent2-dark transition-colors duration-300">DRIVE</a>
                    <a href="#" className="text-text-dark hover:text-accent2-dark transition-colors duration-300">CONTACT</a>
                </div>

                {/* Desktop Login Button */}
                <div className="hidden md:block">
                    <Link 
                        to="/login"
                        className="px-6 py-2 rounded-full border-2 border-accent2-dark text-sm text-text-dark font-semibold bg-accent2-dark/10 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:scale-105"
                    >
                        LOGIN
                    </Link>
                </div>

                {/* Mobile Hamburger Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                    aria-label="Toggle mobile menu"
                >
                    <div className="w-6 h-6 flex flex-col justify-center items-center">
                        <span className={`block w-5 h-0.5 bg-text-dark transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1'}`}></span>
                        <span className={`block w-5 h-0.5 bg-text-dark transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-text-dark transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobile && (
                <>
                    {/* Mobile Menu */}
                    <div className={`fixed top-full left-0 right-0 z-40 transform transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                        <div className="mx-6 mt-2 mb-4 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
                            {/* Mobile Nav Links */}
                            <div className="py-2">
                                <a
                                    href="#"
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-4 text-text-dark hover:bg-white/20 dark:hover:bg-white/10 hover:text-accent2-dark transition-all duration-300 font-medium tracking-wider"
                                >
                                    HOME
                                </a>
                                <a
                                    href="#"
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-4 text-text-dark hover:bg-white/20 dark:hover:bg-white/10 hover:text-accent2-dark transition-all duration-300 font-medium tracking-wider"
                                >
                                    ABOUT
                                </a>
                                <a
                                    href="#"
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-4 text-text-dark hover:bg-white/20 dark:hover:bg-white/10 hover:text-accent2-dark transition-all duration-300 font-medium tracking-wider"
                                >
                                    DRIVE
                                </a>
                                <a
                                    href="#"
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-4 text-text-dark hover:bg-white/20 dark:hover:bg-white/10 hover:text-accent2-dark transition-all duration-300 font-medium tracking-wider"
                                >
                                    CONTACT
                                </a>
                            </div>

                            {/* Mobile Login Button */}
                            <div className="p-6 border-t border-white/20 dark:border-white/10">
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-6 py-3 rounded-full border-2 border-accent2-dark text-text-dark font-semibold bg-accent2-dark/10 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:scale-105 text-center"
                                >
                                    LOGIN
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;