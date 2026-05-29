import { useNavigate } from "react-router-dom";
import "../styles/homeButton.css";

   

   function HomeButton() {
     const navigate = useNavigate();
  return (
    <button className="nav-btn">
      🏠
    </button>
  );
}

export default HomeButton;