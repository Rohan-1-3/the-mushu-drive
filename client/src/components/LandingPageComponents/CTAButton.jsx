import { Link } from 'react-router-dom';

function CTAButton({ label = "Get Started", className = "", to = "/register" }) {
    return (
        <Link
            to={to}
            className={`inline-block px-8 py-4 rounded-full text-white bg-primary hover:bg-accent1 dark:bg-primary dark:hover:bg-accent1 focus:outline-none focus:ring-4 focus:ring-accent2-dark focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
        >
            {label}
        </Link>
    );
}

export default CTAButton;
