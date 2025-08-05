function CTAButton({ label = "Get Started", className = "" }) {
    return (
        <button
            className={`inline-block px-8 py-4 rounded-full text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
        >
            {label}
        </button>
    );
}

export default CTAButton;
