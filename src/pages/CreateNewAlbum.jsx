// frontend/components/CreateNewAlbum.jsx
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import useFetch from "../useFetch";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUsers, 
  FaFolderPlus, 
  FaCheck, 
  FaTimes,
  FaSearch
} from "react-icons/fa";
import { 
  MdOutlineDescription, 
  MdPersonAdd, 
  MdClose,
  MdCheckCircle
} from "react-icons/md";

export default function CreateNewAlbum() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // Load user info safely
  useEffect(() => {
    try {
      const data = localStorage.getItem("jwtToken");
      if (data) {
        const userDetails = JSON.parse(data);
        setUserInfo(userDetails);
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
      localStorage.removeItem('jwtToken');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch users
  const {
    data: usersList,
    loading: userLoading,
    error: userError,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);

  // Memoized data
  const userData = useMemo(() => {
    if (!usersList?.users || !userInfo?.email) return null;
    return usersList.users.find(user => user.email === userInfo.email);
  }, [usersList, userInfo]);

  const ownerId = userData?._id;
  const availableUsers = useMemo(() => {
    if (!usersList?.users) return [];
    return usersList.users
      .filter(user => user?._id !== ownerId)
      .filter(user => 
        user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearch.toLowerCase())
      );
  }, [usersList, ownerId, userSearch]);

  // Handlers
  const toggleUser = (userId) => {
    setSharedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const removeUser = (userId, e) => {
    e.stopPropagation();
    setSharedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    const newData = {
      name: name.trim(),
      description: description.trim(),
      ownerId,
      sharedUsers
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/albums`,
        newData
      );
      console.log('Album created:', response.data);
      toast.success("🎉 Album created successfully!");
      
      // Reset form
      setName("");
      setDescription("");
      setSharedUsers([]);
      
      // Navigate after delay
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setSubmitError(error);
      toast.error(error.response?.data?.message || "Failed to create album");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Skeleton
  if (userLoading) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          <Header />
          <div className="row g-4 mt-4">
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="placeholder-glow p-4">
                  <span className="placeholder col-6 bg-secondary-subtle rounded-pill mb-3 d-block"></span>
                  <span className="placeholder col-12 bg-secondary-subtle rounded-3" style={{height:'44px'}}></span>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <span className="placeholder col-5 bg-secondary-subtle rounded-pill mb-4 d-block"></span>
                  <div className="d-flex flex-column gap-4">
                    {[1,2,3].map(i => (
                      <div key={i}>
                        <span className="placeholder col-3 bg-secondary-subtle rounded mb-2 d-block"></span>
                        <span className="placeholder col-12 bg-secondary-subtle rounded-3" style={{height:'48px'}}></span>
                      </div>
                    ))}
                    <span className="placeholder col-4 bg-secondary-subtle rounded-3" style={{height:'44px'}}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <Header />
        
        <div className="row g-4 mt-4">
          
          {/* ✨ Sidebar */}
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sidebar-sticky">
              <div className="card-header bg-gradient-primary text-white border-0 py-4 px-4">
                <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                  <FaFolderPlus className="fs-4" />
                  <span>New Album</span>
                </h5>
                <p className="mb-0 small opacity-75 mt-1">Create & Share</p>
              </div>
              
              <div className="card-body p-4">
                <Link 
                  to="/dashboard"
                  className="btn btn-outline-secondary w-100 mb-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium hover-lift"
                >
                  <FaArrowLeft className="fs-5" />
                  <span>Back to Dashboard</span>
                </Link>

                {/* Quick Tips */}
                <div className="bg-light-subtle rounded-3 p-4">
                  <h6 className="fw-semibold text-dark mb-3 small">💡 Tips</h6>
                  <ul className="list-unstyled small text-muted mb-0" style={{lineHeight:'1.6'}}>
                    <li className="mb-2">• Choose a descriptive name</li>
                    <li className="mb-2">• Add details in description</li>
                    <li>• Share with friends & family</li>
                  </ul>
                </div>

                {/* Progress Indicator */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">Progress</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className={`d-flex align-items-center gap-2 small ${name.trim() ? 'text-success' : 'text-muted'}`}>
                      {name.trim() ? <MdCheckCircle className="text-success" /> : <span className="bg-muted rounded-circle" style={{width:'16px',height:'16px'}}></span>}
                      <span>Album Name</span>
                    </div>
                    <div className={`d-flex align-items-center gap-2 small ${description.trim() ? 'text-success' : 'text-muted'}`}>
                      {description.trim() ? <MdCheckCircle className="text-success" /> : <span className="bg-muted rounded-circle" style={{width:'16px',height:'16px'}}></span>}
                      <span>Description</span>
                    </div>
                    <div className={`d-flex align-items-center gap-2 small ${sharedUsers.length > 0 ? 'text-success' : 'text-muted'}`}>
                      {sharedUsers.length > 0 ? <MdCheckCircle className="text-success" /> : <span className="bg-muted rounded-circle" style={{width:'16px',height:'16px'}}></span>}
                      <span>Shared Users ({sharedUsers.length})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ✨ Main Form */}
          <main className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                
                {/* Header */}
                <div className="mb-5">
                  <h3 className="fw-bold text-dark mb-2">Create New Album</h3>
                  <p className="text-muted mb-0">Fill in the details below to create your photo album</p>
                </div>

                {/* Error Alert */}
                {submitError && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-3 d-flex align-items-start gap-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Failed to create album</h6>
                      <p className="mb-0 small">{submitError.response?.data?.message || submitError.message || "An error occurred"}</p>
                    </div>
                    <button 
                      onClick={() => setSubmitError(null)}
                      className="btn btn-link text-danger p-0 ms-auto"
                    >
                      <MdClose className="fs-5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* Album Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaFolderPlus className="text-primary" />
                      Album Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 border-light-subtle shadow-sm focus-ring focus-ring-primary py-3"
                      id="name"
                      placeholder="e.g., Summer Vacation 2024"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <small className="form-text text-muted mt-2">
                      Choose a clear, descriptive name for your album
                    </small>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <MdOutlineDescription className="text-primary" />
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control form-control-lg rounded-3 border-light-subtle shadow-sm focus-ring focus-ring-primary py-3"
                      id="description"
                      placeholder="Tell us about this album..."
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      disabled={isSubmitting}
                      style={{ resize: 'vertical', minHeight: '120px' }}
                    />
                    <small className="form-text text-muted mt-2">
                      Add details like location, event, or memories to capture
                    </small>
                  </div>

                  {/* Share with Users */}
                  <div className="mb-5">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaUsers className="text-primary" />
                      Share with Users <span className="text-danger">*</span>
                    </label>
                    
                    {/* Search Box */}
                    <div className="position-relative mb-3">
                      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        className="form-control rounded-3 border-light-subtle shadow-sm ps-5 py-2"
                        placeholder="Search users by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Selected Users Chips */}
                    {sharedUsers.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {sharedUsers.map(userId => {
                          const user = usersList?.users?.find(u => u._id === userId);
                          if (!user) return null;
                          return (
                            <span 
                              key={userId}
                              className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-medium"
                            >
                              {user.name}
                              <button
                                type="button"
                                onClick={(e) => removeUser(userId, e)}
                                className="btn btn-link text-primary p-0 lh-1"
                                disabled={isSubmitting}
                                aria-label={`Remove ${user.name}`}
                              >
                                <FaTimes size={12} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* User Selection Grid */}
                    <div className="border rounded-3 p-3 bg-light-subtle" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {userError ? (
                        <p className="text-danger small mb-0">Failed to load users</p>
                      ) : availableUsers.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {availableUsers.map(user => {
                            const isSelected = sharedUsers.includes(user._id);
                            return (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => toggleUser(user._id)}
                                disabled={isSubmitting}
                                className={`btn px-3 py-2 rounded-3 d-flex align-items-center gap-2 transition-all small fw-medium ${
                                  isSelected 
                                    ? 'btn-primary shadow-sm' 
                                    : 'btn-outline-secondary bg-white hover-bg'
                                }`}
                                aria-pressed={isSelected}
                              >
                                {isSelected ? <FaCheck size={14} /> : <MdPersonAdd size={16} />}
                                <span>{user.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">
                          {userSearch ? 'No users match your search' : 'No other users available to share with'}
                        </p>
                      )}
                    </div>
                    
                    <small className="form-text text-muted mt-2 d-block">
                      Select users who can view and contribute to this album
                    </small>
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-outline-secondary px-4 py-3 rounded-3 fw-medium hover-lift"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !description.trim()}
                      className="btn btn-primary px-5 py-3 rounded-3 fw-medium d-flex align-items-center gap-2 shadow-lg hover-lift flex-grow-1"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Creating Album...</span>
                        </>
                      ) : (
                        <>
                          <FaFolderPlus className="fs-5" />
                          <span>Create Album</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>
          </main>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="light" />
      
      {/* ✨ Custom Styles */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hover-lift {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        .tracking-wide {
          letter-spacing: 0.05em;
        }
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25);
        }
        .focus-ring-primary:focus {
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25);
        }
        .hover-bg:hover {
          background-color: rgba(102, 126, 234, 0.08) !important;
        }
        .sidebar-sticky {
          position: sticky !important;
          top: calc(1rem + 70px) !important;
          z-index: 1020 !important;
        }
        /* Custom scrollbar for user list */
        .border::-webkit-scrollbar {
          width: 6px;
        }
        .border::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }
        .border::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}