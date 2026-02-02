import './SignUp.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, { username, email, password })
            .then(async (res) => {
                if (res?.data?.message === "Successfully registered new user") {
                    alert("Signup Successful");
                    navigate('/Login');
                } else {
                    alert("SignUp failed, please try again!");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("SignUp failed, please try again!");
            });
    };

    return (
        <div className="signUpBody">
            <div className="signUpCard">
                <h2 className="signUpHeader">Create your account 🚀</h2>
                <p className="signUpSubtext">
                    Join developers showcasing real projects
                </p>

                <form className="form" onSubmit={handleSignUp}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        required
                    />
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
                    <button type="submit">Get started</button>
                </form>

                <p className="signUpFooter">
                    Already have an account? <Link to="/Login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
