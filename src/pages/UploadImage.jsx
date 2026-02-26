import { useState } from "react";
import Header from "../components/Header";
import useFetch from "../useFetch";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
export default function UploadImage() {
  const { albumId } = useParams();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [size, setSize] = useState(0); // in bytes
  const [name, setName] = useState("");
  const [person, setPerson] = useState([]);
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const {
    data: usersList,
    loading: userLoading,
    error: userError,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);

  const users = usersList?.users || [];
  function handleUser(e) {
    let selectedUserValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setPerson(selectedUserValues);
  }
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
    // for multiple select tag
    let selectedTagValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setTags(selectedTagValues);
    // for multiple file upload
    //  const selectedFiles = Array.from(e.target.files);
  }
  const handleFileChange = (e) => {
    // For multiple image upload
  //   const [files, setFiles] = useState([]);

  // const handleFileChange = (e) => {
  //   // Convert FileList to array
  //   const selectedFiles = Array.from(e.target.files);
  //   setFiles(selectedFiles);
  // };

  // files.forEach((file) => {
  //   formData.append('images', file);
  // });
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setSubmitError(new Error("File size must be under 5MB"));
      return;
    }

    setFile(selectedFile);
    setSize(selectedFile.size);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setSubmitError(new Error("Please select an image"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name.trim());
    formData.append("albumId", albumId);
    formData.append("tags", tags);
    person.forEach((userId) => formData.append("person", userId));
    formData.append("size", Number(size.toString()));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images`,
        formData
      );

      console.log("✅ Image uploaded:", response.data.image);
      toast.success("New image details is uploaded!");
      setTimeout(() => navigate(`/albums/${albumId}`), 700);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      setSubmitError(new Error(errorMsg));
      toast.warning(error);
    } finally {
      setIsSubmitting(false);
    }
  };
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
                    to={`/albums/${albumId}`}
                    className="btn btn-warning text-decoration-none d-block p-2 rounded hover-bg"
                  >
                    <FaArrowLeft /> Back
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-md-9 p-4">
                <h1 className="my-2">Upload New Image</h1>
                {submitError && (
                  <div className="alert alert-danger">
                    {JSON.stringify(submitError)}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {preview && (
                    <div className="mb-3">
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  {/* File Input */}
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Image File<span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    <small className="form-text text-muted">Max 5MB</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name<span className="text-danger fs-5">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="person" className="form-label">
                      Tagged Person<span className="text-danger fs-5">*</span>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      id="person"
                      name="person"
                      value={person}
                      onChange={handleUser}
                      multiple
                    >
                      <option disabled>--Select users--</option>
                      {userLoading ? (
                        <option disabled>Loading users...</option>
                      ) : userError ? (
                        <option disabled>{userError}</option>
                      ) : users.length > 0 ? (
                        users.map((userItem) => (
                          <option key={userItem._id} value={userItem._id}>
                            {userItem.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users available</option>
                      )}
                    </select>
                    <small className="form-text text-muted">
                      Hold <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> to select multiple
                      tags.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">
                      Tags<span className="text-danger fs-5">*</span>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      id="tags"
                      name="tags"
                      value={tags}
                      onChange={handleTag}
                      multiple
                    >
                      <option disabled>--Select Tags--</option>
                      {tagsList.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      Hold <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> to select multiple
                      tags.
                    </small>
                  </div>
                  <button
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploading...
                      </>
                    ) : (
                      "Upload Image"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
