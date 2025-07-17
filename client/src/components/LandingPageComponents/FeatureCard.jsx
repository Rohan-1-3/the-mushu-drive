import React from 'react';

function FeatureCard({ imageSrc, title, description }) {
    return (
        <div className="bg-[#1f0322] rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 dark:text-white">
            {/* Image */}
            <img src={imageSrc} alt={title} className="w-16 h-16 mx-auto mb-4" />

            {/* Title */}
            <h3 className="text-xl font-semibol">{title}</h3>

            {/* Description */}
            <p className="mt-2 text-sm">
                {description}
            </p>
        </div>
    );
}

export default FeatureCard;
