import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const SuperAdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded?.role === "SUPER_ADMIN") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only SUPER_ADMIN can access this page.",
          });
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (e) {
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
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

export default SuperAdminRoute;
