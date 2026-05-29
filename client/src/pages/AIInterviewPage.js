import { useNavigate } from "react-router-dom";
import "../styles/aiInterview.css";

function AIInterviewPage() {

  const navigate = useNavigate();

  const startRound = (type) => {
    navigate(`/ai-interview/${type}`);
  };

  return (
    <div className="ai-interview-page">

      <h2 className="title">AI Interview Room 🎤</h2>

      <div className="interview-grid">

        {/* BASIC ROUND */}
        <div className="panel">

          <h3>Basic Round 🧠</h3>

          <p>
            General aptitude and computer science fundamentals
          </p>

          <button
            onClick={() => startRound("basic")}
          >
            Start Basic Interview
          </button>

        </div>

        {/* CODING ROUND */}
        <div className="panel">

          <h3>Coding Round 💻</h3>

          <p>
            DSA and coding interview problems
          </p>

          <button
            onClick={() => startRound("coding")}
          >
            Start Coding Interview
          </button>

        </div>

        {/* HR ROUND */}
        <div className="panel">

          <h3>HR Round 👩</h3>

          <p>
            Communication and personality interview questions
          </p>

          <button
            onClick={() => startRound("hr")}
          >
            Start HR Interview
          </button>

        </div>

      </div>

    </div>
  );
}

export default AIInterviewPage;