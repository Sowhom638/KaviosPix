// pages/Login.jsx
// frontend/components/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Handle successful Google sign-in (ID token received)
  const handleLoginSuccess = async (credentialResponse) => {
    const { credential: idToken } = credentialResponse; // JWT id_token from Google

    if (!idToken) {
      console.error("No ID token received from Google");
      alert("Login failed: No token received.");
      return;
    }

    try {
      // Send ID token to your backend for verification & JWT issuance
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed on server");
      }

      // Save user + your app's JWT
      const { token, user } = data;
      localStorage.setItem(
        "jwtToken",
        JSON.stringify({
          email: user.email,
          name: user.name,
          token, // your backend-issued JWT
        })
      );

      // Redirect to protected route
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleLoginError = () => {
    alert("Google sign-in was cancelled or failed. Please try again.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h2 className="mb-4">📸 Welcome to KaviosPix</h2>
      <p className="text-muted mb-4">Sign in to manage your photo albums</p>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap={false} // disables auto-popup; user must click
        size="large"
        shape="rectangular"
        theme="outline"
      />
    </div>
  );
};

export default Login;
// style={{
//         padding: '10px 20px',
//         fontSize: '16px',
//         cursor: 'pointer',
//         backgroundColor: '#4285F4',
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px'
//       }}>
//         🟡 Sign in with Google
//       </button>