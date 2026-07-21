import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        urn: "",
        email: "",
        phone: "",
        branch: "",
        semester: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = async () => {

        const {
            name,
            urn,
            email,
            phone,
            branch,
            semester,
            password,
            confirmPassword
        } = formData;

        if (
            !name ||
            !urn ||
            !email ||
            !phone ||
            !branch ||
            !semester ||
            !password ||
            !confirmPassword
        ) {
            return alert("Please fill all fields.");
        }

        if (password !== confirmPassword) {
            return alert("Passwords do not match.");
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        urn,
                        email,
                        phone,
                        branch,
                        semester,
                        password
                    })
                }
            );

            const data = await response.json();

            setLoading(false);

            if (!response.ok) {
                return alert(data.message);
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Registration Successful");

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

                <h1>Placement AI Platform</h1>

                <p className="platform-desc">
                    Begin your placement journey with AI-powered learning,
                    coding practice, mock tests, resume analysis, and career
                    guidance.
                </p>

                <div className="feature-list">

                    <div className="feature">✓ AI Mock Tests</div>
                    <div className="feature">✓ Coding Practice</div>
                    <div className="feature">✓ Resume Analyzer</div>
                    <div className="feature">✓ AI Mentor</div>
                    <div className="feature">✓ Placement Analytics</div>

                </div>

                <img
                    src="/login-illustration.svg"
                    alt="Placement"
                    className="illustration"
                />

            </div>

            {/* RIGHT PANEL */}

            <div className="auth-right">

                <div className="auth-card register-card">

                    <h2>Create Account 🚀</h2>

                    <p>
                        Join Placement AI Platform and start preparing for your dream career.
                    </p>

                    <input
                        className="auth-input"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        name="urn"
                        placeholder="URN / USN"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        name="branch"
                        placeholder="Branch"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        name="semester"
                        placeholder="Semester"
                        onChange={handleChange}
                    />

                    <div className="password-wrapper">

                        <input
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                        />

                        <span
                            className="eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                    </div>

                    <div className="password-wrapper">

                        <input
                            className="auth-input"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                        />

                       <span
                            className="eye"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={handleRegister}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="google-btn">
                        Continue with Google
                    </button>

                    <div className="bottom-link">

                        Already have an account?

                        <span
                            onClick={() => navigate("/")}
                        >
                            Login
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;