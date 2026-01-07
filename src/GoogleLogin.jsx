import {useState} from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import {useNavigate} from 'react-router-dom';
    
const GoolgeLogin = (props) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				const {email, name, image} = result.data.user;
				const token = result.data.token;
				const obj = {email,name, token, image};
				localStorage.setItem('jwtToken',JSON.stringify(obj));
				navigate('/dashboard');
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

	return (
		<div className="App d-flex align-items-center justify-content-center min-vh-100 bg-light">
  <div className="text-center">
    <button
      onClick={googleLogin}
      className="btn btn-lg btn-outline-primary rounded-pill px-4 py-2 shadow-sm"
      style={{ 
        minWidth: "240px",
        fontSize: "1.1rem",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
    >
      <i className="bi bi-google me-2"></i>
      Sign in with Google
    </button>
  </div>
</div>
	);
};

export default GoolgeLogin;