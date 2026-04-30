// hooks/useLogout.ts
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    // optional cleanup if you use localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return handleLogout;
};