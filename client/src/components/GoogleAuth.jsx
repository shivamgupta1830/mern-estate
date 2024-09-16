import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

function GoogleAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async (e) => {
    e.preventDefault();

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Unable to login with google", error);
    }
  };
  return (
    <button
      className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg uppercase"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
}

export default GoogleAuth;
