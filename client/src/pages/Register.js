import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
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
            return Swal.fire({
                icon: "warning",
                title: "Incomplete Form",
                text: "Please fill in all required fields.",
                confirmButtonColor: "#2563eb",
            });
        }

        if (password !== confirmPassword) {
           return Swal.fire({
                icon: "warning",
                title: "Password Mismatch",
                text: "Password and Confirm Password must match.",
                confirmButtonColor: "#2563eb",
            });
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
                return Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: data.message,
                    confirmButtonColor: "#ef4444",
                });
            }


           Swal.fire({
    icon: "success",
    title: "Registration Successful!",
    html: `
        <div style="font-size:15px;color:#555;line-height:1.7">
            Welcome to <b>Placement AI</b> 🎉<br><br>
            Your account has been created successfully.
            <br><br>
            Please login to continue your placement journey.
        </div>
    `,
    confirmButtonText: "Proceed to Login",
    confirmButtonColor: "#2563eb",
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 3500,
    timerProgressBar: true,
}).then(() => {
    navigate("/");
});

        } catch (err) {

            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to connect to the server. Please try again later.",
                confirmButtonColor: "#ef4444",
            });

        }

    };

    return (

        <div className="auth-page">

            {/* LEFT PANEL */}

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

            {/* RIGHT PANEL */}

            <div className="auth-right">

                <div className="auth-card register-card">

                    <h2>Create Account 🚀</h2>

                    <p>
                        Start your placement journey with Placement AI.
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
                        type="email"
                        name="email"
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
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                    </div>

                    <div className="password-wrapper">

                        <input
                            className="auth-input"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                        />

                        <span
                            className="eye"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        >
                            {showConfirmPassword
                                ? <FaEyeSlash />
                                : <FaEye />}
                        </span>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={handleRegister}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
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