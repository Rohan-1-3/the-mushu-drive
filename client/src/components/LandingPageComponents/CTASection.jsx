import React from 'react';
import CTAButton from "./CTAButton"

function CTASection() {
    return (
        <section className="relative text-center py-20 px-6 overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to simplify your cloud storage?</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Join thousands of users who rely on Mini Drive to store, share, and access their files anywhere, anytime.</p>
                <div className="mt-8">
                    <CTAButton label="Get Your Mini Drive" className="bg-white text-primary hover:bg-accent2-light " />
                </div>
            </div>
        </section>
    );
}

export default CTASection;