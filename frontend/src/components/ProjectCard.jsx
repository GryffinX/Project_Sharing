import "./ProjectCard.css";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { useRef } from "react";

export default function ProjectCard({ project, onView }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 40 });
  const springY = useSpring(y, { stiffness: 300, damping: 40 });

  const transform = useMotionTemplate`
    rotateX(${springY}deg) rotateY(${springX}deg)
  `;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - left) / width - 0.5;
    const mouseY = (e.clientY - top) / height - 0.5;
    x.set(mouseX * 25);
    y.set(-mouseY * 25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="card-v5"
      onClick={() => onView(project)}
    >
      <div className="card-image-container-v5">
        <img src={project.image} alt={project.name} />
        <div className="card-image-overlay-v5" />
      </div>
      <div className="card-content-v5">
        <div className="card-header-v5">
          <span className="card-category-v5">{project.duration}</span>
          <h3 className="card-title-v5">{project.name}</h3>
        </div>
        <div className="card-footer-v5">
          <div className="tech-pills-v5">
            {project.ingredients?.slice(0, 2).map(t => <span key={t}>{t}</span>)}
            {project.ingredients?.length > 2 && <span>+{project.ingredients.length - 2}</span>}
          </div>
          <button className="card-btn-v5">
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
