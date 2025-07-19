import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FeatureCard from './FeatureCard';

// Feature card data
const featureGroups = [
    // Group 1: single full-width card
    {
        layout: 'single',
        features: [
            {
                imageSrc: 'https://img.freepik.com/premium-vector/cloud-storage-concept-illustration_114360-26718.jpg',
                title: 'Secure Cloud Storage',
                description: 'Your files are encrypted and safely stored in the cloud. Access them anytime, anywhere.',
                animation: 'fade-up',
            },
        ],
    },
    // Group 2: two cards side-by-side
    {
        layout: 'double',
        features: [
            {
                imageSrc: 'https://img.freepik.com/premium-vector/cloud-storage-concept-illustration_114360-26718.jpg',
                title: 'Blazing Fast',
                description: 'Lightning fast uploads and downloads to keep you moving.',
                animation: 'fade-right',
            },
            {
                imageSrc: 'https://img.freepik.com/premium-vector/cloud-storage-concept-illustration_114360-26718.jpg',
                title: 'Easy Sharing',
                description: 'Share with anyone in seconds using secure links.',
                animation: 'fade-left',
            },
        ],
    },
    // Group 3: two cards side-by-side
    {
        layout: 'double',
        features: [
            {
                imageSrc: 'https://img.freepik.com/premium-vector/cloud-storage-concept-illustration_114360-26718.jpg',
                title: 'Real-time Sync',
                description: 'Your files sync across all devices instantly.',
                animation: 'fade-up',
            },
            {
                imageSrc: 'https://img.freepik.com/premium-vector/cloud-storage-concept-illustration_114360-26718.jpg',
                title: 'Anywhere Access',
                description: 'Log in from any device, anytime, anywhere.',
                animation: 'fade-up',
            },
        ],
    },
];

function FeaturesSection() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <section className="bg-primary-op py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
                Features
            </h2>
            <div className="max-w-7xl mx-auto space-y-12">
                {featureGroups.map((group, idx) => {
                    if (group.layout === 'single') {
                        return group.features.map((feature, i) => (
                            <div key={`feature-${idx}-${i}`} data-aos={feature.animation} className="w-full">
                                <FeatureCard {...feature} imageSide={"right"} />
                            </div>
                        ));
                    } else if (group.layout === 'double') {
                        return (
                            <div key={`group-${idx}`} className="grid md:grid-cols-2 gap-6">
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
        </section>
    );
}

export default FeaturesSection;
