import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import LandingPageLayout from "./Layouts/LandingPageLayout";
import ProtectedLayout from "./Layouts/ProtectedLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { API_BASE, authApi } from './lib/api.js';

async function checkAuth() {
    try {
        const data = await authApi.authenticate();
        return data.message === 'User authenticated';
    } catch {
        return false;
    }
}

async function protectedLoader({ request }) {
    const authed = await checkAuth();
    if (!authed) {
        const url = new URL(request.url);
        const to = '/login' + (url.pathname !== '/' ? `?from=${encodeURIComponent(url.pathname + url.search)}` : '');
        throw redirect(to);
    }
    return null;
}

async function authPageLoader() {
    const authed = await checkAuth();
    if (authed) throw redirect('/app');
    return null;
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPageLayout,
        children:[
            {index:true, Component: LandingPage}
        ]
    },
    {
        path: "/login",
        element: <AuthenticationPage />, loader: authPageLoader
    },
    {
        path: "/register",
        element: <AuthenticationPage />, loader: authPageLoader
    },
    {
        path: "/app",
        element: <ProtectedLayout />, loader: protectedLoader,
        children:[
            { index: true, element: <Dashboard /> }
        ]
    }
])