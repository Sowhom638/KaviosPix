// frontend/components/Header.jsx
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Safe localStorage parsing with error handling
  const loadUserInfo = useCallback(() => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const parsed = JSON.parse(token);
        setUserInfo(parsed);
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('jwtToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUserInfo(null);
    navigate('/login', { replace: true });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top"
           style={{ zIndex: 1040 }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="navbar-brand d-flex align-items-center">
            <div className="placeholder-glow">
              <span className="placeholder col-8 bg-secondary-subtle"></span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="placeholder placeholder-xs bg-secondary-subtle rounded-circle" style={{ width: '32px', height: '32px' }}></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top"
         style={{ zIndex: 1040 }}>
      <div className="container-fluid px-3 px-md-4">
        {/* Brand Logo */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center text-decoration-none"
          to="/dashboard"
        >
          <span className="bg-gradient-primary text-white rounded-2 p-2 me-2 shadow-sm">
            📷
          </span>
          <span className="d-none d-sm-inline text-dark fs-5">KaviosPix</span>
          <span className="d-inline d-sm-none text-dark fs-5">KP</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent" style={{ overflow: 'visible' }}>
          {userInfo ? (
            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* Welcome Message - Desktop Only */}
              <span className="d-none d-md-inline navbar-text text-muted small fw-medium">
                Welcome, <span className="text-dark fw-semibold">{userInfo.name?.split(' ')[0] || 'User'}</span>
              </span>

              {/* User Dropdown */}
              <div className="user-dropdown position-relative" style={{ zIndex: 1050 }}>
                <button
                  className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 border-0"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {/* Avatar */}
                  <div className="avatar-container position-relative">
                    <div className="avatar bg-primary-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold shadow-sm"
                         style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                      {userInfo.avatar ? (
                        <img 
                          src={userInfo.avatar} 
                          alt={userInfo.name}
                          className="rounded-circle object-fit-cover w-100 h-100"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span className={userInfo.avatar ? 'd-none' : 'd-flex'}>
                        {getInitials(userInfo.name)}
                      </span>
                    </div>
                    <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" 
                          style={{ width: '12px', height: '12px' }}
                          title="Online"></span>
                  </div>
                  
                  {/* Caret */}
                  <i className={`bi bi-chevron-down transition-transform small text-muted ${isDropdownOpen ? 'rotate-180' : ''}`} 
                     style={{ transition: 'transform 0.2s ease' }}></i>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 animate-fadeIn show" 
                       style={{ 
                         minWidth: '220px', 
                         animation: 'fadeIn 0.2s ease',
                         zIndex: 1060,
                         overflow: 'visible'  // 👈 KEY FIX: Allow content to show
                       }}>
                    
                    {/* User Info Header */}
                    <div className="dropdown-item-text py-3 px-3 border-bottom bg-light-subtle">
                      <p className="mb-0 fw-semibold text-dark small">{userInfo.name}</p>
                      <p className="mb-0 text-muted small">{userInfo.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <Link to="/dashboard" className="dropdown-item d-flex align-items-center gap-2 py-2">
                      <i className="bi bi-grid-3x3-gap text-muted"></i>
                      <span>Dashboard</span>
                    </Link>
                    <div className="dropdown-divider my-2"></div>
                    
                    {/* Logout - Now visible! */}
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger fw-medium"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest Actions */
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/login"
                className="btn btn-outline-secondary btn-sm px-3 py-2 fw-medium d-flex align-items-center gap-2 hover-lift"
              >
                <i className="bi bi-box-arrow-in-right"></i>
                <span className="d-none d-sm-inline">Log In</span>
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm px-3 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm hover-lift"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                <i className="bi bi-person-plus"></i>
                <span className="d-none d-sm-inline">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .rotate-180 {
          transform: rotate(180deg);
        }
        .transition-transform {
          transition: transform 0.2s ease;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
        /* ✅ FIXED: Allow dropdown content to show, hide scrollbar only on scrollable areas */
        .dropdown-menu {
          overflow: visible !important;
        }
        .dropdown-menu.show {
          display: block;
        }
        /* Ensure navbar collapse doesn't clip dropdown */
        .navbar-collapse {
          overflow: visible !important;
        }
      `}</style>
    </nav>
  );
}

export default Header;