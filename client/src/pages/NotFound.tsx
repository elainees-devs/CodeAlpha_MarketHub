import React from "react";
import HomeButton from "../components/shared/HomeButton";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <h2 style={{ margin: "10px 0" }}>Page Not Found</h2>
      <p style={{ color: "#666", maxWidth: "400px" }}>
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <HomeButton to="/" label="Go Back Home" style={{ marginTop: "20px" }} />  
    </div>
  );
};

export default NotFound;
