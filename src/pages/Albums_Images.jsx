// frontend/components/Albums_Images.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  MdDelete, 
  MdKeyboardArrowRight, 
  MdPhotoLibrary,
  MdFavorite,
  MdOutlineImage,
  MdAccessTime,
  MdPeople,
  MdCheck
} from "react-icons/md";
import { FaArrowLeft, FaFolder, FaCamera } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import useFetch from "../useFetch";
import Header from "../components/Header";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Albums_Images() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // Load user info safely
  useEffect(() => {
    try {
      const data = localStorage.getItem('jwtToken');
      if (data) setUserInfo(JSON.parse(data));
    } catch (error) {
      console.error('Failed to load user info:', error);
      localStorage.removeItem('jwtToken');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data
  const { data: usersList, loading: usersLoading } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
  const { data: albumsList, loading: albumLoading, error: albumError } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/albums`);
  const { data: selectedAlbum, loading: albumDetailLoading } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`);
  const { data: imagesList, loading: imageLoading, error: imageError } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/images`);

  // Memoized user & album data
  const userData = useMemo(() => {
    if (!usersList?.users || !userInfo?.email) return null;
    return usersList.users.find(user => user.email === userInfo.email);
  }, [usersList, userInfo]);

  const albums = useMemo(() => {
    if (!albumsList?.albums || !userData?._id) return [];
    return albumsList.albums.filter(album => 
      album?.ownerId?._id === userData._id || 
      album?.sharedUsers?.some(user => user?._id === userData._id)
    );
  }, [albumsList, userData]);

  const currentAlbum = selectedAlbum?.album || {};
  const isOwner = currentAlbum.ownerId?._id === userData?._id;

  // Available tags (subset for UI cleanliness)
  const popularTags = [
    "portrait", "landscape", "nature", "travel", "sunset", "architecture",
    "food", "wedding", "urban", "wildlife", "beach", "mountain", 
    "night", "family", "mobilephotography", "blackandwhite"
  ];
  const allTags = [
    ...popularTags,
    "streetphotography", "macro", "pet", "dog", "cat", "fashion", 
    "ocean", "forest", "cityscape", "aerial", "drone", "minimal", 
    "vintage", "film", "bokeh", "goldenhour", "bluehour", "astrophotography", 
    "longexposure", "reflection", "documentary", "event", "concert", 
    "sports", "fitness", "baby", "newborn", "pregnancy", "selfie", 
    "mirrorselfie", "iphoneonly", "analog", "35mm", "polaroid", 
    "flatlay", "detail", "texture", "color", "monochrome", "symmetry", 
    "pattern", "silhouette"
  ];

  // Filter images
  const images = useMemo(() => {
    if (!imagesList?.images) return [];
    
    let filtered = imagesList.images.filter(img => img?.albumId?._id === albumId);
    
    if (filter === "Favorite") {
      filtered = filtered.filter(img => img?.isFavorite);
    }
    
    if (selectedTags.length > 0) {
      const tagSet = new Set(selectedTags.map(t => t.toLowerCase()));
      filtered = filtered.filter(img => 
        img.tags?.split(",").some(tag => tagSet.has(tag.trim().toLowerCase()))
      );
    }
    
    return filtered;
  }, [imagesList, albumId, filter, selectedTags]);

  // Handlers
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this album and all its images? This cannot be undone.")) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`);
      console.log('Album deleted:', response.data);
      toast.success("Album deleted successfully!");
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (error) {
      setSubmitError(error);
      toast.error(error.response?.data?.message || "Failed to delete album");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  // Loading Skeletons
  if (albumDetailLoading || imageLoading || usersLoading) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          <Header />
          <div className="row g-4 mt-4">
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="placeholder-glow p-4">
                  <span className="placeholder col-6 bg-secondary-subtle rounded-pill mb-3 d-block"></span>
                  <div className="d-flex flex-column gap-2">
                    {[1,2,3,4].map(i => <span key={i} className="placeholder col-12 bg-secondary-subtle rounded-3" style={{height:'44px'}}></span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="placeholder col-5 bg-secondary-subtle rounded-pill"></span>
                    <div className="d-flex gap-2">
                      <span className="placeholder bg-secondary-subtle rounded-3" style={{width:'40px',height:'40px'}}></span>
                      <span className="placeholder bg-secondary-subtle rounded-3" style={{width:'40px',height:'40px'}}></span>
                    </div>
                  </div>
                  <div className="row g-3">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div className="col-6 col-md-4 col-lg-3" key={i}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                          <div className="placeholder bg-secondary-subtle" style={{height:'180px'}}></div>
                          <div className="card-body p-3">
                            <span className="placeholder col-8 bg-secondary-subtle rounded mb-2"></span>
                            <span className="placeholder col-12 bg-secondary-subtle rounded"></span>
                          </div>
                        </div>
                      </div>
                    ))}
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
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" 
       style={{ top: '80px' }}> 
              <div className="card-header bg-gradient-primary text-white border-0 py-4 px-4">
                <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                  <MdPhotoLibrary className="fs-4" />
                  <span>Albums</span>
                </h5>
                <p className="mb-0 small opacity-75 mt-1">{albums?.length} album{albums.length !== 1 ? 's' : ''}</p>
              </div>
              
              <div className="card-body p-4">
                <Link 
                  to="/dashboard" 
                  className="btn btn-outline-secondary w-100 mb-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium hover-lift"
                >
                  <FaArrowLeft className="fs-5" />
                  <span>Back to Dashboard</span>
                </Link>

                <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">Your Albums</h6>
                <div className="d-flex flex-column gap-2">
                  {albums.length > 0 ? albums.map(album => (
                    <Link
                      key={album._id}
                      to={`/albums/${album._id}`}
                      className={`text-decoration-none p-3 rounded-3 d-flex align-items-center gap-3 transition-all ${
                        album._id === albumId 
                          ? 'bg-primary-subtle border border-primary-subtle text-primary fw-medium shadow-sm' 
                          : 'bg-white border border-light text-dark hover-bg'
                      }`}
                    >
                      <div className={`rounded-2 d-flex align-items-center justify-content-center ${
                        album._id === albumId ? 'bg-primary text-white' : 'bg-light text-muted'
                      }`} style={{width:'36px',height:'36px'}}>
                        <FaFolder />
                      </div>
                      <div className="flex-grow-1 text-truncate">
                        <div className="small fw-medium">{album.name}</div>
                        <div className="text-muted" style={{fontSize:'0.75rem'}}>
                          {imagesList?.images?.filter((img)=>img.albumId?._id===album._id)?.length || 0} image{imagesList?.images?.filter((img)=>img.albumId===album._id)?.length>1 ? 's' : ''}
                        </div>
                      </div>
                      {album._id === albumId && <MdKeyboardArrowRight className="text-primary" />}
                    </Link>
                  )) : (
                    <div className="text-center py-4 text-muted small">
                      {albumLoading ? <div className="spinner-border spinner-border-sm text-primary mb-2"></div> : <FaFolder className="fs-3 mb-2 opacity-25" />}
                      <p className="mb-0">{albumError ? 'Error loading albums' : 'No albums yet'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* ✨ Main Content */}
          <main className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                
                {/* Album Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
                  <div>
                    <h3 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                      {currentAlbum.name || 'Untitled Album'}
                      {!isOwner && (
                        <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill small fw-medium px-3 py-1">
                          Shared with you
                        </span>
                      )}
                    </h3>
                    {currentAlbum.description && (
                      <p className="text-muted mb-0 small">{currentAlbum.description}</p>
                    )}
                    <div className="d-flex flex-wrap gap-3 mt-2 text-muted small">
                      <span className="d-flex align-items-center gap-1">
                        <MdAccessTime /> {formatDate(currentAlbum.createdAt)}
                      </span>
                      {currentAlbum.sharedUsers?.length > 1 && (
                        <span className="d-flex align-items-center gap-1">
                          <MdPeople /> {currentAlbum.sharedUsers.length} collaborators
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="d-flex gap-2 align-items-center">
                      <Link 
                        to={`/albums/${albumId}/editAlbum`}
                        className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium hover-lift"
                      >
                        <CiEdit className="fs-5" />
                        <span className="d-none d-sm-inline">Edit</span>
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className={`btn d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium hover-lift ${
                          isSubmitting ? 'btn-secondary disabled' : 'btn-outline-danger'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            <span className="d-none d-sm-inline">Deleting...</span>
                          </>
                        ) : (
                          <>
                            <MdDelete className="fs-5" />
                            <span className="d-none d-sm-inline">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {submitError.response?.data?.message || submitError.message || "An error occurred"}
                  </div>
                )}

                {/* Filter Bar */}
                <div className="bg-light-subtle rounded-3 p-3 mb-4">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() => setFilter("All")}
                      className={`btn btn-sm px-3 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 transition-all ${
                        filter === "All" ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                    >
                      <MdPhotoLibrary />
                      <span>All ({images.length})</span>
                    </button>
                    <button
                      onClick={() => setFilter("Favorite")}
                      className={`btn btn-sm px-3 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 transition-all ${
                        filter === "Favorite" ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                    >
                      <MdFavorite />
                      <span>Favorites ({images.filter(i => i.isFavorite).length})</span>
                    </button>
                  </div>

                  {/* Modern Tag Selector */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-medium mb-0 small text-secondary">Filter by Tags</label>
                      {selectedTags.length > 0 && (
                        <button 
                          onClick={clearTags}
                          className="btn btn-link text-decoration-none p-0 small text-primary fw-medium"
                        >
                          Clear all ({selectedTags.length})
                        </button>
                      )}
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2">
                      {(showAllTags ? allTags : popularTags).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`btn btn-sm px-3 py-1 rounded-pill d-flex align-items-center gap-2 transition-all ${
                            selectedTags.includes(tag)
                              ? 'btn-primary shadow-sm'
                              : 'btn-outline-secondary bg-white'
                          }`}
                          aria-pressed={selectedTags.includes(tag)}
                        >
                          {selectedTags.includes(tag) ? <MdCheck size={14} /> : <span style={{width:'14px'}}></span>}
                          <span className="small fw-medium">{tag}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAllTags(prev => !prev)}
                        className="btn btn-sm px-3 py-1 rounded-pill btn-light text-muted small fw-medium"
                      >
                        {showAllTags ? 'Show Less' : `+ ${allTags.length - popularTags.length} more`}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                {imageError && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-3 d-flex align-items-center gap-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Failed to load images</h6>
                      <p className="mb-0 small">{imageError}</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!imageLoading && images.length === 0 && !imageError && (
                  <div className="text-center py-5 my-4">
                    <div className="bg-light-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" 
                         style={{ width: '80px', height: '80px' }}>
                      <MdOutlineImage className="text-muted" style={{ fontSize: '2.5rem' }} />
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">
                      {filter !== "All" || selectedTags.length > 0 ? 'No matching images' : 'No images yet'}
                    </h5>
                    <p className="text-muted mb-4 small">
                      {filter !== "All" || selectedTags.length > 0 
                        ? 'Try adjusting your filters or tags' 
                        : 'Upload your first photo to this album'}
                    </p>
                    <Link 
                      to={`/albums/${albumId}/uploadNewImage`}
                      className="btn btn-primary px-4 py-2 rounded-3 fw-medium d-inline-flex align-items-center gap-2 shadow-sm hover-lift"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      <FaCamera />
                      <span>Upload Image</span>
                    </Link>
                  </div>
                )}

                {/* ✨ Image Grid */}
                {images?.length > 0 && (
                  <div className="row g-3 g-md-4">
                    {images?.map((image) => (
                      <div className="col-6 col-md-4 col-lg-3" key={image._id}>
                        <Link 
                          to={`/albums/${albumId}/images/${image._id}`}
                          className="text-decoration-none"
                        >
                          <div className="card image-card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-lift transition-all bg-white">
                            <div className="position-relative" style={{ aspectRatio: '1/1' }}>
                              <img 
                                src={image.imageUrl} 
                                alt={image.name || 'Image'}
                                className="w-100 h-100 object-fit-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/400x400/f1f5f9/94a3b8?text=No+Image';
                                }}
                              />
                              
                              {/* Overlay */}
                              <div className="position-absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover-opacity transition-all"></div>
                              
                              {/* Favorite Badge */}
                              {image.isFavorite && (
                                <div className="position-absolute top-3 end-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                                  <MdFavorite className="text-danger fs-5" />
                                </div>
                              )}
                            </div>
                            
                            <div className="card-body p-3">
                              <h6 className="card-title fw-medium text-dark small line-clamp-1 mb-1">
                                {image.name}
                              </h6>
                              <div className="d-flex flex-wrap gap-1">
                                {image.tags?.split(",").slice(0, 2).map((tag, i) => (
                                  <span key={i} className="badge bg-light text-muted rounded-pill px-2 py-1" style={{fontSize:'0.65rem'}}>
                                    {tag.trim()}
                                  </span>
                                ))}
                                {image.tags?.split(",").length > 2 && (
                                  <span className="badge bg-light text-muted rounded-pill px-2 py-1" style={{fontSize:'0.65rem'}}>
                                    +{image.tags.split(",").length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {images.length > 0 && (
                  <div className="text-center mt-5">
                    <Link
                      to={`/albums/${albumId}/uploadNewImage`}
                      className="btn btn-primary px-5 py-3 rounded-3 fw-medium d-inline-flex align-items-center gap-2 shadow-lg hover-lift"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      <FaCamera className="fs-5" />
                      <span>Upload New Image</span>
                    </Link>
                  </div>
                )}

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
        .bg-gradient-to-t {
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        .hover-lift {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .tracking-wide {
          letter-spacing: 0.05em;
        }
        .hover-opacity:hover {
          opacity: 1 !important;
        }
        .translate-y-full {
          transform: translateY(100%);
        }
        .hover-translate-y-0:hover {
          transform: translateY(0) !important;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        .hover-bg:hover {
          background-color: rgba(102, 126, 234, 0.08) !important;
        }
        .image-card:hover .hover-opacity {
          opacity: 1;
        }
        .image-card:hover .translate-y-full {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}