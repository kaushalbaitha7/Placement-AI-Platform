import { useState } from "react";
import "../styles/auth.css";

function Login() {

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

            window.location.href = "/dashboard";

        }
        catch (err) {

            setLoading(false);

            alert("Unable to connect to server.");

        }

    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <img
                    src="/logo.png"
                    alt="logo"
                    className="logo"
                />

                <h2 className="auth-title">
                    Placement AI Platform
                </h2>

                <p className="auth-subtitle">
                    Welcome Back
                </p>

                <input
                    className="auth-input"
                    placeholder="Email or Mobile Number"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                />

                <div className="password-wrapper">

                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="eye"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🙈" : "👁"}
                    </span>

                </div>

                <button
                    className="primary-btn"
                    onClick={handleLogin}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="auth-links">

                    <span>
                        Forgot Password?
                    </span>

                    <span
                        onClick={() =>
                            window.location.href = "/register"
                        }
                    >
                        Create Account
                    </span>

                </div>

                <button className="google-btn">
                    Continue with Google
                </button>

            </div>

        </div>

    );

}

export default Login;