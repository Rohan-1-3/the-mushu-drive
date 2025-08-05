import React from 'react';
import FeatureCard from './FeatureCard';
import useMobileDetection from '../../hooks/useMobileDetection';

// Feature card data
const featureGroups = [
    // Group 1: single full-width card
    {
        layout: 'single',
        features: [
            {
                icon: '🔒',
                title: 'Enterprise-Grade Security',
                description: 'Your files are protected with military-grade AES-256 encryption, zero-knowledge architecture, and advanced threat detection. Rest assured your data is safer than ever.',
                animation: 'fade-up',
                gradient: 'from-blue-500 to-cyan-500',
            },
        ],
    },
    // Group 2: two cards side-by-side
    {
        layout: 'double',
        features: [
            {
                icon: '⚡',
                title: 'Lightning Fast Transfers',
                description: 'Experience blazing-fast uploads and downloads with our optimized CDN network and smart compression algorithms.',
                animation: 'fade-right',
                gradient: 'from-yellow-500 to-orange-500',
            },
            {
                icon: '🔗',
                title: 'Smart Sharing',
                description: 'Generate secure, customizable share links with expiration dates, password protection, and download limits.',
                animation: 'fade-left',
                gradient: 'from-green-500 to-emerald-500',
            },
        ],
    },
    // Group 3: two cards side-by-side
    {
        layout: 'double',
        features: [
            {
                icon: '🔄',
                title: 'Real-time Collaboration',
                description: 'Work together seamlessly with real-time file synchronization, version control, and collaborative editing features.',
                animation: 'fade-up',
                gradient: 'from-purple-500 to-violet-500',
            },
            {
                icon: '🌐',
                title: 'Universal Access',
                description: 'Access your files from any device, anywhere in the world. Our progressive web app works offline too.',
                animation: 'fade-up',
                gradient: 'from-indigo-500 to-blue-500',
            },
        ],
    },
    // Group 4: single full-width card
    {
        layout: 'single',
        features: [
            {
                icon: '🤖',
                title: 'AI-Powered Organization',
                description: 'Let artificial intelligence automatically organize, tag, and categorize your files. Smart search finds exactly what you need in seconds, even in huge file collections.',
                animation: 'fade-up',
                gradient: 'from-pink-500 to-rose-500',
            },
        ],
    },
];

function FeaturesSection() {
    const isMobile = useMobileDetection();
    
    return (
        <section className="relative z-0 py-20 px-6 overflow-hidden bg-white dark:bg-black">
            {/* Simple decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-15 blur-3xl bg-gray-600"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl bg-gray-600"></div>
            
            <div className="relative z-10">
                {/* Section header */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-5xl font-bold mb-4 text-black dark:text-white">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
