import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FeatureCard from './FeatureCard';

function FeaturesSection() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <section className="bg-gray-900 py-16 px-6">
            <p className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-center mb-4'>Features</p>
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Card 1 - Full Width with parallax + fade up */}
                <div
                    data-aos="fade-up"
                    className="w-full"
                >
                    <FeatureCard
                        imageSrc="/images/secure.svg"
                        title="Secure Cloud Storage"
                        description="Your files are encrypted and safely stored in the cloud. Access them anytime, anywhere."
                    />
                </div>

                {/* Cards 2 & 3 - Side by side */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div data-aos="fade-right">
                        <FeatureCard
                            imageSrc="/images/fast.svg"
                            title="Blazing Fast"
                            description="Lightning fast uploads and downloads to keep you moving."
                        />
                    </div>
                    <div data-aos="fade-left">
                        <FeatureCard
                            imageSrc="/images/share.svg"
                            title="Easy Sharing"
                            description="Share with anyone in seconds using secure links."
                        />
                    </div>
                </div>

                {/* Cards 4 & 5 - Side by side with bottom up animation */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div data-aos="fade-up">
                        <FeatureCard
                            imageSrc="/images/sync.svg"
                            title="Real-time Sync"
                            description="Your files sync across all devices instantly."
                        />
                    </div>
                    <div data-aos="fade-up">
                        <FeatureCard
                            imageSrc="/images/access.svg"
                            title="Anywhere Access"
                            description="Log in from any device, anytime, anywhere."
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default FeaturesSection;
