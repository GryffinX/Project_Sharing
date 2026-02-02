import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
            .then(async (res) => {
                if (res?.data?.message === "Successfully logged in") {
                    const user = {
                        token: res.data.accessToken,
                        user: res.data.user,
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem("user-access-token", res?.data?.accessToken);
                    alert("Login Successful");
                    navigate('/');
                } else {
                    alert("No user found with this email, Please SignUp");
                    navigate("/SignUp");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("No user found with this email, Please SignUp");
                navigate("/SignUp");
            });
    };

    return (
        <div className="loginBody">
            <div className="loginCard">
                <h2 className="loginHeader">Welcome back 👋</h2>
                <p className="loginSubtext">
                    Sign in to continue sharing your projects
                </p>

                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Sign in</button>
                </form>

                <p className="loginFooter">
                    New here? <Link to="/SignUp">Create an account</Link>
                </p>
            </div>
        </div>
    );
}
