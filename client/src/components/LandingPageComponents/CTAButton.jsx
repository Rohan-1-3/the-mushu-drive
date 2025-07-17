function CTAButton({ label = "Get Started", onClick, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`inline-block px-6 py-3 rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all font-semibold shadow-md ${className}`}
        >
            {label}
        </button>
    );
}

export default CTAButton;
