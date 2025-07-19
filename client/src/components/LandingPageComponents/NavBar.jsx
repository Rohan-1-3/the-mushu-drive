import React from 'react';

function Navbar() {
    return (
        <nav className="w-full px-6 py-4 bg-primary bg-primary-dark  text-white shadow-lg sticky top-0 z-10">
            <div className="mx-auto flex justify-between items-center">

                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-pink-600 rotate-45 rounded-sm"></div>
                    <span className="font-bold tracking-widest">MINI DRIVE</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-6 text-sm tracking-wider">
                    <a href="#" className="hover:text-pink-500 transition">HOME</a>
                    <a href="#" className="hover:text-pink-500 transition">ABOUT</a>
                    <a href="#" className="hover:text-pink-500 transition">DRIVE</a>
                    <a href="#" className="hover:text-pink-500 transition">CONTACT</a>
                </div>

                {/* Login Button */}
                <div>
                    <button className="px-4 py-1 rounded border border-white text-sm hover:bg-pink-600 hover:border-pink-600 transition">
                        LOGIN
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;