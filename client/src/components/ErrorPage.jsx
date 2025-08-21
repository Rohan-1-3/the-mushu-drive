import { Link } from "react-router";

function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-teal-50 to-teal-100 text-slate-700">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#6366f1" className="mb-4">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
            <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-lg mb-6 text-slate-500 text-center">
                You have wandered into the unknown<br />Please try again later or contact support if the issue persists.
            </p>
            <Link
                to="/drive"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-colors duration-200"
            >
                Go back to Home
            </Link>
        </div>
    );
}

export default ErrorPage;
