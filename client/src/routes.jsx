import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import LandingPageLayout from "./Layouts/LandingPageLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPageLayout,
        children:[
            {index:true, Component: LandingPage},
            {
                path: "login",
                // Component: 
            },
            {
                path: "register"
            }
        ]
    },
    {
        path:"/login",
        element: <AuthenticationPage />
    }
])