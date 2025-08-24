import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import LandingPageLayout from "./Layouts/LandingPageLayout";
import ProtectedLayout from "./Layouts/ProtectedLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import { API_BASE, authApi } from './lib/api.js';
import SharedFolder from "./pages/SharedFolder.jsx";

async function checkAuth() {
    try {
        // Since backend isn't implemented, always return false for now
        const data = await authApi.authenticate();
        return data.message === 'User authenticated';
    } catch (error) {
        console.log('Auth check failed:', error.message);
        return false;
    }
}

async function protectedLoader({ request }) {
    const authed = await checkAuth();
    if (!authed) {
        const url = new URL(request.url);
        // Get the pathname relative to the basename
        const basename = import.meta.env.BASE_URL;
        const relativePath = url.pathname.replace(basename, '/');
        const to = '/login' + (relativePath !== '/' ? `?from=${encodeURIComponent(relativePath + url.search)}` : '');
        throw redirect(to);
    }
    return null;
}

async function authPageLoader() {
    const authed = await checkAuth();
    if (authed) throw redirect('/drive');
    return null;
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPageLayout,
        errorElement: <ErrorPage />,
        children:[
            {index:true, Component: LandingPage}
        ]
    },
    {
        path: "/login",
        element: <AuthenticationPage />, 
        loader: authPageLoader,
        errorElement: <ErrorPage />
    },
    {
        path: "/register",
        element: <AuthenticationPage />, 
        loader: authPageLoader,
        errorElement: <ErrorPage />
    },
    {
        path: "/drive",
        element: <ProtectedLayout />, 
        loader: protectedLoader,
        errorElement: <ErrorPage />,
        children:[
            { index: true, element: <Dashboard /> },
            { path: "folder/:folderId", element: <Dashboard /> },
            { path: "share", element: <SharedFolder fromDriveShare={true} /> }
        ]
    },
    {
        id: "shared",
        path: "/shared",
        errorElement: <ErrorPage />,
        loader: checkAuth,
        children: [
            { index: true, element: <SharedFolder /> },
            { path: "folder/:folderId", element: <SharedFolder /> }
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
], {
    basename: import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.slice(0, -1)
})