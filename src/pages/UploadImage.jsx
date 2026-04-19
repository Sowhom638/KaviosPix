// frontend/components/UploadImage.jsx
import { useState, useRef, useCallback, useMemo } from "react";
import Header from "../components/Header";
import useFetch from "../useFetch";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaCloudUploadAlt, 
  FaImage, 
  FaTimes, 
  FaCheck,
  FaSearch,
  FaUser,
  FaTag,
  FaInfoCircle
} from "react-icons/fa";
import { 
  MdClose, 
  MdPersonAdd, 
  MdAddPhotoAlternate,
  MdCloudUpload
} from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadImage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [person, setPerson] = useState([]);
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch users
  const {
    data: usersList,
    loading: userLoading,
    error: userError,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);

  const users = usersList?.users || [];

  // Comprehensive tags list
  const tagsList = useMemo(() => [
    "portrait", "landscape", "nature", "travel", "streetphotography",
    "blackandwhite", "sunset", "sunrise", "macro", "architecture",
    "food", "pet", "dog", "cat", "wedding", "fashion", "urban",
    "wildlife", "ocean", "beach", "mountain", "forest", "cityscape",
    "aerial", "drone", "minimal", "vintage", "film", "bokeh",
    "goldenhour", "bluehour", "night", "astrophotography", "longexposure",
    "reflection", "documentary", "event", "concert", "sports",
    "fitness", "family", "baby", "newborn", "pregnancy", "selfie",
    "mirrorselfie", "mobilephotography", "iphoneonly", "analog",
    "35mm", "polaroid", "flatlay", "detail", "texture", "color",
    "monochrome", "symmetry", "pattern", "silhouette"
  ], []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const query = userSearch.toLowerCase();
    return users.filter(user => 
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  }, [users, userSearch]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return tagsList;
    const query = tagSearch.toLowerCase();
    return tagsList.filter(tag => tag.toLowerCase().includes(query));
  }, [tagsList, tagSearch]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const processFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setSubmitError(new Error("Please select a valid image file"));
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setSubmitError(new Error("File size must be under 5MB"));
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    setFile(selectedFile);
    setSubmitError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  }, [processFile]);

  // Click to upload
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setPreview("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle person
  const togglePerson = (userId) => {
    setPerson(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Remove person
  const removePerson = (userId, e) => {
    e.stopPropagation();
    setPerson(prev => prev.filter(id => id !== userId));
  };

  // Toggle tag
  const toggleTag = (tag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Remove tag
  const removeTag = (tag, e) => {
    e.stopPropagation();
    setTags(prev => prev.filter(t => t !== tag));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setSubmitError(new Error("Please select an image"));
      toast.warning("Please select an image to upload");
      return;
    }

    if (!name.trim()) {
      setSubmitError(new Error("Please enter a name"));
      toast.warning("Please enter a name for the image");
      return;
    }

    if (tags.length === 0) {
      setSubmitError(new Error("Please select at least one tag"));
      toast.warning("Please select at least one tag");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name.trim());
    formData.append("albumId", albumId);
    formData.append("tags", tags.join(","));
    person.forEach((userId) => formData.append("person", userId));
    formData.append("size", file.size);

    try {
      // Simulate progress (optional - remove if your backend doesn't support progress events)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      console.log("✅ Image uploaded:", response.data.image);
      toast.success("🎉 Image uploaded successfully!");
      
      // Reset form
      setFile(null);
      setPreview("");
      setName("");
      setPerson([]);
      setTags([]);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setTimeout(() => navigate(`/albums/${albumId}`), 1000);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      const errorMsg = error.response?.data?.message || error.message || "Upload failed";
      setSubmitError(new Error(errorMsg));
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <MdAddPhotoAlternate className="fs-4" />
                  <span>Upload</span>
                </h5>
                <p className="mb-0 small opacity-75 mt-1">Add new photo</p>
              </div>
              
              <div className="card-body p-4">
                <Link 
                  to={`/albums/${albumId}`}
                  className="btn btn-outline-secondary w-100 mb-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium hover-lift"
                >
                  <FaArrowLeft className="fs-5" />
                  <span>Back to Album</span>
                </Link>

                {/* Upload Tips */}
                <div className="bg-light-subtle rounded-3 p-4 mb-4">
                  <h6 className="fw-semibold text-dark mb-3 small d-flex align-items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    Upload Tips
                  </h6>
                  <ul className="list-unstyled small text-muted mb-0" style={{lineHeight:'1.6'}}>
                    <li className="mb-2">• Max file size: 5MB</li>
                    <li className="mb-2">• Supported: JPG, PNG, GIF</li>
                    <li className="mb-2">• Add tags for easy search</li>
                    <li>• Tag people in your photos</li>
                  </ul>
                </div>

                {/* File Info (if file selected) */}
                {file && (
                  <div className="bg-success-subtle rounded-3 p-3">
                    <div className="d-flex align-items-center gap-2 mb-2 text-success">
                      <FaCheck className="fs-6" />
                      <span className="fw-semibold small">Ready to upload</span>
                    </div>
                    <div className="small">
                      <p className="mb-1 text-muted">File: <span className="fw-medium text-dark text-truncate d-block">{file.name}</span></p>
                      <p className="mb-0 text-muted">Size: <span className="fw-medium">{formatFileSize(file.size)}</span></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ✨ Main Form */}
          <main className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                
                {/* Header */}
                <div className="mb-5">
                  <h3 className="fw-bold text-dark mb-2">Upload New Image</h3>
                  <p className="text-muted mb-0">Add a photo to your album with tags and people</p>
                </div>

                {/* Error Alert */}
                {submitError && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-3 d-flex align-items-start gap-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Upload failed</h6>
                      <p className="mb-0 small">{submitError.message}</p>
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
                  
                  {/* ✨ Drag & Drop Zone */}
                  <div className="mb-5">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaImage className="text-primary" />
                      Image File <span className="text-danger">*</span>
                    </label>
                    
                    {!preview ? (
                      <div
                        ref={dropZoneRef}
                        onClick={handleDropZoneClick}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`upload-dropzone border-2 border-dashed rounded-4 p-5 text-center cursor-pointer transition-all ${
                          isDragging 
                            ? 'border-primary bg-primary-subtle' 
                            : 'border-secondary-subtle bg-light-subtle hover-bg'
                        }`}
                        style={{ minHeight: '250px' }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                        
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center mb-3 ${
                            isDragging ? 'bg-primary text-white' : 'bg-white text-primary'
                          } shadow-sm`} style={{ width: '80px', height: '80px' }}>
                            {isDragging ? (
                              <MdCloudUpload className="fs-1" />
                            ) : (
                              <FaCloudUploadAlt className="fs-1" />
                            )}
                          </div>
                          
                          <h5 className="fw-semibold text-dark mb-2">
                            {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
                          </h5>
                          <p className="text-muted mb-3 small">
                            or <span className="text-primary fw-medium">click to browse</span>
                          </p>
                          
                          <div className="d-flex gap-3 text-muted small">
                            <span className="badge bg-white border px-3 py-2">JPG</span>
                            <span className="badge bg-white border px-3 py-2">PNG</span>
                            <span className="badge bg-white border px-3 py-2">GIF</span>
                            <span className="badge bg-white border px-3 py-2">Max 5MB</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Image Preview */
                      <div className="position-relative rounded-4 overflow-hidden shadow-lg" style={{ maxHeight: '400px' }}>
                        <img 
                          src={preview} 
                          alt="Preview"
                          className="w-100 h-100 object-fit-contain bg-light"
                          style={{ maxHeight: '400px' }}
                        />
                        
                        {/* Overlay with remove button */}
                        <div className="position-absolute top-0 end-0 p-3">
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="btn btn-danger rounded-circle p-2 shadow-lg hover-lift"
                            aria-label="Remove image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        
                        {/* File info overlay */}
                        <div className="position-absolute bottom-0 start-0 end-0 bg-dark/70 backdrop-blur-sm text-white p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="small">
                              <p className="mb-1 fw-medium">{file?.name}</p>
                              <p className="mb-0 opacity-75">{formatFileSize(file?.size)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="btn btn-outline-light btn-sm rounded-3"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaImage className="text-primary" />
                      Image Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 border-light-subtle shadow-sm focus-ring focus-ring-primary py-3"
                      id="name"
                      placeholder="e.g., Sunset at the beach"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <small className="form-text text-muted mt-2">
                      Give your image a descriptive name
                    </small>
                  </div>

                  {/* Tag People */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaUser className="text-primary" />
                      Tag People
                    </label>
                    
                    {/* Search */}
                    <div className="position-relative mb-3">
                      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        className="form-control rounded-3 border-light-subtle shadow-sm ps-5 py-2"
                        placeholder="Search people by name..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        disabled={isSubmitting || userLoading}
                      />
                    </div>

                    {/* Selected People Chips */}
                    {person.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {person.map(userId => {
                          const user = users.find(u => u._id === userId);
                          if (!user) return null;
                          return (
                            <span 
                              key={userId}
                              className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-medium"
                            >
                              <FaUser className="small" />
                              {user.name}
                              <button
                                type="button"
                                onClick={(e) => removePerson(userId, e)}
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

                    {/* User Selection */}
                    <div className="border rounded-3 p-3 bg-light-subtle" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {userLoading ? (
                        <p className="text-muted small mb-0">Loading users...</p>
                      ) : userError ? (
                        <p className="text-danger small mb-0">Failed to load users</p>
                      ) : filteredUsers.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {filteredUsers.map(user => {
                            const isSelected = person.includes(user._id);
                            return (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => togglePerson(user._id)}
                                disabled={isSubmitting}
                                className={`btn px-3 py-2 rounded-3 d-flex align-items-center gap-2 transition-all small fw-medium ${
                                  isSelected 
                                    ? 'btn-primary shadow-sm' 
                                    : 'btn-outline-secondary bg-white hover-bg'
                                }`}
                              >
                                {isSelected ? <FaCheck size={14} /> : <MdPersonAdd size={16} />}
                                <span>{user.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">No users found</p>
                      )}
                    </div>
                    <small className="form-text text-muted mt-2">
                      Tag people who appear in this photo
                    </small>
                  </div>

                  {/* Add Tags */}
                  <div className="mb-5">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center gap-2">
                      <FaTag className="text-primary" />
                      Add Tags <span className="text-danger">*</span>
                    </label>
                    
                    {/* Search */}
                    <div className="position-relative mb-3">
                      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        className="form-control rounded-3 border-light-subtle shadow-sm ps-5 py-2"
                        placeholder="Search tags..."
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Selected Tags */}
                    {tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <span 
                            key={tag}
                            className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-medium"
                          >
                            <FaTag className="small" />
                            {tag}
                            <button
                              type="button"
                              onClick={(e) => removeTag(tag, e)}
                              className="btn btn-link text-danger p-0 lh-1"
                              disabled={isSubmitting}
                              aria-label={`Remove ${tag}`}
                            >
                              <FaTimes size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag Selection */}
                    <div className="border rounded-3 p-3 bg-light-subtle" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {filteredTags.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {filteredTags.map(tag => {
                            const isSelected = tags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                disabled={isSubmitting}
                                className={`btn px-3 py-2 rounded-3 transition-all small fw-medium ${
                                  isSelected 
                                    ? 'btn-danger shadow-sm' 
                                    : 'btn-outline-secondary bg-white hover-bg'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">No tags found</p>
                      )}
                    </div>
                    <small className="form-text text-muted mt-2">
                      Select relevant tags to help organize your photo
                    </small>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-medium text-muted">Uploading...</span>
                        <span className="small fw-bold text-primary">{uploadProgress}%</span>
                      </div>
                      <div className="progress rounded-3" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-gradient-primary progress-bar-striped progress-bar-animated"
                          style={{ width: `${uploadProgress}%` }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/albums/${albumId}`)}
                      className="btn btn-outline-secondary px-4 py-3 rounded-3 fw-medium hover-lift"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !file || !name.trim() || tags.length === 0}
                      className="btn btn-primary px-5 py-3 rounded-3 fw-medium d-flex align-items-center gap-2 shadow-lg hover-lift flex-grow-1"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <MdCloudUpload className="fs-5" />
                          <span>Upload Image</span>
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
        .cursor-pointer {
          cursor: pointer;
        }
        .border-dashed {
          border-style: dashed;
        }
        .object-fit-contain {
          object-fit: contain;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
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
        .upload-dropzone {
          transition: all 0.2s ease;
        }
        .upload-dropzone:hover {
          border-color: #667eea !important;
          background-color: rgba(102, 126, 234, 0.05) !important;
        }
        /* Custom scrollbar */
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