import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!loginId || !password) {
            return alert("Please fill all fields.");
        }

        try {

            setLoading(true);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        loginId,
                        password,
                    }),
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

            {/* LEFT */}

            <div className="auth-left">

                <div>

                    <h1 className="brand-title">
                        Placement AI
                    </h1>

                    <p className="brand-subtitle">

                        AI-powered placement preparation platform helping
                        students master coding, aptitude, resume building,
                        AI mentoring and career readiness.

                    </p>

                    <div className="feature-list">

                        <div className="feature">✓ AI Mock Tests</div>

                        <div className="feature">✓ Coding Practice</div>

                        <div className="feature">✓ Resume Analyzer</div>

                        <div className="feature">✓ AI Mentor</div>

                        <div className="feature">✓ Performance Analytics</div>

                    </div>

                </div>

                <div className="brand-footer">

                    Kaurahub <span>|</span> Powered by EETIRP

                </div>

            </div>

            {/* RIGHT */}

            <div className="auth-right">

                <div className="auth-card">

                    <h2>
                        Welcome Back 👋
                    </h2>

                    <p>
                        Continue your placement journey.
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <span
                            className="eye"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
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

                        {loading ? "Logging In..." : "Login"}

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
                            onClick={() => navigate("/register")}
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