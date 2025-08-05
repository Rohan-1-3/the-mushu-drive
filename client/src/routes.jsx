import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import LandingPageLayout from "./Layouts/LandingPageLayout";

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
        element: <AuthenticationPage />
    },
    {
        path: "/register",
        element: <AuthenticationPage />
    }
])