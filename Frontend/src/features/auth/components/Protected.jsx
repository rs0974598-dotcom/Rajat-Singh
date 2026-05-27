
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({ children, role = "buyer" }) => {

  const user = useSelector((state) => state.auth.user);

  const loading = useSelector((state) => state.auth.loading);

  
  // loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  
  // user not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  
  // role check
  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  
  return children;
};

export default Protected;