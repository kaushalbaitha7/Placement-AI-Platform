import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/interviewRoom.css";

function InterviewRoom() {

  const { type } = useParams();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [avatar, setAvatar] = useState("male");
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    startInterview();
    setupSpeech();
  }, []);

  /* ==========================
     START INTERVIEW
  ========================== */

  const startInterview = async () => {

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/interview/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type })
    });

    const data = await res.json();

    setQuestion(data.question);
    speakQuestion(data.question);
  };

  /* ==========================
     TEXT TO SPEECH
  ========================== */

  const speakQuestion = (text) => {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    if (avatar === "female") {
      speech.pitch = 1.4;
    } else {
      speech.pitch = 0.8;
    }

    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  /* ==========================
     SPEECH RECOGNITION
  ========================== */

  const setupSpeech = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (event) => {

      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognitionRef.current = recognition;
  };

  const startListening = () => {

    if (!recognitionRef.current) return;

    recognitionRef.current.start();
  };

  /* ==========================
     SUBMIT ANSWER
  ========================== */

  const submitAnswer = async () => {

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/interview/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        answer
      })
    });

    const data = await res.json();

    setQuestion(data.nextQuestion);
    setAnswer("");

    speakQuestion(data.nextQuestion);
  };

  /* ==========================
     AVATAR IMAGE
  ========================== */

  const avatarImage =
    avatar === "male"
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
      : "https://cdn-icons-png.flaticon.com/512/4140/4140051.png";

  return (

    <div className="interview-room">

      <h2>{type.toUpperCase()} Interview</h2>

      {/* Avatar Switch */}

      <div className="avatar-switch">

        <button onClick={() => setAvatar("male")}>
          👨 Male
        </button>

        <button onClick={() => setAvatar("female")}>
          👩 Female
        </button>

      </div>

      {/* Avatar */}

      <div className={`avatar-container ${speaking ? "speaking" : ""}`}>

        <img
          src={avatarImage}
          className="avatar"
          alt="AI interviewer"
        />

      </div>

      {/* Question */}

      <div className="question-box">
        <p>{question}</p>
      </div>

      {/* Answer */}

      <textarea
        placeholder="Type or speak your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="controls">

        <button onClick={startListening}>
          🎤 Speak Answer
        </button>

        <button onClick={submitAnswer}>
          Submit
        </button>

      </div>

    </div>
  );
}

export default InterviewRoom;