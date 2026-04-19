// frontend/pages/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  MdLockOutline, 
  MdShield, 
  MdCheckCircle, 
  MdErrorOutline,
  MdPhotoLibrary 
} from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Handle successful Google sign-in
  const handleLoginSuccess = async (credentialResponse) => {
    const { credential: idToken } = credentialResponse;

    if (!idToken) {
      setError("No ID token received from Google");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed on server");
      }

      const { token, user } = data;
      
      // Save auth data securely
      localStorage.setItem(
        "jwtToken",
        JSON.stringify({
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          token,
          lastLogin: new Date().toISOString(),
        })
      );

      setSuccess(true);
      
      // Smooth redirect after brief success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    setError("Google sign-in was cancelled. Please try again.");
  };

  // Clear error when component unmounts or location changes
  useEffect(() => {
    return () => {
      setError(null);
      setSuccess(false);
    };
  }, [location]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-login-gradient py-4 px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            
            {/* ✨ Main Login Card */}
            <div className="card border-0 shadow-2xl rounded-4 overflow-hidden animate-fadeInUp">
              
              {/* Gradient Header with Branding */}
              <div className="card-header bg-gradient-primary text-white border-0 py-5 px-4 text-center position-relative">
                {/* Decorative Background Pattern */}
                <div className="position-absolute inset-0 opacity-10">
                  <div className="pattern-dots"></div>
                </div>
                
                <div className="position-relative z-1">
                  {/* Logo/Brand */}
                  <div className="d-inline-flex align-items-center justify-content-center bg-white/20 backdrop-blur-sm rounded-circle mb-4 shadow-sm" 
                       style={{ width: '72px', height: '72px' }}>
                    <MdPhotoLibrary className="text-white" style={{ fontSize: '2rem' }} />
                  </div>
                  
                  <h2 className="fw-bold mb-2 display-6">Welcome to KaviosPix</h2>
                  <p className="mb-0 opacity-90 small">
                    Sign in to organize, share, and cherish your memories
                  </p>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                
                {/* Success State */}
                {success && (
                  <div className="alert alert-success border-0 bg-success-subtle text-success rounded-3 d-flex align-items-start gap-3 mb-4 animate-fadeIn" role="status">
                    <MdCheckCircle className="fs-4 mt-1 flex-shrink-0" />
                    <div>
                      <h6 className="alert-heading fw-semibold mb-1">Signed in successfully!</h6>
                      <p className="mb-0 small">Redirecting you to your dashboard...</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="alert alert-danger border-0 bg-danger-subtle text-danger rounded-3 d-flex align-items-start gap-3 mb-4 animate-fadeIn" role="alert">
                    <MdErrorOutline className="fs-4 mt-1 flex-shrink-0" />
                    <div>
                      <h6 className="alert-heading fw-semibold mb-1">Sign-in failed</h6>
                      <p className="mb-0 small">{error}</p>
                    </div>
                    <button 
                      onClick={() => setError(null)}
                      className="btn-close btn-close-danger ms-auto"
                      aria-label="Dismiss"
                    ></button>
                  </div>
                )}

                {/* ✨ Value Proposition Cards */}
                <div className="row g-3 mb-5">
                  {[
                    { icon: MdShield, title: "Secure & Private", desc: "Your photos are encrypted and protected" },
                    { icon: MdPhotoLibrary, title: "Beautiful Albums", desc: "Organize memories with elegant collections" },
                    { icon: MdLockOutline, title: "Google Sign-In", desc: "Fast, secure authentication you trust" }
                  ].map((item, idx) => (
                    <div className="col-4" key={idx}>
                      <div className="text-center p-3 bg-light-subtle rounded-3 h-100 hover-lift transition-all">
                        <item.icon className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                        <h6 className="fw-semibold small mb-1 text-dark">{item.title}</h6>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✨ Google Sign-In Section */}
                <div className="text-center mb-4">
                  <p className="text-muted small mb-3">Continue with your Google account</p>
                  
                  {/* Custom Styled Google Button Wrapper */}
                  <div className="d-flex justify-content-center">
                    <div className="google-login-wrapper">
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                        useOneTap={false}
                        size="large"
                        shape="rectangular"
                        theme="outline"
                        width="280"
                        logo_alignment="center"
                        text="continue_with"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="position-relative my-4">
                  <hr className="text-muted opacity-25" />
                  <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">
                    or
                  </span>
                </div>

                {/* Alternative Sign-In Options (Placeholder for future) */}
                <div className="text-center">
                  <p className="text-muted small mb-3">More sign-in options coming soon</p>
                  <div className="d-flex justify-content-center gap-3 opacity-50">
                    <button className="btn btn-outline-secondary btn-sm rounded-circle" disabled style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-apple"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm rounded-circle" disabled style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-envelope"></i>
                    </button>
                  </div>
                </div>

              </div>

              {/* Card Footer */}
              <div className="card-footer bg-light border-0 py-3 px-4 text-center">
                <p className="mb-0 small text-muted">
                  By signing in, you agree to our{' '}
                  <a href="/terms" className="text-decoration-none fw-medium text-primary hover-underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-decoration-none fw-medium text-primary hover-underline">Privacy Policy</a>
                </p>
              </div>
            </div>

            {/* ✨ Trust Badges */}
            <div className="text-center mt-4">
              <div className="d-inline-flex align-items-center gap-3 text-muted small opacity-75">
                <span className="d-flex align-items-center gap-1">
                  <MdShield className="text-success" /> End-to-end encrypted
                </span>
                <span className="d-none d-sm-inline">•</span>
                <span className="d-flex align-items-center gap-1">
                  <MdCheckCircle className="text-success" /> GDPR compliant
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ✨ Custom Styles */}
      <style>{`
        /* Gradient Background */
        .bg-login-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Card Header Gradient */
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        /* Decorative Pattern */
        .pattern-dots {
          background-image: radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px);
          background-size: 24px 24px;
          width: 100%;
          height: 100%;
        }
        
        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        
        /* Hover Effects */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        .hover-underline:hover {
          text-decoration: underline !important;
        }
        
        /* Google Button Styling Override */
        .google-login-wrapper > div {
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1) !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .google-login-wrapper > div:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Backdrop Blur Support */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
        
        /* Shadow Utilities */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        
        /* Responsive Typography */
        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;