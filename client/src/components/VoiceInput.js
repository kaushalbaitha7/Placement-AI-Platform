import { useState, useRef } from "react";

function VoiceInput({ onTranscript }) {

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");

      onTranscript(transcript);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        background: listening ? "#ff4d4d" : "#00e5ff",
        border: "none",
        cursor: "pointer"
      }}
    >
      {listening ? "🎙 Listening..." : "🎤 Speak"}
    </button>
  );
}

export default VoiceInput;