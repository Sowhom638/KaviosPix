import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";

const GoolgeLogin = (props) => {
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        const token = result.data.token;
        const obj = { email, name, token, image };
        localStorage.setItem("jwtToken", JSON.stringify(obj));
        navigate("/dashboard");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
          --kp-purple: #6c5ce7;
          --kp-purple-dark: #5b4bc4;
          --kp-purple-light: #a29bfe;
          --kp-blue: #74b9ff;
          --kp-card-blue: #667eea;
          --kp-bg: #f4f5f7;
          --kp-text: #2d3436;
          --kp-text-muted: #636e72;
          --kp-white: #ffffff;
          --kp-shadow: 0 2px 12px rgba(108, 92, 231, 0.08);
          --kp-shadow-lg: 0 8px 30px rgba(108, 92, 231, 0.12);
          --kp-radius: 14px;
          --kp-radius-lg: 18px;
          --kp-gradient: linear-gradient(135deg, #6c5ce7 0%, #74b9ff 100%);
        }

        html { scroll-behavior: smooth; }
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
          margin: 0; 
          background: var(--kp-bg);
          color: var(--kp-text);
        }
        
        .kp-landing {
          background: var(--kp-white);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Navbar */
        .kp-nav {
          background: var(--kp-white);
          border-bottom: 1px solid #e8e8ec;
          padding: 1rem 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.95);
        }
        .kp-nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--kp-text);
          text-decoration: none;
        }
        .kp-nav-logo {
          width: 40px;
          height: 40px;
          background: var(--kp-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        .kp-nav-links { list-style: none; margin: 0; padding: 0; display: flex; gap: 2rem; align-items: center; }
        .kp-nav-links a { 
          color: var(--kp-text-muted); 
          text-decoration: none; 
          font-weight: 500; 
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .kp-nav-links a:hover { color: var(--kp-purple); }

        /* Hero */
        .kp-hero {
          padding: 140px 0 80px;
          background: linear-gradient(180deg, #f8f7ff 0%, var(--kp-white) 100%);
          position: relative;
        }
        .kp-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(108,92,231,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .kp-hero h1 {
          font-size: 3.2rem;
          font-weight: 800;
          color: var(--kp-text);
          line-height: 1.15;
          margin-bottom: 1.25rem;
        }
        .kp-hero h1 span {
          background: var(--kp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .kp-hero-sub {
          font-size: 1.2rem;
          color: var(--kp-text-muted);
          max-width: 550px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        .kp-hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .kp-btn-primary {
          background: var(--kp-gradient);
          color: white;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(108, 92, 231, 0.25);
        }
        .kp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(108, 92, 231, 0.35);
          color: white;
        }
        .kp-btn-secondary {
          background: var(--kp-white);
          color: var(--kp-text);
          border: 1px solid #e0e0e6;
          padding: 0.85rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .kp-btn-secondary:hover {
          border-color: var(--kp-purple-light);
          color: var(--kp-purple);
          transform: translateY(-2px);
        }

        /* Divider */
        .kp-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .kp-divider hr {
          width: 60px;
          border: none;
          border-top: 1px solid #e0e0e6;
          margin: 0;
        }
        .kp-divider span {
          color: var(--kp-text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Google Button */
        .kp-google-btn {
          background: var(--kp-white);
          border: 1px solid #e0e0e6;
          color: var(--kp-text);
          padding: 0.75rem 1.75rem;
          border-radius: 50px;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 240px;
          justify-content: center;
          box-shadow: var(--kp-shadow);
        }
        .kp-google-btn:hover {
          border-color: var(--kp-purple-light);
          box-shadow: var(--kp-shadow-lg);
          transform: translateY(-2px);
        }

        /* Hero Mockup */
        .kp-mockup-container {
          margin-top: 3rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .kp-mockup {
          width: 100%;
          border-radius: var(--kp-radius-lg);
          box-shadow: var(--kp-shadow-lg);
          border: 1px solid #e8e8ec;
        }

        /* Features */
        .kp-section {
          padding: 5rem 0;
        }
        .kp-section-title {
          text-align: center;
          margin-bottom: 3rem;
        }
        .kp-section-title h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--kp-text);
          margin-bottom: 0.75rem;
        }
        .kp-section-title p {
          color: var(--kp-text-muted);
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .kp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .kp-feature-card {
          background: var(--kp-white);
          border: 1px solid #e8e8ec;
          border-radius: var(--kp-radius);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: var(--kp-shadow);
        }
        .kp-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--kp-shadow-lg);
          border-color: var(--kp-purple-light);
        }
        .kp-feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, rgba(108,92,231,0.1) 0%, rgba(116,185,255,0.1) 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          font-size: 1.5rem;
        }
        .kp-feature-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--kp-text);
          margin-bottom: 0.5rem;
        }
        .kp-feature-card p {
          color: var(--kp-text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Stats */
        .kp-stats {
          background: var(--kp-bg);
          border-top: 1px solid #e8e8ec;
          border-bottom: 1px solid #e8e8ec;
        }
        .kp-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }
        .kp-stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--kp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }
        .kp-stat-label {
          color: var(--kp-text-muted);
          font-weight: 500;
          font-size: 0.95rem;
        }

        /* CTA Section */
        .kp-cta {
          padding: 5rem 0;
        }
        .kp-cta-card {
          background: var(--kp-gradient);
          border-radius: var(--kp-radius-lg);
          padding: 3.5rem;
          text-align: center;
          color: white;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .kp-cta-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 400px;
          height: 400px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
          pointer-events: none;
        }
        .kp-cta-card h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          position: relative;
        }
        .kp-cta-card p {
          opacity: 0.9;
          margin-bottom: 2rem;
          position: relative;
        }
        .kp-cta-card .kp-btn-cta {
          background: white;
          color: var(--kp-purple);
          border: none;
          padding: 0.85rem 2.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }
        .kp-cta-card .kp-btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        /* Footer */
        .kp-footer {
          background: var(--kp-text);
          color: rgba(255,255,255,0.6);
          padding: 2.5rem 0;
          text-align: center;
        }
        .kp-footer a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          margin: 0 0.75rem;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .kp-footer a:hover { color: white; }

        /* Responsive */
        @media (max-width: 992px) {
          .kp-features-grid { grid-template-columns: repeat(2, 1fr); }
          .kp-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        }
        @media (max-width: 768px) {
          .kp-hero h1 { font-size: 2.2rem; }
          .kp-hero-sub { font-size: 1rem; }
          .kp-features-grid { grid-template-columns: 1fr; }
          .kp-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .kp-cta-card { padding: 2.5rem 1.5rem; }
          .kp-nav-links { display: none; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="kp-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <a href="#" className="kp-nav-brand">
            <div className="kp-nav-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            KaviosPix
          </a>
          <ul className="kp-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#stats">Stats</a></li>
            <li><a href="#cta">Pricing</a></li>
            <li><a href="#" className="kp-btn-primary" style={{padding: '0.5rem 1.25rem', fontSize: '0.9rem'}}>Launch App</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="kp-hero text-center">
        <div className="container position-relative" style={{zIndex: 1}}>
          <h1>Organize Your Visual<br/><span>Collections Beautifully</span></h1>
          <p className="kp-hero-sub">Create, manage, and share albums effortlessly. KaviosPix helps you keep your images, screenshots, and reference materials perfectly organized.</p>
          
          <div className="kp-hero-buttons">
            <a href="#cta" className="kp-btn-primary">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#features" className="kp-btn-secondary">
              Learn More
            </a>
          </div>

          <div className="kp-divider">
            <hr /><span>or sign in with</span><hr />
          </div>

          <button
            onClick={googleLogin}
            className="kp-google-btn"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a29bfe';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(108, 92, 231, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e6';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(108, 92, 231, 0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="kp-mockup-container">
            <img 
              src="https://placehold.co/900x500/f8f7ff/6c5ce7?text=KaviosPix+Dashboard" 
              alt="KaviosPix Dashboard" 
              className="kp-mockup"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="kp-section">
        <div className="container">
          <div className="kp-section-title">
            <h2>Everything You Need</h2>
            <p>Powerful features designed for creators, developers, and teams</p>
          </div>
          <div className="kp-features-grid">
            {[
              { icon: "📁", title: "Smart Albums", desc: "Organize images into collections with custom tags, filters, and instant search." },
              { icon: "🔗", title: "Share & Collaborate", desc: "Generate shareable links and collaborate with your team in real-time." },
              { icon: "️", title: "Cloud Sync", desc: "Access your albums from any device with automatic cloud synchronization." },
              { icon: "🔒", title: "Secure & Private", desc: "Your data stays yours with end-to-end encryption and granular permissions." },
              { icon: "⚡", title: "Lightning Fast", desc: "Optimized for speed with instant loading and smooth scrolling." },
              { icon: "", title: "Beautiful UI", desc: "A clean, modern interface that makes managing your collections enjoyable." }
            ].map((feature, idx) => (
              <div className="kp-feature-card" key={idx}>
                <div className="kp-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="kp-section kp-stats">
        <div className="container">
          <div className="kp-stats-grid">
            <div>
              <div className="kp-stat-number">50K+</div>
              <div className="kp-stat-label">Active Users</div>
            </div>
            <div>
              <div className="kp-stat-number">2M+</div>
              <div className="kp-stat-label">Albums Created</div>
            </div>
            <div>
              <div className="kp-stat-number">99.9%</div>
              <div className="kp-stat-label">Uptime</div>
            </div>
            <div>
              <div className="kp-stat-number">4.9★</div>
              <div className="kp-stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="kp-cta">
        <div className="container">
          <div className="kp-cta-card">
            <h2>Ready to Organize Your Collections?</h2>
            <p>Join thousands of users who trust KaviosPix to keep their visual assets organized and accessible.</p>
            <a href="#" className="kp-btn-cta">
              Start for Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="kp-footer">
        <div className="container">
          <p style={{marginBottom: '0.75rem'}}>&copy; {new Date().getFullYear()} KaviosPix. All rights reserved.</p>
          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default GoolgeLogin;
