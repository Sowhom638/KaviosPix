import { useEffect, useState } from "react";
import Header from "../components/Header";
import useFetch from "../useFetch";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function EditAlbum() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();  
  const { albumId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
      const data = localStorage.getItem("jwtToken");
      const userDetails = JSON.parse(data);
      setUserInfo(userDetails);
    }, []);
    const {
      data: usersList,
      loading: userLoading,
      error: userError,
    } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
  
    const userData =
      usersList?.users && usersList?.users?.length > 0
        ? usersList?.users?.find((user) => user.email === userInfo.email)
        : {};
  const ownerId = userData?._id;
    const { data: selectedAlbum } = useFetch(
      `${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`
    );

  useEffect(()=>{
    if(selectedAlbum && selectedAlbum?.album){
        setName(selectedAlbum?.album?.name || "");
        setDescription(selectedAlbum?.album?.description || "");
        setSharedUsers(selectedAlbum?.album?.sharedUsers.map((sharedUser)=>sharedUser._id) || []);
    }
  },[selectedAlbum, albumId])
  const users = usersList?.users?.filter((user) => user?._id != ownerId) || [];
  function handleUser(e) {
    let selectedUserValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSharedUsers(selectedUserValues);
  }
  const newData = {
    name,
    description,
    sharedUsers,
  };

  async function handleUpdateAlbum(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/albums/${albumId}`,
        newData
      );
      console.log(response.data);
      toast.success("Album is updated!");
      setName("");
      setDescription("");
      setSharedUsers([]);
      setTimeout(() => navigate(`/albums/${albumId}`), 700);
    } catch (error) {
      setSubmitError(error);
      toast.warning(error);
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
                    to="/dashboard"
                    className="btn btn-warning text-decoration-none d-block p-2 rounded hover-bg"
                  >
                    <FaArrowLeft /> Back
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-md-9 p-4">
                <h1 className="my-2">Edit Album Details</h1>
                {submitError && (
                  <div className="alert alert-danger">
                    {JSON.stringify(submitError)}
                  </div>
                )}
                <form onSubmit={handleUpdateAlbum}>
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
                    <label htmlFor="description" className="form-label">
                      Description<span className="text-danger fs-5">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sharedUsers" className="form-label">
                      Shared Users<span className="text-danger fs-5">*</span>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      id="sharedUsers"
                      name="sharedUsers"
                      value={sharedUsers}
                      onChange={handleUser}
                      required
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
                        Updating...
                      </>
                    ) : (
                      "Update Album"
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
