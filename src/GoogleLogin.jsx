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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --glass-bg: rgba(255, 255, 255, 0.15);
          --glass-border: rgba(255, 255, 255, 0.25);
        }

        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; margin: 0; background: #f8f9fa; }
        
        .landing-wrapper {
          background: var(--primary-gradient);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Glassmorphism Navbar */
        .glass-nav {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          padding: 1rem 0;
        }
        .glass-nav .nav-link { font-weight: 500; transition: color 0.3s ease; }
        .glass-nav .nav-link:hover { color: #ffd700 !important; }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 60px;
        }
        .hero-mockup {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease;
        }
        .hero-mockup:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
        }
        .highlight {
          background: linear-gradient(90deg, #ffd700, #ffaa00);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Google Sign-In Container & Styling */
        .google-auth-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
        }
        .google-auth-divider hr {
          width: 70px;
          margin: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.35);
        }
        .google-auth-divider span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Feature Cards */
        .feature-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
        }
        .feature-icon {
          font-size: 2.8rem;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Buttons */
        .btn-primary {
          background: #ffd700;
          border: none;
          color: #1a1a2e;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background: #e6c200;
          transform: scale(1.05);
        }
        .btn-light {
          background: #ffffff;
          color: #5a4fcf;
          border: none;
          transition: all 0.3s ease;
        }
        .btn-light:hover {
          background: #f8f9fa;
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        /* Footer */
        footer a:hover { opacity: 1 !important; }
        .hover-opacity-100:hover { opacity: 1 !important; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.4rem; }
          .hero-section { padding-top: 80px; }
          .google-auth-divider { flex-direction: column; gap: 0.5rem; }
          .google-auth-divider hr { width: 50px; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top glass-nav">
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="#">
            AppName
          </a>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <a className="nav-link text-white" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#testimonials">
                  Testimonials
                </a>
              </li>
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <a
                  className="btn btn-primary rounded-pill px-4"
                  href="#download"
                >
                  Download App
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section d-flex align-items-center">
        <div className="container text-center text-white">
          <h1 className="display-3 fw-bold mb-3">
            Transform Your Workflow with{" "}
            <span className="highlight">AppName</span>
          </h1>
          <p className="lead mb-4 opacity-90">
            The all-in-one solution designed to boost productivity, streamline
            collaboration, and help you achieve more every day.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a
              href="#download"
              className="btn btn-light btn-lg rounded-pill px-5 fw-bold"
            >
              Get Started Free
            </a>
            <a
              href="#demo"
              className="btn btn-outline-light btn-lg rounded-pill px-5"
            >
              Watch Demo
            </a>
          </div>

          {/* Google Sign-In Section */}
          <div className="google-auth-divider">
            <hr />
            <span>or continue with</span>
            <hr />
          </div>

          <button
            onClick={googleLogin}
            className="btn btn-lg btn-outline-primary rounded-pill px-4 py-2 shadow-sm"
            style={{
              minWidth: "240px",
              fontSize: "1.1rem",
              transition: "all 0.2s ease",
              background: "#ffffff",
              color: "#4285F4",
              borderColor: "#4285F4",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add("shadow");
              e.currentTarget.style.background = "#4285F4";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove("shadow");
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#4285F4";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              width="20"
              height="20"
              className="me-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ verticalAlign: "text-bottom" }}
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-5">
            <img
              src="https://placehold.co/800x450/ffffff/667eea?text=App+Preview"
              alt="App Preview"
              className="img-fluid rounded-4 shadow-lg hero-mockup"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-5 position-relative z-2">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white">Why Choose AppName?</h2>
            <p className="text-white opacity-75">
              Powerful features built for modern teams
            </p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Optimized performance ensures zero lag, even with heavy workloads.",
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                desc: "End-to-end encryption and compliance-ready architecture.",
              },
              {
                icon: "🔄",
                title: "Seamless Sync",
                desc: "Real-time synchronization across all your devices and platforms.",
              },
            ].map((feature, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm feature-card">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mb-3">{feature.icon}</div>
                    <h3 className="h5 fw-bold">{feature.title}</h3>
                    <p className="text-muted mb-0">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="download" className="py-5 position-relative z-2">
        <div className="container">
          <div
            className="bg-white p-5 rounded-4 shadow-lg text-center mx-auto"
            style={{ maxWidth: "700px" }}
          >
            <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
            <p className="text-muted mb-4">
              Join over 50,000+ users who are already transforming their
              productivity.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-dark btn-lg rounded-pill px-4">
                App Store
              </button>
              <button className="btn btn-outline-dark btn-lg rounded-pill px-4">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-white bg-dark bg-opacity-50">
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} AppName. All rights reserved.
          </p>
          <div className="mt-2">
            <a
              href="#"
              className="text-white mx-2 text-decoration-none opacity-75 hover-opacity-100"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-white mx-2 text-decoration-none opacity-75 hover-opacity-100"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-white mx-2 text-decoration-none opacity-75 hover-opacity-100"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default GoolgeLogin;
