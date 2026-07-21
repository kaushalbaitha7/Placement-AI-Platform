import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MockTests from "./pages/MockTests";
import QuizPage from "./pages/QuizPage";
import MentorPage from "./pages/MentorPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import InterviewRoom from "./pages/InterviewRoom";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Router>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-tests"
          element={
            <ProtectedRoute>
              <MockTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:topic"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <MentorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-interview"
          element={
            <ProtectedRoute>
              <AIInterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-interview/:type"
          element={
            <ProtectedRoute>
              <InterviewRoom />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>

  );

}

export default App;