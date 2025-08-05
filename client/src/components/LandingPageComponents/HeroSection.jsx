import React from 'react';
import CTAButton from './CTAButton';

function HeroSection() {
    return (
            <section className="relative w-full p-16 overflow-hidden bg-white dark:bg-black">
            {/* Simple decorative elements */}
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl bg-gray-600"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl bg-gray-600"></div>
            
            <div className="relative z-10 mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
                
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-black dark:text-white">
                        Mushu Drive <br />
                        <span className="text-gray-600 dark:text-gray-400">Power in Your Pocket</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-800 dark:text-gray-200">
                        Compact, fast, and secure. Mini Drive makes storing and sharing your files effortless — all in a sleek, portable design that fits right in your pocket.
                    </p>

                    <div className="mt-8">
                        <CTAButton label="Get Your Mini Drive" />
                    </div>
                </div>

                {/* SVG Image */}
                <div className="flex-1">
                    <svg
                        viewBox="0 0 900 600"
                        className="w-full max-w-md mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <g transform="translate(424.88897310757727 301.06337227782933)">
                            <path
                                d="M112.1 -119.9C167.7 -113.8 250.8 -111.1 296.1 -72.4C341.4 -33.7 349 41.1 329.4 108.7C309.7 176.2 262.7 236.6 203.3 240.7C143.8 244.8 71.9 192.7 6.2 184.2C-59.6 175.7 -119.1 210.8 -154.5 198.9C-189.8 186.9 -201 127.9 -225.5 69.3C-250.1 10.6 -288.2 -47.7 -289.3 -109.3C-290.4 -171 -254.5 -236 -200.1 -242.5C-145.8 -249 -72.9 -197 -22.3 -166.2C28.2 -135.5 56.4 -126 112.1 -119.9"
                                fill="#4b5563"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </section>

    );
}

export default HeroSection;