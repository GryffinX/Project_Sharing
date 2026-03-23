import './UserProjectCard.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Clock, Terminal, Eye } from 'lucide-react';
import { useState } from 'react';
import ProjectDetail from './ProjectDetail';

export default function UserProjectCard({ project, onEdit, onDelete }) {
    const [showPreview, setShowPreview] = useState(false);
    if (!project) return null;

    // Map backend fields to frontend expected fields for ProjectDetail
    const projectForDetail = {
        ...project,
        name: project.dishName,
        duration: project.timeTaken,
        ingredients: project.ingredients,
        process: project.process,
        image: project.image || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80"
    };

    return (
        <>
            <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="ws-project-card"
            >
                <div className="ws-card-image">
                    <img src={projectForDetail.image} alt={project.dishName} />
                    <div className="ws-image-overlay">
                        <button className="ws-preview-btn" onClick={() => setShowPreview(true)}>
                            <Eye size={18} /> Preview
                        </button>
                    </div>
                </div>

                <div className="ws-card-body">
                    <div className="ws-card-header">
                        <div className="ws-title-wrap">
                            <Terminal size={14} className="terminal-icon" />
                            <h3>{project.dishName}</h3>
                        </div>
                        <div className="ws-card-meta">
                            <Clock size={12} /> {project.timeTaken}
                        </div>
                    </div>

                    <div className="ws-tech-stack">
                        {(Array.isArray(project.ingredients) ? project.ingredients : [project.ingredients]).slice(0, 3).map((item, i) => (
                            <span key={i} className="ws-tech-tag">{item}</span>
                        ))}
                        {project.ingredients?.length > 3 && <span className="ws-tech-tag">+{project.ingredients.length - 3}</span>}
                    </div>

                    <div className="ws-card-actions">
                        <button onClick={() => onEdit(project)} className="ws-action-edit" title="Edit Configuration">
                            <Edit3 size={16} /> Edit
                        </button>
                        <button onClick={() => onDelete(project._id)} className="ws-action-delete" title="Decommission Module">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPreview && (
                    <ProjectDetail 
                        project={projectForDetail} 
                        onClose={() => setShowPreview(false)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
}
