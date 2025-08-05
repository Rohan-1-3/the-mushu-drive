import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is a mobile device
 * @param {number} breakpoint - The breakpoint in pixels to consider as mobile (default: 768px)
 * @returns {boolean} - True if the device is mobile, false otherwise
 */
export const useMobileDetection = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to check if device is mobile
        const checkIsMobile = () => {
            const width = window.innerWidth;
            setIsMobile(width < breakpoint);
        };

        // Check on mount
        checkIsMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIsMobile);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, [breakpoint]);

    return isMobile;
};

export default useMobileDetection;
