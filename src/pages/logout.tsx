import "../App.css";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  useEffect(() => {
    async function performLogout() {
      try {
        await logout();
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        navigate("/home");
      }
    }
    void performLogout();
  }, [logout, navigate]);

  return <></>;
}

export default Logout;
