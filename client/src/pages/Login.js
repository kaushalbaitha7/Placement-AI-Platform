import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!loginId || !password) {
            return alert("Please fill all fields");
        }

        try {

            setLoading(true);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        loginId,
                        password
                    })
                }
            );

            const data = await res.json();

            setLoading(false);

            if (!res.ok) {
                return alert(data.message);
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");

        } catch (err) {

            setLoading(false);

            alert("Unable to connect to server.");

        }

    };

    return (

        <div className="auth-page">

            {/* LEFT PANEL */}

            <div className="auth-left">

                <img
                    src="/logo.png"
                    alt="Placement AI"
                    className="platform-logo"
                />

                <h1>
                    Placement AI Platform
                </h1>

                <p className="platform-desc">

                    Prepare smarter and get placed faster with an AI-powered
                    placement preparation platform.

                </p>

                <div className="feature-list">

                    <div className="feature">
                        ✓ AI Mock Tests
                    </div>

                    <div className="feature">
                        ✓ Coding Practice
                    </div>

                    <div className="feature">
                        ✓ Resume Analyzer
                    </div>

                    <div className="feature">
                        ✓ AI Mentor
                    </div>

                    <div className="feature">
                        ✓ Placement Analytics
                    </div>

                </div>

                <img
                    src="/login-illustration.svg"
                    alt="Learning"
                    className="illustration"
                />

            </div>

            {/* RIGHT PANEL */}

            <div className="auth-right">

                <div className="auth-card">

                    <h2>Welcome Back 👋</h2>

                    <p>

                        Sign in to continue your placement journey.

                    </p>

                    <input

                        className="auth-input"

                        placeholder="Email or Phone Number"

                        value={loginId}

                        onChange={(e) =>
                            setLoginId(e.target.value)
                        }

                    />

                    <div className="password-wrapper">

                        <input

                            className="auth-input"

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            placeholder="Password"

                            value={password}

                            onChange={(e) =>
                                setPassword(e.target.value)
                            }

                        />

                        <span
                                className="eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                         </span>
                     </div>

                    <div className="forgot">

                        Forgot Password?

                    </div>

                    <button

                        className="primary-btn"

                        onClick={handleLogin}

                    >

                        {loading
                            ? "Logging In..."
                            : "Login"}

                    </button>

                    <div className="divider">

                        <span>OR</span>

                    </div>

                    <button className="google-btn">

                        Continue with Google

                    </button>

                    <div className="bottom-link">

                        Don't have an account?

                        <span
                            onClick={() =>
                                navigate("/register")
                            }
                        >

                            Create Account

                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;