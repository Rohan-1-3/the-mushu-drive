import React from 'react';

function FeatureCard({ icon, title, description, imageSide }) {
    let layoutClass = 'flex-col'; // image on top by default
    if (imageSide === 'left') layoutClass = 'md:flex-row';
    if (imageSide === 'right') layoutClass = 'md:flex-row-reverse';

    return (
        <div
            className={`relative bg-accent2-light dark:bg-bg-dark backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-accent2-dark dark:border-accent1
                transform transition-all duration-500 ease-out
                hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-accent1/20
                flex ${layoutClass} gap-8 items-center group overflow-hidden`}
        >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-accent2-dark dark:bg-accent1/10
                opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl"></div>
            
            {/* Icon/Image */}
            <div className="relative z-10 flex-shrink-0 w-full md:w-1/3 max-w-[120px]">
                <div className="relative">
                    {/* Icon background circle */}
                    <div className="w-20 h-20 mx-auto md:mx-0 rounded-2xl bg-primary dark:bg-accent1
                        flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white text-3xl">
                            {icon}
                        </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto md:mx-0 rounded-2xl bg-primary dark:bg-accent1
                        blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
            </div>

            {/* Text */}
            <div className="relative z-10 flex-1 min-w-0 text-center md:text-left">
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3 group-hover:text-primary dark:group-hover:text-accent2-dark transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed group-hover:text-text-light dark:group-hover:text-text-dark transition-colors duration-300">
                    {description}
                </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-accent1 dark:bg-accent2-dark rounded-full opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent1 dark:bg-accent2-dark rounded-full opacity-50"></div>
        </div>
    );
}

export default FeatureCard;
