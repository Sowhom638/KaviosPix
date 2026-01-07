// frontend/components/Header.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const data = localStorage.getItem('jwtToken');
        const userDetails = JSON.parse(data);
        setUserInfo(userDetails);
    },[])

    const handleLogout = ()=>{
        localStorage.removeItem('jwtToken');
        navigate('/login');
    }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to="/dashboard"
        >
          <span className="ms-2">📷 KaviosPix</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          {userInfo ? (
            <ul className="navbar-nav align-items-center gap-3">
              <li className="nav-item">
                <span className="navbar-text text-muted fw-medium">
                  Hi, {userInfo.name || "User"}!
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-outline-danger d-flex align-items-center px-3 py-2"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Log out
                </button>
              </li>
            </ul>
          ) : (
            <Link
              to="/"
              className="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2"
              aria-label="Log in"
            >
              <i className="bi bi-google me-1"></i>
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;