import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MockTests from "./pages/MockTests";
import QuizPage from "./pages/QuizPage";
import MentorPage from "./pages/MentorPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import InterviewRoom from "./pages/InterviewRoom";


import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/quiz/:topic" element={<QuizPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/ai-interview" element={<AIInterviewPage />} />
        <Route path="/ai-interview/:type" element={<InterviewRoom />} />
      </Routes>
    </Router>
  );
}

export default App;