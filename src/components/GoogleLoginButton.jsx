import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ signInGoogle }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        signInGoogle()
        .then((result) => {
            navigate(location?.state ? location.state : "/");
    
          }).catch((error) => {
            const errorMessage = error.message;
         
          });
    }
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center px-6 py-3 bg-blue-400 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google Icon"
          className="w-6 h-6 mr-3"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
