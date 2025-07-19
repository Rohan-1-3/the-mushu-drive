import React from 'react';
import CTAButton from "./CTAButton"
function CTASection() {
    return (
        <section class="text-center py-10 rounded-xlmt-10">
            <h2 class="text-3xl font-bold mb-2">Ready to simplify your cloud storage?</h2>
            <p class="text-secondary mb-4 text-xl">Join thousands of users who rely on Mini Drive to store, share, and access their files anywhere, anytime.</p>
            <div className="mt-8">
                <CTAButton label="Get Your Mini Drive" />
            </div>
        </section>

    );
}

export default CTASection;