import { useNavigate } from "react-router-dom";
import "../styles/navigator.css";

function Navigator() {

  const navigate = useNavigate();

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <div className="navigator-panel">
      <button className="nav-btn" onClick={goBack}>
        ◀
      </button>

      <button className="nav-btn" onClick={goForward}>
        ▶
      </button>

      <button className="nav-btn" onClick={() => navigate("/dashboard")}>
        🏠
      </button>
    </div>
  );
}

export default Navigator;