import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete, MdKeyboardArrowRight } from "react-icons/md";
import useFetch from "../useFetch";
import Header from "../components/Header";
import { FaArrowLeft } from "react-icons/fa";
import { FaFolder, FaCamera } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
export default function Albums_Images() {
  const { albumId } = useParams();
  const [filter, setFilter] = useState("All");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
    useEffect(()=>{
          const data = localStorage.getItem('jwtToken');
          const userDetails = JSON.parse(data);
          setUserInfo(userDetails);
      },[])
      const {
          data: usersList
        } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
  
      const userData = usersList?.users && usersList?.users?.length>0 ? usersList?.users?.find((user)=> user.email === userInfo.email) : {};
  const {
    data: albumsList,
    loading: albumLoading,
    error: albumError,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/albums`);
  const { data: selectedAlbum } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`
  );


  const albums =
    albumsList?.albums?.filter(
      (album) =>
        album?.ownerId?._id === userData?._id ||
        album?.sharedUsers?.some(
          (sharedUser) => sharedUser?._id === userData?._id
        )
    ) || [];
  const {
    data: imagesList,
    loading: imageLoading,
    error: imageError,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/images`);
  const tagsList = [
    "portrait",
    "landscape",
    "nature",
    "travel",
    "streetphotography",
    "blackandwhite",
    "sunset",
    "sunrise",
    "macro",
    "architecture",
    "food",
    "pet",
    "dog",
    "cat",
    "wedding",
    "fashion",
    "urban",
    "wildlife",
    "ocean",
    "beach",
    "mountain",
    "forest",
    "cityscape",
    "aerial",
    "drone",
    "minimal",
    "vintage",
    "film",
    "bokeh",
    "goldenhour",
    "bluehour",
    "night",
    "astrophotography",
    "longexposure",
    "reflection",
    "documentary",
    "event",
    "concert",
    "sports",
    "fitness",
    "family",
    "baby",
    "newborn",
    "pregnancy",
    "selfie",
    "mirrorselfie",
    "mobilephotography",
    "iphoneonly",
    "analog",
    "35mm",
    "polaroid",
    "flatlay",
    "detail",
    "texture",
    "color",
    "monochrome",
    "symmetry",
    "pattern",
    "silhouette",
  ];
  function handleTag(e) {
    let selectedTagValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setTags(selectedTagValues);
  }
  async function handleDelete(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`
      );
      imagesList?.images?.length > 0 && imagesList?.images?.forEach(async (image)=>{
        const deleteAllImagesResponse = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/images/${image?._id}`);
        console.log(deleteAllImagesResponse.data);
      })
      console.log(response.data);
      toast.error("Album is deleted!");
      setTimeout(() => navigate(`/dashboard`), 700);
    } catch (error) {
      setSubmitError(error);
      toast.warning(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  let images =
    imagesList?.images?.length > 0
      ? imagesList?.images?.filter((image) => image?.albumId?._id === albumId)
      : [];
  const lowerCaseTags = tags.map((t) => t.toLowerCase());
  images =
    filter === "All" ? images : images?.filter((image) => image?.isFavorite);
  images =
    tags.length > 0
      ? images.filter((image) =>
          image.tags
            .split(",")
            .some((tag) => lowerCaseTags.includes(tag.toLowerCase()))
        )
      : images;
  return (
    <>
      <div className="container mt-4">
        <Header />
        <div className="card shadow-sm border rounded-3 mt-4">
          <div className="card-body p-0">
            <div className="row g-0">
              {/* Sidebar */}
              <div className="col-md-2 border-end bg-light">
                <div className="p-3">
                  <h6 className="text-secondary fw-bold mb-3">Sidebar</h6>
                  <Link
                    to="/dashboard"
                    className="btn btn-warning text-decoration-none d-block p-2 rounded hover-bg"
                  >
                    <FaArrowLeft /> Back
                  </Link>
                  <ul className="list-group">
                    {albums?.length > 0 ? (
                      albums?.map((album) => (
                        <li
                          key={album._id}
                          className={`list-group-item ${
                            album._id === albumId && "fw-bold"
                          }`}
                        >
                          <FaFolder />
                          {"  "}
                          <Link
                            to={`/albums/${album._id}`}
                            className="text-decoration-none text-dark"
                          >
                            {album.name.length > 10
                              ? `${album.name.slice(0, 9)}...`
                              : album.name}
                            <MdKeyboardArrowRight />
                          </Link>
                        </li>
                      ))
                    ) : (
                      <span className="badge fs-5 bg-light text-dark border">
                        {albumLoading && (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                        {albumError && (
                          <p className="text-danger">{albumError}</p>
                        )}
                        {"  "}No Album
                      </span>
                    )}
                  </ul>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-md-9 p-4">
                {submitError && (
                  <div className="alert alert-danger">
                    {JSON.stringify(submitError)}
                  </div>
                )}
                <h4 className="text-secondary fw-bold mb-3 d-flex justify-content-between align-items-center">
                  {selectedAlbum?.album?.name || "Album"}
                  {selectedAlbum?.album?.ownerId?._id === userData?._id && <span><Link to={`/albums/${albumId}/editAlbum`}
                    className="mx-1 p-1 border border-secondary text-secondary rounded"><CiEdit /></Link>
                  <span
                    onClick={handleDelete}
                    role="button"
                    className="mx-1 p-1 border border-danger text-danger rounded"
                  >
                    {selectedAlbum?.album?.ownerId?._id === userData?._id && isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm text-dabger"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <MdDelete />
                      </>
                    ) : (
                      <MdDelete />
                    )}
                  </span>
                  </span>}
                </h4>
                <ul className="list-group list-group-horizontal mb-2">
                  <li
                    role="button"
                    className="list-group-item"
                    onClick={() => setFilter("All")}
                  >
                    All
                  </li>
                  <li
                    role="button"
                    className="list-group-item"
                    onClick={() => setFilter("Favorite")}
                  >
                    Favorite
                  </li>
                </ul>
                <div className="mb-3">
                <div className="input-group">
                  <label htmlFor="tags" className="input-group-text">
                    Filter by Tags
                  </label>
                  <select
                    id="tags"
                    className="form-select"
                    name="tags"
                    value={tags}
                    onChange={handleTag}
                    multiple
                  >
                    {tagsList.map((tag, index) => (
                      <option key={index} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  </div>
                  <br />
                  <small className="form-text text-muted">
                    Hold <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> to select multiple
                    tags.
                  </small>
                </div>
                <div className="row">
                  {images?.length > 0 ? (
                    images?.map((image) => (
                      <Link
                        to={`/albums/${albumId}/images/${image?._id}`}
                        key={image?._id}
                        className="col-md-3 m-1 text-decoration-none"
                      >
                        <div className="card">
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              height: "150px",
                              overflow: "hidden",
                              objectPosition: "center",
                            }}
                          >
                            <img
                              src={image?.imageUrl}
                              alt={image?.name || "Image"}
                              className="img-fluid"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                transition: "transform 0.3s ease",
                              }}
                              onError={(e) =>
                                (e.target.style.background = "#f8f9fa")
                              }
                            />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{image?.name}</h5>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <span className="badge fs-5 bg-light text-dark border">
                      {imageLoading && (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      {imageError && (
                        <p className="text-danger">{imageError}</p>
                      )}
                      {"  "}No Images
                    </span>
                  )}
                </div>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <Link
                    to={`/albums/${albumId}/uploadNewImage`}
                    className="btn btn-info text-decoration-none d-block mt-4 p-2 rounded hover-bg"
                  >
                    <FaCamera /> Upload new Image
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
