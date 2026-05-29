import HomeButton from "../components/HomeButton";
import "../styles/mocktests.css";
import Navigator from "../components/Navigator";

import { useNavigate } from "react-router-dom";

function MockTests() {

    const navigate = useNavigate();

    const topics = [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Recursion",
        "Binary Trees",
        "Graphs",
        "Algorithms"
    ];

    return (
        
        <div className="mocktests-container">

            <Navigator />
            <div className="mocktests-header">
                <h2>Mock Test Library 📚</h2>
                <p>Select a topic to begin assessment</p>
            </div>

            <div className="topics-grid">
                {topics.map((topic, index) => (
                    <div 
                        key={index}
                        className="topic-card"
                        onClick={() => window.location.href = `/quiz/${topic}`}
                    >
                        <h3>{topic}</h3>
                        <span>Start Test</span>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default MockTests;