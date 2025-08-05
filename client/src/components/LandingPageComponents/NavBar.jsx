import React from 'react';

function Navbar() {
    return (
        <nav className="w-full px-6 py-4 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-black dark:bg-black">
            <div className="relative z-10 mx-auto flex justify-between items-center">

                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rotate-45 rounded-sm shadow-lg bg-gray-600"></div>
                    <span className="font-bold tracking-widest text-white">MINI DRIVE</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-6 text-sm tracking-wider">
                    <a href="#" className="text-white hover:opacity-70 transition-colors duration-300">HOME</a>
                    <a href="#" className="text-white hover:opacity-70 transition-colors duration-300">ABOUT</a>
                    <a href="#" className="text-white hover:opacity-70 transition-colors duration-300">DRIVE</a>
                    <a href="#" className="text-white hover:opacity-70 transition-colors duration-300">CONTACT</a>
                </div>

                {/* Login Button */}
                <div>
                    <button className="px-6 py-2 rounded-full border-2 border-white/30 text-sm text-white font-semibold bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                        LOGIN
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;