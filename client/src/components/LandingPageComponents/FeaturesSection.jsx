import React from 'react';
import FeatureCard from './FeatureCard';
import useMobileDetection from '../../hooks/useMobileDetection';
import { featureGroups } from '../../data';

function FeaturesSection() {
    const isMobile = useMobileDetection();
    
    return (
        <section className="relative z-0 py-20 px-6 overflow-hidden bg-bg-light dark:bg-bg-dark">
            
            <div className="relative z-10">
                {/* Section header */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-5xl font-bold mb-4 text-text-light dark:text-text-dark">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-text-light/70 dark:text-text-dark/70 max-w-2xl mx-auto">
                        Everything you need to store, share, and collaborate on your files with confidence and ease.
                    </p>
                </div>

                {/* Feature groups */}
                <div className="max-w-7xl mx-auto space-y-16">
                    {featureGroups.map((group, idx) => {
                        // On mobile, convert single layout to double layout
                        const effectiveLayout = isMobile && group.layout === 'single' ? 'double' : group.layout;
                        
                        if (effectiveLayout === 'single') {
                            return group.features.map((feature, i) => (
                                <div key={`feature-${idx}-${i}`} data-aos={feature.animation} className="w-full max-w-5xl mx-auto">
                                    <FeatureCard {...feature} imageSide={idx % 2 === 0 ? "right" : "left"} />
                                </div>
                            ));
                        } else if (effectiveLayout === 'double') {
                            return (
                                <div key={`group-${idx}`} className="grid lg:grid-cols-2 gap-8">
                                    {group.features.map((feature, i) => (
                                        <div key={`feature-${idx}-${i}`} data-aos={feature.animation}>
                                            <FeatureCard {...feature} />
                                        </div>
                                    ))}
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
