import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import profilePic from "../assets/kaushal.jpg";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    /* 🌿 FETCH MOCK TEST RESULTS */
    const results =
        JSON.parse(localStorage.getItem("mockResults")) || {};

    /* 🌿 ABILITY DISTRIBUTION MODEL ✅ */
    const TOTAL_TOPICS = 9;
    const TOPIC_WEIGHT = 100 / TOTAL_TOPICS;

    let calculatedAbility = 0;

    Object.values(results).forEach(score => {
        calculatedAbility += (score / 100) * TOPIC_WEIGHT;
    });

    const mockAverage = Math.min(100, Math.round(calculatedAbility));

    const student = {
        name: "Kaushal Baitha",
        photo: profilePic,
        ability: mockAverage,   // ✅ NOW TRUE WEIGHTED ABILITY
        strength: 82,
        resume: 65,
        interview: 71
    };

    /* ✅ Stability Defined */
    const stability = Math.round(
        (student.ability +
         student.strength +
         student.resume +
         student.interview) / 4
    );

    return (
        <>
            <Navbar />

            <div className="dashboard-layout">

                {/* LEFT MAIN AREA */}
                <div className="dashboard-main">

                    <div className="dashboard-header">
                        <h2>Dashboard 🚀</h2>
                        <p>Welcome to Placement Platform 😊</p>
                    </div>

                    <div className="dashboard-grid">

                        <div 
                        className="dashboard-card"
                        onClick={() => navigate("/ai-interview")}
                        >
                            <h3>Mock Interviews</h3>
                            <p>Practice with AI mentor</p>
                        </div>

                        <div
                            className="dashboard-card"
                            onClick={() => navigate("/mock-tests")}
                        >
                            <h3>Mock Tests</h3>
                            <p>Sharpen your skills</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Analytics</h3>
                            <p>Track your growth</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Coding Practice</h3>
                            <p>Prepare like a pro</p>
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="dashboard-side">

                    <div className="profile-card">

                        <div className="profile-header">
                            <img src={student.photo} alt="profile" />
                            <div>
                                <h3>{student.name}</h3>
                                <span>Student Profile</span>
                            </div>
                        </div>

                        <div className="profile-metrics">

                            <div className="metric">
                                <span>Ability</span>
                                <strong>{student.ability}%</strong>
                            </div>

                            <div className="metric">
                                <span>Strength</span>
                                <strong>{student.strength}%</strong>
                            </div>

                            <div className="metric">
                                <span>Resume</span>
                                <strong>{student.resume}%</strong>
                            </div>

                            <div className="metric">
                                <span>Interview</span>
                                <strong>{student.interview}%</strong>
                            </div>

                        </div>

                        <div className="stability-meter">
                            <div className="stability-text">
                                <span>Profile Stability</span>
                                <strong>{stability}%</strong>
                            </div>

                            <div className="meter">
                                <div
                                    className="meter-fill"
                                    style={{ width: `${stability}%` }}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="assistant-card">
                        <h3>AI Assistant 🤖</h3>
                        <p>Your silent mentor</p>
                        <button onClick={() => navigate("/mentor")}>
                            Ask AI
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;