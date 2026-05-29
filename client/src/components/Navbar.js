import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");   // ✅ No page reload
  };

  return (
    <div className="navbar">
      <h3>Placement Platform 🚀</h3>

      <div>
        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;