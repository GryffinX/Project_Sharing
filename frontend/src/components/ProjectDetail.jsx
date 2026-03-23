import "./ProjectDetail.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Code, ListChecks, Terminal, Play, CheckCircle2, Share2, Github, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export default function ProjectDetail({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, technical, implementation
  const [terminalStep, setTerminalStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulated Terminal Commands
  const runSimulation = () => {
    setIsSimulating(true);
    setTerminalStep(0);
  };

  const handleShare = () => {
    const url = project.liveUrl || window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    if (isSimulating && terminalStep < (project.process?.length || 0)) {
      const timer = setTimeout(() => {
        setTerminalStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (terminalStep === (project.process?.length || 0)) {
        setIsSimulating(false);
    }
  }, [isSimulating, terminalStep, project.process]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay-v4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 40 }}
        className="modal-content-v4"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header-v4">
           <div className="modal-nav-tabs">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={activeTab === 'technical' ? 'active' : ''} onClick={() => setActiveTab('technical')}>Technical</button>
                <button className={activeTab === 'implementation' ? 'active' : ''} onClick={() => setActiveTab('implementation')}>Implementation</button>
           </div>
           <div className="modal-header-actions">
                <button className="header-icon-btn" onClick={handleShare} title="Share Project"><Share2 size={18} /></button>
                <button className="close-btn-v4 header-icon-btn" onClick={onClose} title="Close"><X size={20} /></button>
           </div>
        </div>

        <div className="modal-body-v4">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="tab-content-v4"
              >
                <div className="overview-grid-v4">
                    <div className="overview-main-v4">
                        <h1 className="detail-title-v4">{project.name}</h1>
                        <p className="detail-desc-v4">
                            High-performance {project.name} built with modular architecture. 
                            This project explores advanced concepts in {project.ingredients?.[0] || 'modern development'}.
                        </p>
                        
                        <div className="detail-meta-grid-v4">
                            <div className="meta-box-v4">
                                <Clock size={16} />
                                <div>
                                    <span>Duration</span>
                                    <strong>{project.duration}</strong>
                                </div>
                            </div>
                            <div className="meta-box-v4">
                                <CheckCircle2 size={16} />
                                <div>
                                    <span>Status</span>
                                    <strong>Completed</strong>
                                </div>
                            </div>
                        </div>

                        <div className="action-row-v4">
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-v4">
                                    <ExternalLink size={18} /> Visit Live Project
                                </a>
                            )}
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary-v4">
                                    <Github size={18} /> View Source
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="overview-visual-v4">
                        <img src={project.image} alt={project.name} />
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'technical' && (
              <motion.div 
                key="technical"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="tab-content-v4"
              >
                <div className="technical-grid-v4">
                    <div className="tech-stack-section">
                        <h3 className="section-label-v4"><Code size={18} /> Built With</h3>
                        <div className="tech-large-grid">
                            {project.ingredients?.map((tech, i) => (
                                <div key={i} className="tech-large-pill">
                                    <span className="dot" /> {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="architecture-section">
                        <h3 className="section-label-v4"><ListChecks size={18} /> Core Features</h3>
                        <div className="features-v4-grid">
                            {project.process?.map((f, i) => (
                                <div key={i} className="feature-v4-item">
                                    <div className="feature-num">0{i+1}</div>
                                    <p>{f}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'implementation' && (
              <motion.div 
                key="implementation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="tab-content-v4"
              >
                <div className="terminal-v4">
                    <div className="terminal-header-v4">
                        <div className="terminal-dots">
                            <span className="red" /> <span className="yellow" /> <span className="green" />
                        </div>
                        <div className="terminal-title">project-live-console.sh</div>
                        <button className="run-btn-v4" onClick={runSimulation} disabled={isSimulating}>
                            <Play size={12} fill="currentColor" /> RUN
                        </button>
                    </div>
                    <div className="terminal-body-v4">
                        <div className="terminal-line">
                            <span className="prompt">$</span> <span className="command">./simulate_build.sh --project "{project.name}"</span>
                        </div>
                        {project.process?.slice(0, terminalStep).map((f, i) => (
                            <div key={i} className="terminal-line success">
                                <CheckCircle2 size={14} className="icon-success" />
                                <span className="output">Step 0{i+1}: {f}... [OK]</span>
                            </div>
                        ))}
                        {isSimulating && (
                             <div className="terminal-line blink">
                                <span className="prompt">$</span> <span className="cursor-sim">_</span>
                             </div>
                        )}
                        {!isSimulating && terminalStep > 0 && (
                            <div className="terminal-line final">
                                <span className="success-txt">Successfully built {project.name} in production mode.</span>
                            </div>
                        )}
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
