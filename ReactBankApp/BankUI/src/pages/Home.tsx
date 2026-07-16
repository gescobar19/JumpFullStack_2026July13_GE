const Home = () => (
  <div className="container">
    <div className="hero-home">
      <h1>Welcome to ABC Digital Bank</h1>
      <p className="hero-subtitle">
        Secure, fast, and reliable banking services for the modern world.
      </p>
      <div className="hero-buttons">
        <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
        <a href="/about" className="btn btn-outline">Learn More</a>
      </div>
    </div>

    <div className="features">
      <div className="feature-card">
        <h3>Secure Accounts</h3>
        <p>Keep your money safe with top-tier security.</p>
      </div>
      <div className="feature-card">
        <h3>Instant Transfers</h3>
        <p>Send money instantly to friends and family.</p>
      </div>
      <div className="feature-card">
        <h3>Smart Insights</h3>
        <p>Track your spending with intelligent analytics.</p>
      </div>
    </div>
  </div>
)

export default Home