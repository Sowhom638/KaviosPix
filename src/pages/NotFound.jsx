import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light text-center p-3">
  <div className="mb-4">
    <div className="display-1 fw-bold text-muted">404</div>
    <h1 className="text-danger fw-bold">Page Not Found</h1>
    <p className="lead text-muted mt-3">
      {"Sorry, the page you're looking for doesn't exist."}
    </p>
  </div>

  <div className="mt-4">
    <button
      onClick={() => navigate('/')}
      className="btn btn-primary btn-lg px-5 py-2 rounded-pill shadow-sm"
      style={{ 
        minWidth: "180px",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
    >
      Go to Login
    </button>
  </div>

  <div className="mt-5 text-muted small">
    <p>© {new Date().getFullYear()} KaviosPix</p>
  </div>
</div>
    </>
  )
}

export default NotFound