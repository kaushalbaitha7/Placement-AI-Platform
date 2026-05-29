import { useState } from "react";
import "../styles/login.css";
import "../styles/flowers.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* 🌿 Password Visibility State */
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/dashboard";
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Server Error ❌");
        }
    };

    return (
        <>
            {/* 🌸 Floating Flowers */}
            <div className="flower flower1"></div>
            <div className="flower flower2"></div>
            <div className="flower flower3"></div>
            <div className="flower flower4"></div>

            {/* 🌿 Login Card */}
            <div className="login-container">
                <div className="login-box">

                    <h2>Placement Platform 🚀</h2>

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* 🌿 PASSWORD FIELD WITH EYE */}
                    <div className="password-field">

                        <input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </span>

                    </div>

                    <button onClick={handleLogin}>
                        Login
                    </button>

                    <div className="login-links">
                        <span>Forgot Password?</span>
                        <span>New User?</span>
                    </div>

                    <button className="google-btn">
                        Sign up with Google
                    </button>

                </div>
            </div>
        </>
    );
}

export default Login;