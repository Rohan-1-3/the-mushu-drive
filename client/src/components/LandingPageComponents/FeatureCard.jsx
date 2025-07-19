import React from 'react';

function FeatureCard({ imageSrc, title, description, imageSide }) {
    let layoutClass = 'flex-col'; // image on top by default
    if (imageSide === 'left') layoutClass = 'md:flex-row';
    if (imageSide === 'right') layoutClass = 'md:flex-row-reverse';

    return (
        <div
            className={`bg-secondary p-6 rounded-2xl shadow-md 
                transform transition-transform duration-300 
                hover:-translate-y-2 hover:shadow-xl 
                flex ${layoutClass} gap-6 items-center`}
        >
            {/* Image */}
            <div className="flex-shrink-0 w-full md:w-1/3 max-w-[150px]">
                <img
                    src={imageSrc}
                    alt={title}
                    className="mx-auto md:mx-0 rounded-lg max-h-40 object-contain"
                />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 break-words">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default FeatureCard;
