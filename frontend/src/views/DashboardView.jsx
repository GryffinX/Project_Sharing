import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    LayoutDashboard, 
    ArrowLeft, 
    Save, 
    X, 
    PlusCircle,
    User,
    Sparkles,
    LogOut
} from 'lucide-react';
import UserProjectCard from '../components/UserProjectCard';
import Portfolio3D from '../components/Portfolio3D';
import './DashboardView.css';

const ProfileView = ({ user, token, onUpdate, userProjects = [] }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setUsername(user?.username || '');
        setEmail(user?.email || '');
    }, [user]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        axios.put(`${import.meta.env.VITE_API_URL}/user/${user.id}`, { username, email }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            toast.success("Profile updated successfully");
            onUpdate(res.data.user);
            setIsEditing(false);
        })
        .catch(err => {
            console.error(err);
            toast.error("Failed to update profile.");
        });
    };

    return (
        <div className="bento-item bento-full-width">
            <h2>User Profile</h2>
            <div className="profile-layout">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <span>{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                </div>
                <div className="profile-details-section">
                    {!isEditing ? (
                        <>
                            <div className="profile-field">
                                <label>Username</label>
                                <p>{user?.username}</p>
                            </div>
                            <div className="profile-field">
                                <label>Email</label>
                                <p>{user?.email}</p>
                            </div>
                            
                            <div className="profile-stats">
                                <div className="stat-card">
                                    <span className="stat-label">Projects</span>
                                    <span className="stat-value">{userProjects.length}</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Total Impact</span>
                                    <span className="stat-value">{userProjects.length * 124}</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Commits</span>
                                    <span className="stat-value">{userProjects.length * 8}</span>
                                </div>
                            </div>

                            <button className="ws-submit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="ws-form">
                            <div className="field-wrap">
                                <label>Username</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className="field-wrap">
                                <label>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="profile-form-actions">
                                <button type="submit" className="ws-submit-btn">Save Changes</button>
                                <button type="button" className="ws-create-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DashboardView() {
    const navigate = useNavigate();
    const [userProjects, setUserProjects] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, profile

    const [formData, setFormData] = useState({
        dishName: '',
        timeTaken: '',
        ingredients: '',
        process: '',
        image: '',
        liveUrl: '',
        githubUrl: ''
    });

    const token = localStorage.getItem('user-access-token');

    const updateUserInStorage = (updatedUser) => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            parsed.user = { ...parsed.user, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(parsed));
            setUserData(parsed.user);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser.user);

            if (activeView === 'profile' && parsedUser.user.id) {
                axios.get(`${import.meta.env.VITE_API_URL}/user/${parsedUser.user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => {
                    updateUserInStorage(res.data.user);
                })
                .catch(err => {
                    console.error("Failed to fetch full user profile", err);
                    toast.error("Could not load full profile.");
                });
            }
        }
    }, [activeView, token]);

    const fetchUserProjects = useCallback(async () => {
        if (activeView !== 'dashboard') {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProjects(res.data.recipes);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your projects");
        } finally {
            setIsLoading(false);
        }
    }, [token, activeView]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserProjects();
    }, [token, navigate, fetchUserProjects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ dishName: '', timeTaken: '', ingredients: '', process: '', image: '', liveUrl: '', githubUrl: '' });
        setIsFormOpen(false);
        setEditingProject(null);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            dishName: project.dishName,
            timeTaken: project.timeTaken,
            ingredients: Array.isArray(project.ingredients) ? project.ingredients.join(', ') : project.ingredients,
            process: Array.isArray(project.process) ? project.process.join('\\n') : project.process,
            image: project.image || '',
            liveUrl: project.liveUrl || '',
            githubUrl: project.githubUrl || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Project deleted successfully");
            fetchUserProjects();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete project");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            ingredients: formData.ingredients.split(',').map(i => i.trim()),
            process: formData.process.split('\\n').map(p => p.trim()).filter(p => p !== ''),
            image: formData.image || undefined,
            liveUrl: formData.liveUrl,
            githubUrl: formData.githubUrl
        };

        try {
            if (editingProject) {
                await axios.patch(`${import.meta.env.VITE_API_URL}/recipes/${editingProject._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Project updated successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/recipes`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Project created successfully");
            }
            resetForm();
            fetchUserProjects();
        } catch (err) {
            console.error(err);
            toast.error(editingProject ? "Failed to update" : "Failed to create");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('user-access-token');
        toast.info("Signed out from workstation");
        navigate('/');
    };
    
    const renderActiveView = () => {
        switch(activeView) {
            case 'profile':
                return <ProfileView user={userData} token={token} onUpdate={updateUserInStorage} userProjects={userProjects} />;
            case 'dashboard':
            default:
                return (
                    <>
                        {/* Header Bento */}
                        <div className="bento-item bento-header" style={{ position: 'relative', overflow: 'hidden' }}>
                            <Portfolio3D />
                            <div className="user-welcome" style={{ position: 'relative', zIndex: 1 }}>
                                <h1>Welcome back, <span>{userData?.username || 'Architect'}</span></h1>
                                <p>You have {userProjects.length} projects in your orbital portfolio.</p>
                            </div>
                            <button className="ws-create-btn" onClick={() => setIsFormOpen(true)} style={{ position: 'relative', zIndex: 1 }}>
                                <PlusCircle size={20} />
                                Initiate New Project
                            </button>
                        </div>

                        {/* Stats Bento */}
                        <div className="bento-item bento-stats">
                            <div className="stat-card">
                                <span className="stat-label">Total Impact</span>
                                <span className="stat-value">{userProjects.length * 124}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Commits</span>
                                <span className="stat-value">{userProjects.length * 8}</span>
                            </div>
                        </div>

                        {/* Form / Grid Bento Container */}
                        <div className="bento-content-area">
                            <AnimatePresence>
                                {isFormOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bento-item bento-form"
                                    >
                                        <div className="ws-form-header">
                                            <h3>{editingProject ? "Reconfigure Module" : "Assemble New Module"}</h3>
                                            <button onClick={resetForm} className="close-form"><X size={18} /></button>
                                        </div>
                                        <form onSubmit={handleSubmit} className="ws-form">
                                            <div className="ws-input-group">
                                                <div className="field-wrap">
                                                    <label>Project Title</label>
                                                    <input name="dishName" value={formData.dishName} onChange={handleInputChange} placeholder="e.g. Nexus OS" required />
                                                </div>
                                                <div className="field-wrap">
                                                    <label>Development Cycle</label>
                                                    <input name="timeTaken" value={formData.timeTaken} onChange={handleInputChange} placeholder="e.g. 4 Months" required />
                                                </div>
                                            </div>
                                            <div className="field-wrap">
                                                <label>Core Technologies (Comma separated)</label>
                                                <input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="React, Rust, WebGL" required />
                                            </div>
                                            <div className="field-wrap">
                                                <label>Preview Image URL</label>
                                                <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                                            </div>
                                            <div className="ws-input-group">
                                                <div className="field-wrap">
                                                    <label>Live Demo URL</label>
                                                    <input name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} placeholder="https://my-project.vercel.app" />
                                                </div>
                                                <div className="field-wrap">
                                                    <label>GitHub Repository</label>
                                                    <input name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/user/repo" />
                                                </div>
                                            </div>
                                            <div className="field-wrap">
                                                <label>Implementation Roadmap (New line for each step)</label>
                                                <textarea name="process" value={formData.process} onChange={handleInputChange} placeholder="Phase 1: Architecture design..." rows={4} required />
                                            </div>
                                            <button type="submit" className="ws-submit-btn">
                                                <Save size={18} /> {editingProject ? "Save Changes" : "Deploy Project"}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="bento-projects-grid">
                                {isLoading ? (
                                    <div className="ws-loader">Accessing orbital data...</div>
                                ) : userProjects.length > 0 ? (
                                    <AnimatePresence mode='popLayout'>
                                        {userProjects.map(project => (
                                            <UserProjectCard key={project._id} project={project} onEdit={handleEdit} onDelete={handleDelete} />
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <div className="ws-empty">
                                        <h3>Portfolio Void Detected</h3>
                                        <p>Your workstation is ready for your first deployment.</p>
                                        <button onClick={() => setIsFormOpen(true)}>Initialize First Module</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="workstation-container">
            {/* Minimal Sidebar */}
            <aside className="workstation-sidebar">
                <div className="ws-logo" onClick={() => navigate('/')}>
                    <Sparkles size={24} className="brand-icon" />
                </div>
                <nav className="ws-nav-icons">
                    <button className={`ws-icon-btn ${activeView === 'dashboard' ? 'active' : ''}`} title="Dashboard" onClick={() => setActiveView('dashboard')}><LayoutDashboard size={20} /></button>
                    <button className={`ws-icon-btn ${activeView === 'profile' ? 'active' : ''}`} title="User Profile" onClick={() => setActiveView('profile')}><User size={20} /></button>
                </nav>
                <div className="ws-sidebar-footer">
                    <button className="ws-icon-btn logout" onClick={handleLogout} title="Sign Out"><LogOut size={20} /></button>
                    <button className="ws-back-btn" onClick={() => navigate('/')} title="Exit Workstation"><ArrowLeft size={20} /></button>
                </div>
            </aside>

            {/* Bento Main Content */}
            <main className="workstation-main">
                <div className="bento-grid">
                    {renderActiveView()}
                </div>
            </main>
        </div>
    );
}
