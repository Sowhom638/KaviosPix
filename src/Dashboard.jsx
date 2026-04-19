// frontend/components/Albums.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineCreateNewFolder,
  MdPhotoLibrary,
  MdPeople,
  MdAccessTime,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import useFetch from "./useFetch";
import { useEffect, useState, useMemo } from "react";
import Header from "./components/Header";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, owned, shared
  const navigate = useNavigate();

  // Load user info with error handling
  useEffect(() => {
    try {
      const data = localStorage.getItem("jwtToken");
      if (data) {
        const userDetails = JSON.parse(data);
        setUserInfo(userDetails);
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      localStorage.removeItem("jwtToken");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch users to find current user data
  const { data: usersList, loading: usersLoading } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/users`,
  );

  const userData = useMemo(() => {
    if (!usersList?.users || !userInfo?.email) return null;
    return usersList.users.find((user) => user.email === userInfo.email);
  }, [usersList, userInfo]);

  // Fetch albums
  const {
    data: albumsList,
    loading: albumLoading,
    error: albumError,
    refetch,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/albums`);

  // Filter and process albums
  const albums = useMemo(() => {
    if (!albumsList?.albums || !userData?._id) return [];

    let filtered = albumsList.albums.filter((album) => {
      const isOwner = album?.ownerId?._id === userData._id;
      const isShared = album?.sharedUsers?.some(
        (user) => user?._id === userData._id,
      );

      if (filterType === "owned") return isOwner;
      if (filterType === "shared") return isShared && !isOwner;
      return isOwner || isShared;
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (album) =>
          album.name?.toLowerCase().includes(query) ||
          album.description?.toLowerCase().includes(query),
      );
    }

    // Sort by last modified (newest first)
    return filtered.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
  }, [albumsList, userData, searchQuery, filterType]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get album cover (first image or placeholder)
  const getAlbumCover = (album) => {
    if (album?.images?.[0]?.url) return album.images[0].url;
    if (album?.coverImage) return album.coverImage;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(album?.name || "Album")}&background=667eea&color=fff&size=128`;
  };

  // Loading Skeleton
  if (albumLoading || usersLoading) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar Skeleton */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-4">
                  <div className="placeholder-glow mb-4">
                    <span className="placeholder col-6 bg-secondary-subtle rounded-pill"></span>
                  </div>
                  <div className="d-grid gap-2">
                    <span
                      className="placeholder col-12 bg-secondary-subtle rounded-3"
                      style={{ height: "48px" }}
                    ></span>
                    <span
                      className="placeholder col-12 bg-secondary-subtle rounded-3"
                      style={{ height: "48px" }}
                    ></span>
                    <span
                      className="placeholder col-12 bg-secondary-subtle rounded-3"
                      style={{ height: "48px" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="placeholder col-4 bg-secondary-subtle rounded-pill"></span>
                    <div className="d-flex gap-2">
                      <span
                        className="placeholder col-8 bg-secondary-subtle rounded-3"
                        style={{ width: "200px", height: "40px" }}
                      ></span>
                      <span
                        className="placeholder col-2 bg-secondary-subtle rounded-3"
                        style={{ width: "100px", height: "40px" }}
                      ></span>
                    </div>
                  </div>

                  <div className="row g-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div className="col-md-4" key={i}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                          <div
                            className="placeholder bg-secondary-subtle"
                            style={{ height: "160px" }}
                          ></div>
                          <div className="card-body p-3">
                            <span className="placeholder col-8 bg-secondary-subtle rounded mb-2"></span>
                            <span className="placeholder col-12 bg-secondary-subtle rounded mb-2"></span>
                            <div className="d-flex gap-2 mt-3">
                              <span
                                className="placeholder col-3 bg-secondary-subtle rounded-pill"
                                style={{ height: "24px" }}
                              ></span>
                              <span
                                className="placeholder col-3 bg-secondary-subtle rounded-pill"
                                style={{ height: "24px" }}
                              ></span>
                            </div>
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
          {/* ✨ Polished Sidebar */}
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top">
              {/* Header with Gradient */}
              <div className="card-header bg-gradient-primary text-white border-0 py-4 px-4">
                <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                  <MdPhotoLibrary className="fs-4" />
                  <span>Albums</span>
                </h5>
                <p className="mb-0 small opacity-75 mt-1">
                  Manage your collections
                </p>
              </div>

              <div className="card-body p-4">
                {/* Create New Album - Primary Action */}
                <Link
                  to="/createNewAlbum"
                  className="btn btn-primary w-100 mb-4 py-3 rounded-3 fw-medium d-flex align-items-center justify-content-center gap-2 shadow-sm hover-lift"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  <MdOutlineCreateNewFolder className="fs-5" />
                  <span>Create New Album</span>
                </Link>

                {/* Quick Stats */}
                <div className="mb-4">
                  <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">
                    Quick Stats
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center p-2 bg-light-subtle rounded-2">
                      <span className="small text-muted">Total Albums</span>
                      <span className="badge bg-primary-gradient text-white rounded-pill px-3">
                        {albums.length}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 bg-light-subtle rounded-2">
                      <span className="small text-muted">Owned</span>
                      <span className="badge bg-light text-dark border rounded-pill px-3">
                        {
                          albums.filter((a) => a.ownerId?._id === userData?._id)
                            .length
                        }
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 bg-light-subtle rounded-2">
                      <span className="small text-muted">Shared</span>
                      <span className="badge bg-light text-dark border rounded-pill px-3">
                        {
                          albums.filter(
                            (a) =>
                              a.sharedUsers?.some(
                                (u) => u._id === userData?._id,
                              ) && a.ownerId?._id !== userData?._id,
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Options */}
                <div>
                  <h6 className="text-secondary fw-bold mb-3 small text-uppercase tracking-wide">
                    Filter By
                  </h6>
                  <div className="btn-group-vertical w-100" role="group">
                    {[
                      { id: "all", label: "All Albums", icon: MdPhotoLibrary },
                      { id: "owned", label: "My Albums", icon: MdPeople },
                      { id: "shared", label: "Shared with Me", icon: MdPeople },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setFilterType(filter.id)}
                        className={`btn text-start px-3 py-2 rounded-2 d-flex align-items-center gap-2 transition-all ${
                          filterType === filter.id
                            ? "bg-primary-subtle text-primary fw-medium"
                            : "btn-light text-muted hover-bg"
                        }`}
                      >
                        <filter.icon
                          className={
                            filterType === filter.id
                              ? "text-primary"
                              : "text-muted"
                          }
                        />
                        <span className="small">{filter.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ✨ Main Content Area */}
          <main className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                {/* Header with Search & Actions */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                  <div>
                    <h3 className="fw-bold text-dark mb-1">My Albums</h3>
                    <p className="text-muted mb-0 small">
                      {albums.length} album{albums.length !== 1 ? "s" : ""}{" "}
                      found
                    </p>
                  </div>

                  <div className="d-flex gap-2 w-100 w-md-auto">
                    {/* Search */}
                    <div
                      className="position-relative flex-grow-1"
                      style={{ maxWidth: "280px" }}
                    >
                      <MdSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        placeholder="Search albums..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control ps-5 py-2 rounded-3 border-light-subtle shadow-sm focus-ring focus-ring-primary"
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>

                    {/* Filter Dropdown (Mobile) */}
                    <div className="dropdown d-md-none">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-3 px-3"
                        data-bs-toggle="dropdown"
                      >
                        <MdFilterList />
                        <span className="small">Filter</span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                        {[
                          { id: "all", label: "All Albums" },
                          { id: "owned", label: "My Albums" },
                          { id: "shared", label: "Shared with Me" },
                        ].map((filter) => (
                          <li key={filter.id}>
                            <button
                              className={`dropdown-item small d-flex align-items-center gap-2 ${
                                filterType === filter.id
                                  ? "active bg-primary-subtle text-primary"
                                  : ""
                              }`}
                              onClick={() => setFilterType(filter.id)}
                            >
                              {filter.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                {albumError && (
                  <div
                    className="alert alert-danger border-0 shadow-sm rounded-3 d-flex align-items-center gap-3"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div>
                      <h6 className="alert-heading mb-1">
                        Failed to load albums
                      </h6>
                      <p className="mb-0 small">{albumError}</p>
                    </div>
                    <button
                      onClick={refetch}
                      className="btn btn-outline-danger btn-sm ms-auto"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!albumLoading && albums.length === 0 && !albumError && (
                  <div className="text-center py-5 my-4">
                    <div
                      className="bg-light-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <MdPhotoLibrary
                        className="text-muted"
                        style={{ fontSize: "2.5rem" }}
                      />
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">
                      {searchQuery || filterType !== "all"
                        ? "No matching albums"
                        : "No albums yet"}
                    </h5>
                    <p className="text-muted mb-4 small">
                      {searchQuery || filterType !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first album to start organizing your photos"}
                    </p>
                    <Link
                      to="/createNewAlbum"
                      className="btn btn-primary px-4 py-2 rounded-3 fw-medium d-inline-flex align-items-center gap-2 shadow-sm hover-lift"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <MdOutlineCreateNewFolder />
                      <span>Create Album</span>
                    </Link>
                  </div>
                )}

                {/* ✨ Album Grid */}
                {albums.length > 0 && (
                  <div className="row g-4">
                    {albums.map((album) => {
                      const isOwner = album.ownerId?._id === userData?._id;
                      const imageCount = album.images?.length || 0;
                      const coverUrl = getAlbumCover(album);

                      return (
                        <div className="col-md-6 col-xl-4" key={album._id}>
                          <Link
                            to={`/albums/${album._id}`}
                            className="text-decoration-none"
                          >
                            <div className="card album-card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-lift transition-all bg-white">
                              {/* Album Cover */}
                              <div
                                className="position-relative"
                                style={{ height: "160px" }}
                              >
                                <img
                                  src={coverUrl}
                                  alt={album.name}
                                  className="w-100 h-100 object-fit-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(album.name)}&background=667eea&color=fff&size=256`;
                                  }}
                                />

                                {/* Overlay Gradient */}
                                <div className="position-absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Badges */}
                                <div className="position-absolute top-3 end-3 d-flex gap-2">
                                  {!isOwner && (
                                    <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2 py-1 small fw-medium">
                                      Shared
                                    </span>
                                  )}
                                  {imageCount > 0 && (
                                    <span className="badge bg-dark/80 text-white rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
                                      <FaRegImage className="fs-6" />
                                      {imageCount}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Album Info */}
                              <div className="card-body p-4">
                                <h5 className="card-title fw-semibold text-dark mb-2 line-clamp-1">
                                  {album.name}
                                </h5>
                                <p className="card-text text-muted small mb-3 line-clamp-2">
                                  {album.description || "No description"}
                                </p>

                                {/* Meta Info */}
                                <div className="d-flex align-items-center gap-3 text-muted small">
                                  <span className="d-flex align-items-center gap-1">
                                    <MdAccessTime className="fs-6" />
                                    {formatDate(album.createdAt)}
                                  </span>
                                  {album.sharedUsers?.length > 1 && (
                                    <span className="d-flex align-items-center gap-1">
                                      <MdPeople className="fs-6" />
                                      {album.sharedUsers.length}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ✨ Custom Styles */}
      <style>{`
        /* Gradient Utilities */
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-to-t {
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        }
        
        /* Hover Effects */
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
        
        /* Text Truncation */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Image Utilities */
        .object-fit-cover {
          object-fit: cover;
        }
        
        /* Focus Ring for Accessibility */
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25);
        }
        .focus-ring-primary:focus {
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25);
        }
        
        /* Subtle Background Hover */
        .hover-bg:hover {
          background-color: rgba(102, 126, 234, 0.08) !important;
        }
        
        /* Tracking for uppercase text */
        .tracking-wide {
          letter-spacing: 0.05em;
        }
        
        /* Smooth backdrop blur for overlay */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
