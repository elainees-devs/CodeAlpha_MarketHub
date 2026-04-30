// components/ui/HomeButton.tsx
import React from "react";
import { Link, type LinkProps } from "react-router-dom";

interface HomeButtonProps extends LinkProps {
  label?: string;
  className?: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  label = "Go Home",
  to,
  className = "",
  ...rest
}) => {
  return (
    <Link
      to={to}
      {...rest}
      className={className}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#000",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "6px",
        display: "inline-block",
        ...rest.style,
      }}
    >
      {label}
    </Link>
  );
};

export default HomeButton;