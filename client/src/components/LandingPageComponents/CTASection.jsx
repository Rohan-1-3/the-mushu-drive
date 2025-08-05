import React from 'react';
import CTAButton from "./CTAButton"

function CTASection() {
    return (
        <section className="relative text-center py-20 px-6 overflow-hidden bg-gray-600 dark:bg-gray-800">
            {/* Simple decorative elements */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-30 blur-3xl bg-gray-400"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-30 blur-3xl bg-gray-500"></div>
            
            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to simplify your cloud storage?</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Join thousands of users who rely on Mini Drive to store, share, and access their files anywhere, anytime.</p>
                <div className="mt-8">
                    <CTAButton label="Get Your Mini Drive" />
                </div>
            </div>
        </section>
    );
}

export default CTASection;