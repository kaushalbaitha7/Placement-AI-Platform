import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/quiz.css";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import Navigator from "../components/Navigator";

function Quiz() {

    const navigate = useNavigate();
    const { topic } = useParams();

    const [questions, setQuestions] = useState([]);

    const [currentQ, setCurrentQ] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(45);
    const [showModal, setShowModal] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [percentage, setPercentage] = useState(0);

    /* ✅ NEW STATE */
    const [mentorDecision, setMentorDecision] = useState(null);

    /* ✅ FETCH + TRANSFORM DATA */
    useEffect(() => {

        fetch(`${process.env.REACT_APP_API_URL}/api/questions/${topic}`)
            .then(res => res.json())
            .then(data => {

                const formattedQuestions = data.slice(0, 30).map(q => ({
                    question: q.question,
                    options: [
                        q.option1,
                        q.option2,
                        q.option3,
                        q.option4
                    ],
                    answer: q.answer
                }));

                setQuestions(formattedQuestions);
            })
            .catch(err => console.log("Fetch Error:", err));

    }, [topic]);

    /* 🌿 TIMER ENGINE */
    useEffect(() => {

        if (!questions.length || showModal) return;

        if (timeLeft === 0) {
            handleNext();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [timeLeft, currentQ, questions]);

    const handleOptionClick = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQ]: optionIndex
        });
    };

    const handleNext = () => {

        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setTimeLeft(45);
        } else {
            calculateScore();
        }
    };

    const handleBack = () => {

        if (currentQ > 0) {
            setCurrentQ(currentQ - 1);
            setTimeLeft(45);
        }
    };

    const calculateScore = async () => {

        let score = 0;

        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) {
                score++;
            }
        });

        const percent = Math.round((score / questions.length) * 100);
        const timeTaken = (questions.length * 45) - timeLeft;

        /* ✅ Save Result */
        await fetch(`${process.env.REACT_APP_API_URL}/api/results/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: "TEMP_USER_ID",
                topic,
                score,
                percentage: percent
            })
        });

        /* ✅ Call Mentor Engine */
        const mentorRes = await fetch(`${process.env.REACT_APP_API_URL}/api/mentor/session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: "TEMP_USER_ID",
                topic,
                score,
                percentage: percent,
                timeTaken,
                consecutiveWrong: 0
            })
        });

        const mentorData = await mentorRes.json();

        setFinalScore(score);
        setPercentage(percent);
        setMentorDecision(mentorData.mentorDecision);
        setShowModal(true);
    };

    const isAnswered = selectedAnswers[currentQ] !== undefined;

    if (!questions.length) {
        return (
            <div className="quiz-page">
                <HomeButton />
                <Navigator />
                <h2 className="quiz-title">{topic} 🧠</h2>
                <p style={{ textAlign: "center" }}>
                    Loading Questions...
                </p>
            </div>
        );
    }

    const q = questions[currentQ];

    return (
        <div className="quiz-page">

            <HomeButton />
            <Navigator />

            <h2 className="quiz-title">
                {topic} 🧠
            </h2>

            <div className="timer-box">
                ⏱ {timeLeft}s
            </div>

            <div className="questions-wrapper">

                <div className="question-box">

                    <h3 className="question-text">
                        Q{currentQ + 1} / {questions.length}
                    </h3>

                    <p className="main-question">
                        {q.question}
                    </p>

                    <div className="options-column">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`option-btn ${
                                    selectedAnswers[currentQ] === i ? "selected" : ""
                                }`}
                                onClick={() => handleOptionClick(i)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="quiz-nav-buttons">

                        <button
                            className="back-btn"
                            onClick={handleBack}
                            disabled={currentQ === 0}
                        >
                            ← Back
                        </button>

                        <button
                            className="next-btn"
                            onClick={handleNext}
                            disabled={!isAnswered}
                        >
                            Next →
                        </button>

                    </div>

                </div>

            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <h3>Assessment Completed ✅</h3>

                        <p>
                            Marks Scored: <strong>{finalScore}</strong> / {questions.length}
                        </p>

                        <p>
                            Percentage: <strong>{percentage}%</strong>
                        </p>

                        {mentorDecision && (
                            <div style={{ marginTop: "20px", textAlign: "left" }}>
                                <hr />
                                <h4>AI Mentor Feedback 🧠</h4>

                                <p>
                                    Difficulty Suggested: <strong>{mentorDecision.nextDifficulty}</strong>
                                </p>

                                <p>
                                    Confidence Level: <strong>{mentorDecision.confidenceLevel}</strong>
                                </p>

                                <p>
                                    Trend: <strong>{mentorDecision.trend}</strong>
                                </p>

                                <p>
                                    Recommendation:
                                    <br />
                                    <strong>{mentorDecision.recommendedAction}</strong>
                                </p>
                            </div>
                        )}

                        <button onClick={() => navigate("/dashboard")}>
                            OK
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Quiz;