import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./GoogleLogin";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";
import CreateNewAlbum from "./pages/CreateNewAlbum"
import EditAlbum from "./pages/EditAlbum"
import Albums_Images from "./pages/Albums_Images";
import UploadImage from "./pages/UploadImage";
import ProtectedRoute from "./components/ProtectedRoute";
import ImageDetails from "./pages/ImageDetails";
import { ToastContainer } from "react-toastify";

function App() {
  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="709500510086-t8rcrn01o4rp42mcffkqhf0opmea9fl3.apps.googleusercontent.com">
      <GoogleLogin></GoogleLogin>
    </GoogleOAuthProvider>
  );

  return (
    <BrowserRouter>
    <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/login" element={<GoogleWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/createNewAlbum"
          element={<ProtectedRoute><CreateNewAlbum /></ProtectedRoute>}
        />
        <Route
          path="/albums/:albumId/editAlbum"
          element={<ProtectedRoute><EditAlbum /></ProtectedRoute>}
        />
        <Route
          path="/albums/:albumId"
          element={<ProtectedRoute><Albums_Images /></ProtectedRoute>}
        />
        <Route
          path="/albums/:albumId/uploadNewImage"
          element={<ProtectedRoute><UploadImage /></ProtectedRoute>}
        />
        <Route
          path="/albums/:albumId/images/:imageId"
          element={<ProtectedRoute><ImageDetails /></ProtectedRoute>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
