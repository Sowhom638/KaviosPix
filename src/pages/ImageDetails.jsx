import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { FaArrowLeft, FaCamera, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useFetch from "../useFetch";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ImageDetails() {
  const { albumId, imageId } = useParams();
  const [comment, setComment] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
      const data = localStorage.getItem("jwtToken");
      const userDetails = JSON.parse(data);
      setUserInfo(userDetails);
    }, []);
    const { data: usersList } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
  
    const userData =
      usersList?.users && usersList?.users?.length > 0
        ? usersList?.users?.find((user) => user.email === userInfo.email)
        : {};
  const { data: imageData } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`
  );


  function formatToIST(uploadedAt) {
    if (!uploadedAt) return "—";
    const date = new Date(uploadedAt);
    if (date.toString() === "Invalid Date") return "—";
    const istTime = new Date(date.getTime() + 60 * 60 * 1000);
    const pad = (num) => String(num).padStart(2, "0");

    // Step 4: Get parts
    const day = pad(istTime.getDate());
    const month = pad(istTime.getMonth() + 1); // month is 0-based!
    const year = istTime.getFullYear();
    const hour = pad(istTime.getHours());
    const minute = pad(istTime.getMinutes());

    // Step 5: Return formatted string
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  async function handleComment(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const commentData = {
      comments: [
        ...imageData.image.comments,
        { text: comment, author: userData._id },
      ],
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`,
        commentData
      );
      console.log(response.data);
      toast.success("New comment is added successfully!");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setSubmitError(error);
      toast.warning(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleDelete(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`
      );
      console.log(response.data);
      toast.error("Image is deleted!");
      setTimeout(() => navigate(`/albums/${albumId}`), 700);
    } catch (error) {
      setSubmitError(error);
      toast.warning(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleAddFavorite(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images/${imageId}`,
        { isFavorite: !imageData?.image?.isFavorite }
      );
      console.log(response.data);
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  }
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
                {submitError && (
                  <div className="alert alert-danger">
                    {JSON.stringify(submitError)}
                  </div>
                )}
                {imageData?.image ? (
                  <div>
                    <div className="card mb-3" style={{ maxWidth: "540px" }}>
                      <div className="row g-0">
                        <Link
                          to={imageData?.image?.imageUrl || ""}
                          className="col-md-4 p-1"
                        >
                          <img
                            src={imageData?.image?.imageUrl || ""}
                            className="img-fluid rounded-start"
                            alt={imageData?.image?.name || "Image"}
                          />
                        </Link>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">
                              {imageData?.image?.name || "Image"}
                            </h5>
                            <p className="card-text">
                              <b>Album Name: </b>
                              {imageData?.image?.albumId?.name || "Album"}
                            </p>
                            <p className="card-text">
                              <b>Persons: </b>
                              {imageData?.image?.person?.length > 0
                                ? imageData?.image?.person?.map((person) => (
                                    <span
                                      key={person?._id}
                                      className="badge bg-secondary mx-1 py-1"
                                    >
                                      {person?.name}
                                    </span>
                                  ))
                                : "No Person"}
                            </p>
                            <p className="card-text">
                              <b>Tags: </b>
                              {imageData?.image?.tags
                                ? imageData?.image?.tags
                                    ?.split(",")
                                    ?.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="badge bg-danger mx-1 py-1"
                                      >
                                        {tag}
                                      </span>
                                    ))
                                : "No Person"}
                            </p>
                            <p className="card-text">
                              <b>Size:</b>{" "}
                              {(imageData?.image?.size / 1024 / 1024).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                            <p className="card-text">
                              <span
                                role="button"
                                className="p-1 border border-dark rounded"
                                onClick={handleAddFavorite}
                              >
                                {imageData?.image?.isFavorite ? (
                                  <span>
                                    Remove from Favorite{" "}
                                    <FaHeart color="#e74c3c" size={20} />
                                  </span>
                                ) : (
                                  <span>
                                    Add to Favorite{" "}
                                    <FaHeart
                                      color="#95a5a6"
                                      size={20}
                                      style={{ strokeWidth: 1.5 }}
                                    />
                                  </span>
                                )}
                              </span>
                              <span
                                onClick={handleDelete}
                                role="button"
                                className="mx-1 p-1 border border-danger text-danger rounded"
                              >
                                {isSubmitting ? (
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
                            </p>
                            <p className="card-text">
                              <small className="text-muted">
                                Uploaded At:{" "}
                                {formatToIST(imageData?.image?.uploadedAt)}
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card mb-3" style={{ maxWidth: "540px" }}>
                      <div className="card-body">
                        <h4 className="card-title">Comments</h4>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add Comment"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <button
                            disabled={isSubmitting}
                            className="btn btn-outline-primary"
                            type="button"
                            id="button-addon2"
                            onClick={handleComment}
                          >
                            {isSubmitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm text-primary"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Adding...
                              </>
                            ) : (
                              "Add"
                            )}
                          </button>
                        </div>
                        <ul className="list-group">
                          {imageData?.image?.comments?.length > 0 ? (
                            imageData?.image?.comments?.map(
                              (comment, index) => (
                                <li key={index} className="list-group-item">
                                  <p className="card-text fw-bold">
                                    {comment.author.name}{" "}
                                    <span className="text-secondary fw-normal">
                                      {formatToIST(comment.createdAt)}
                                    </span>
                                  </p>
                                  <p className="card-text">{comment.text}</p>
                                </li>
                              )
                            )
                          ) : (
                            <span className="badge fs-5 bg-light text-dark border">
                              No Comments
                            </span>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h1>
                    No Image is here.{" "}
                    <Link
                      to={`/albums/${albumId}/uploadNewImage`}
                      className="btn btn-info text-decoration-none d-block mt-4 p-2 rounded hover-bg"
                    >
                      <FaCamera /> Upload new Image
                    </Link>
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
