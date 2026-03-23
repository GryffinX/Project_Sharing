import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
            .then(async (res) => {
                if (res?.data?.message === "Successfully logged in") {
                    const user = { token: res.data.accessToken, user: res.data.user };
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem("user-access-token", res?.data?.accessToken);
                    toast.success("Identity Verified. Welcome back.");
                    navigate('/');
                }
            })
            .catch(() => toast.error("Verification Failed. Check credentials."))
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
                    <h2>Access Gateway</h2>
                    <p>Enter your credentials to proceed.</p>
                </div>

                <form className="auth-form-v3" onSubmit={handleLogin}>
                    <div className="ws-field">
                        <Mail size={16} />
                        <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                    </div>
                    <div className="ws-field">
                        <Lock size={16} />
                        <input type="password" placeholder="Passkey" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-btn-v3" disabled={isSubmitting}>
                        {isSubmitting ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <p className="auth-foot-v3">
                    New operative? <Link to="/SignUp">Initialize Account</Link>
                </p>
            </motion.div>
        </div>
    );
}
