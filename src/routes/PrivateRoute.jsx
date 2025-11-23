import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { logout } from "../redux/features/auth/authSlice";



const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          try {
            // Clear all local storage and redux auth state
            localStorage.clear();
          } catch (_) {}
          dispatch(logout());
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin or super admin can login.",
          });
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    setIsLoading(false);
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loader-black"></span>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;




 


