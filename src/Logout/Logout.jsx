import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and user data AFTER component mounts
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

    // Redirect to login/role selection
    navigate("/roleselection");
  }, [navigate]);  // make sure navigate is in dependency array

  return null;
};

export default Logout;
