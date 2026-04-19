// frontend/components/ImageDetails.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { 
  FaArrowLeft, 
  FaHeart, 
  FaRegHeart,
  FaDownload,
  FaExpand
} from "react-icons/fa";
import { 
  MdDelete, 
  MdAccessTime,
  MdComment,
  MdOutlineImage,
  MdCheck
} from "react-icons/md";
import useFetch from "../useFetch";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ImageDetails() {
  const { albumId, imageId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [userInfo, setUserInfo] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Load user info safely
  useEffect(() => {
    try {
      const data = localStorage.getItem('jwtToken');
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

  // Fetch data
  const { data: usersList, loading: usersLoading } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
  const { data: imageData, loading: imageLoading, error: imageError, refetch } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`);

  // Get user data
  const userData = useCallback(() => {
    if (!usersList?.users || !userInfo?.email) return null;
    return usersList.users.find(user => user.email === userInfo.email);
  }, [usersList, userInfo]);

  // Format date to IST
  const formatToIST = (uploadedAt) => {
    if (!uploadedAt) return "—";
    const date = new Date(uploadedAt);
    if (isNaN(date.getTime())) return "—";
    const istTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    return istTime.toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handlers
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const commentData = {
        comments: [
          ...imageData.image.comments,
          { text: comment, author: userData()._id }
        ]
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`, commentData);
      toast.success("Comment added!");
      setComment("");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setSubmitError(error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Delete this image permanently? This cannot be undone.")) return;
    
    setIsSubmitting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`);
      toast.success("Image deleted!");
      setTimeout(() => navigate(`/albums/${albumId}`), 700);
    } catch (error) {
      setSubmitError(error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFavorite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`, {
        isFavorite: !imageData?.image?.isFavorite
      });
      toast.success(imageData?.image?.isFavorite ? "Removed from favorites" : "Added to favorites");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      toast.error("Failed to update favorite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLightbox = () => setShowLightbox(true);
  const closeLightbox = (e) => {
    if (e.target === e.currentTarget) setShowLightbox(false);
  };

  // Loading Skeleton
  if (imageLoading || usersLoading) {
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
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="placeholder bg-secondary-subtle rounded-4" style={{aspectRatio:'1/1'}}></div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex-column gap-3">
                        <span className="placeholder col-8 bg-secondary-subtle rounded-pill"></span>
                        <span className="placeholder col-12 bg-secondary-subtle rounded mb-2"></span>
                        <span className="placeholder col-12 bg-secondary-subtle rounded mb-2"></span>
                      </div>
                    </div>
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
                  <MdOutlineImage className="fs-4" />
                  <span>Image</span>
                </h5>
                <p className="mb-0 small opacity-75 mt-1">Details & Actions</p>
              </div>
              
              <div className="card-body p-4">
                <Link 
                  to={`/albums/${albumId}`}
                  className="btn btn-outline-secondary w-100 mb-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium hover-lift"
                >
                  <FaArrowLeft className="fs-5" />
                  <span>Back to Album</span>
                </Link>

                {/* Quick Actions */}
                <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">Actions</h6>
                <div className="d-flex flex-column gap-2">
                  <button
                    onClick={handleAddFavorite}
                    disabled={isSubmitting}
                    className={`btn w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium transition-all ${
                      imageData?.image?.isFavorite 
                        ? 'btn-danger bg-danger-subtle text-danger border-danger-subtle' 
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {imageData?.image?.isFavorite ? <FaHeart /> : <FaRegHeart />}
                    <span>{imageData?.image?.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
                  </button>
                  
                  <a
                    href={imageData?.image?.imageUrl}
                    download={imageData?.image?.name || 'image'}
                    className="btn btn-outline-secondary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium hover-lift"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </a>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className={`btn w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium transition-all ${
                      isSubmitting ? 'btn-secondary disabled' : 'btn-outline-danger hover-lift'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <MdDelete className="fs-5" />
                    )}
                    <span>{isSubmitting ? 'Deleting...' : 'Delete Image'}</span>
                  </button>
                </div>

                {/* Image Stats */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">Details</h6>
                  <div className="d-flex flex-column gap-3 small">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Size</span>
                      <span className="fw-medium">{formatFileSize(imageData?.image?.size)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Uploaded</span>
                      <span className="fw-medium">{formatToIST(imageData?.image?.uploadedAt)}</span>
                    </div>
                    {imageData?.image?.tags && (
                      <div>
                        <span className="text-muted d-block mb-1">Tags</span>
                        <div className="d-flex flex-wrap gap-1">
                          {imageData.image.tags.split(',').slice(0, 4).map((tag, i) => (
                            <span key={i} className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1" style={{fontSize:'0.7rem'}}>
                              {tag.trim()}
                            </span>
                          ))}
                          {imageData.image.tags.split(',').length > 4 && (
                            <span className="badge bg-light text-muted rounded-pill px-2 py-1" style={{fontSize:'0.7rem'}}>
                              +{imageData.image.tags.split(',').length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ✨ Main Content */}
          <main className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                
                {/* Error State */}
                {imageError && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-3 d-flex align-items-center gap-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Failed to load image</h6>
                      <p className="mb-0 small">{imageError}</p>
                    </div>
                    <button onClick={refetch} className="btn btn-outline-danger btn-sm ms-auto">Retry</button>
                  </div>
                )}

                {/* Image Content - Only show if imageData and imageData.image exist */}
                {imageData?.image ? (
                  <>
                    {/* Image Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
                      <div>
                        <h3 className="fw-bold text-dark mb-2">{imageData.image.name || 'Untitled Image'}</h3>
                        <p className="text-muted mb-0 small d-flex align-items-center gap-2">
                          <MdAccessTime /> Uploaded {formatToIST(imageData.image.uploadedAt)}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={openLightbox}
                          className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium hover-lift"
                        >
                          <FaExpand className="fs-5" />
                          <span className="d-none d-sm-inline">View Full Size</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Image Card */}
                    <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-5 col-lg-4">
                          <div 
                            className="position-relative h-100 min-vh-200 cursor-zoom-in"
                            onClick={openLightbox}
                            style={{ minHeight: '250px', cursor: 'zoom-in' }}
                          >
                            <img 
                              src={imageData.image.imageUrl} 
                              alt={imageData.image.name || 'Image'}
                              className="position-absolute w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400/f1f5f9/94a3b8?text=Image+Not+Found';
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-7 col-lg-8">
                          <div className="card-body p-4">
                            <h5 className="card-title fw-semibold mb-3">Image Details</h5>
                            
                            <div className="mb-3">
                              <span className="text-muted small d-block">Album Name</span>
                              <Link to={`/albums/${imageData.image.albumId?._id}`} className="text-decoration-none fw-medium text-primary">
                                {imageData.image.albumId?.name || 'Album'}
                              </Link>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-muted small d-block">Persons</span>
                              <div className="d-flex flex-wrap gap-2 mt-1">
                                {imageData.image.person?.length > 0 ? (
                                  imageData.image.person.map((person) => (
                                    <span key={person?._id} className="badge bg-secondary mx-1 py-2 px-3 rounded-pill">
                                      {person?.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-muted small">No Person</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-muted small d-block">Tags</span>
                              <div className="d-flex flex-wrap gap-2 mt-1">
                                {imageData.image?.tags ? (
                                  imageData.image.tags.split(",").map((tag, index) => (
                                    <span key={index} className="badge bg-danger mx-1 py-2 px-3 rounded-pill">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-muted small">No Tags</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-muted small d-block">Size</span>
                              <span className="fw-medium">{formatFileSize(imageData.image.size)}</span>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-muted small d-block">Uploaded At</span>
                              <span className="fw-medium">{formatToIST(imageData.image.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                      <div className="card-body p-4">
                        <h4 className="card-title fw-bold mb-4 d-flex align-items-center gap-2">
                          <MdComment className="text-primary" />
                          Comments
                          <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                            {imageData.image.comments?.length || 0}
                          </span>
                        </h4>
                        
                        {/* Comment Form */}
                        <form onSubmit={handleComment} className="mb-4">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control rounded-3 border-light-subtle shadow-sm focus-ring focus-ring-primary py-3"
                              placeholder="Add Comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              disabled={isSubmitting}
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting || !comment.trim()}
                              className="btn btn-primary px-4 rounded-3 fw-medium d-flex align-items-center gap-2 hover-lift"
                              style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none'
                              }}
                            >
                              {isSubmitting ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <MdCheck className="fs-5" />
                              )}
                              <span>{isSubmitting ? 'Adding...' : 'Add'}</span>
                            </button>
                          </div>
                          {submitError && (
                            <p className="text-danger small mt-2 mb-0">{submitError.message}</p>
                          )}
                        </form>

                        {/* Comments List */}
                        <ul className="list-group list-group-flush">
                          {imageData.image.comments?.length > 0 ? (
                            imageData.image.comments.map((comment, index) => (
                              <li key={index} className="list-group-item border-0 mb-3 pb-3 border-bottom">
                                <div className="d-flex gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="bg-primary-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                                         style={{ width: '44px', height: '44px', fontSize: '1rem' }}>
                                      {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                      <h6 className="fw-bold mb-0">{comment.author?.name || 'Anonymous'}</h6>
                                      <span className="text-muted small">{formatToIST(comment.createdAt)}</span>
                                    </div>
                                    <p className="mb-0 text-dark">{comment.text}</p>
                                  </div>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item border-0 text-center py-4 text-muted">
                              <MdComment className="fs-1 opacity-25 mb-2" />
                              <p className="mb-0">No Comments</p>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Empty State - Only show when imageData or imageData.image doesn't exist */
                  <div className="text-center py-5 my-4">
                    <div className="bg-light-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" 
                         style={{ width: '80px', height: '80px' }}>
                      <MdOutlineImage className="text-muted" style={{ fontSize: '2.5rem' }} />
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">Image not found</h5>
                    <p className="text-muted mb-4 small">This image may have been deleted or moved</p>
                    <Link 
                      to={`/albums/${albumId}`}
                      className="btn btn-primary px-4 py-2 rounded-3 fw-medium d-inline-flex align-items-center gap-2 shadow-sm hover-lift"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      <FaArrowLeft />
                      <span>Back to Album</span>
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ✨ Lightbox Modal */}
      {showLightbox && imageData?.image?.imageUrl && (
        <div 
          className="lightbox-overlay position-fixed top-0 start-0 w-100 h-100 bg-black/90 d-flex align-items-center justify-content-center"
          onClick={closeLightbox}
          style={{ zIndex: 9999 }}
        >
          <img 
            src={imageData.image.imageUrl}
            alt={imageData.image.name}
            onClick={closeLightbox}
            className="img-fluid rounded-3"
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
          />
        </div>
      )}

      <ToastContainer position="bottom-right" theme="light" />
      
      {/* ✨ Custom Styles */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-primary-gradient {
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
        .object-fit-cover {
          object-fit: cover;
        }
        .cursor-zoom-in {
          cursor: zoom-in;
        }
        .tracking-wide {
          letter-spacing: 0.05em;
        }
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25);
        }
        .sidebar-sticky {
          position: sticky !important;
          top: calc(1rem + 70px) !important;
          z-index: 1020 !important;
        }
        .lightbox-overlay {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .min-vh-200 {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}