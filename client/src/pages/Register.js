import { useState } from "react";
import "../styles/auth.css";

function Register() {

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

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Registration Successful");

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

                    Student Registration

                </h2>

                <p className="auth-subtitle">

                    Placement AI Platform

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

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />

                <button
                    className="primary-btn"
                    onClick={handleRegister}
                >

                    {loading ? "Creating Account..." : "Register"}

                </button>

                <div className="auth-links">

                    <span></span>

                    <span
                        onClick={() => window.location.href = "/"}
                    >

                        Already have an account?

                    </span>

                </div>

            </div>

        </div>

    );

}

export default Register;