import './Login.css'; // Reuse Login styles
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, { username, email, password })
            .then(async (res) => {
                if (res?.data?.message === "Successfully registered new user") {
                    toast.success("Account created! Welcome to ProjectHub.");
                    navigate('/login');
                } else {
                    toast.error(res?.data?.error || "SignUp failed. This email might already be in use.");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="auth-v3">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card-v3"
            >
                <button className="auth-back-v3" onClick={() => navigate('/')}>
                    <ArrowLeft size={18} />
                </button>
                
                <div className="auth-header-v3">
                    <div className="auth-logo-v3"><Sparkles size={24} /></div>
                    <h2>Create Account</h2>
                    <p>Join the hub of project excellence.</p>
                </div>

                <form className="auth-form-v3" onSubmit={handleSignUp}>
                    <div className="ws-field">
                        <User size={16} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="ws-field">
                        <Mail size={16} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                        />
                    </div>
                    <div className="ws-field">
                        <Lock size={16} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn-v3" disabled={isSubmitting}>
                        {isSubmitting ? "Initializing..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-foot-v3">
                    Already an operative? <Link to="/Login">Access Gateway</Link>
                </p>
            </motion.div>
        </div>
    );
}
