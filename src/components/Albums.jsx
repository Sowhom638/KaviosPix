import { Link } from "react-router-dom";
import { MdKeyboardArrowRight, MdOutlineCreateNewFolder } from "react-icons/md";
import useFetch from "../useFetch";
import { useEffect, useState } from "react";

export default function Albums() {
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
      const albums = albumsList?.albums?.filter((album)=> album?.ownerId?._id === userData?._id || album?.sharedUsers?.some((sharedUser)=> sharedUser?._id === userData?._id)) || [];


    return (
        <>
      <div className="container mt-4">
        <div className="card shadow-sm border rounded-3">
          <div className="card-body p-0">
            <div className="row g-0">
              {/* Sidebar */}
              <div className="col-md-2 border-end bg-light">
                <div className="p-3">
                  <h6 className="text-secondary fw-bold mb-3">Sidebar</h6>
                        <Link to="/createNewAlbum" className="btn btn-warning text-decoration-none d-block p-2 rounded hover-bg">
                        <MdOutlineCreateNewFolder/> Create new Album
                        </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-md-9 p-4">
                <h4 className="text-secondary fw-bold mb-3">Albums</h4>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <ul className="list-group">
                  {albums?.length > 0 ? albums?.map((album) => (
                    <li key={album._id} className="my-1 list-group-item">
                      <Link to={`/albums/${album._id}`} className="text-decoration-none text-dark" ><b>{album.name}</b> - {album.description} <MdKeyboardArrowRight/></Link>
                    </li>
                  )) : (
                    <span className="badge fs-5 bg-light text-dark border">
                      {albumLoading && <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>}
                      {albumError && <p className="text-danger">{albumError}</p>}
                      {'  '}No Album</span>
                  )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
}