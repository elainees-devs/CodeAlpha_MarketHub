import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const user = useAppSelector((state) => state.auth.user);
  const token = localStorage.getItem("access_token");

  //Require BOTH redux + token for safety
  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          intent: "checkout",
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;