import React from 'react';
import { Outlet } from 'react-router';

function LandingPageLayout() {
    return (
        <div>
            {/* header */}
            <main>
                <Outlet />
            </main>
            {/* footer */}
        </div>
    );
}

export default LandingPageLayout;