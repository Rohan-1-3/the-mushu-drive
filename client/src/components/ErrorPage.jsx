function ErrorPage() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Something went wrong!</h1>
            <p>The backend is not available yet.</p>
            <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Go back to home
            </a>
        </div>
    );
}

export default ErrorPage;
