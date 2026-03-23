import { useEffect, useState, Suspense } from 'react';
import './ExploreView.css';
import ProjectCard from '../components/ProjectCard';
import ProjectDetail from '../components/ProjectDetail';
import Hero3D from '../components/Hero3D';
import TechStats from '../components/TechStats';
import { Filter, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["All", "AI/ML", "Web App", "Mobile", "Blockchain", "Tooling"];

export default function ExploreView() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch static data
                const staticRes = await fetch('/Data.json');
                const staticData = await staticRes.json();
                const staticProjects = staticData.recipes.map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category || "Tooling",
                    duration: item.preparationTime,
                    ingredients: item.ingredients,
                    process: item.process,
                    image: item.image,
                    githubUrl: item.githubUrl,
                    liveUrl: item.liveUrl
                }));

                // Fetch dynamic data from API
                let dynamicProjects = [];
                try {
                    const apiRes = await fetch(`${import.meta.env.VITE_API_URL}/recipes`);
                    const apiData = await apiRes.json();
                    dynamicProjects = apiData.recipes.map(item => ({
                        id: item._id,
                        name: item.dishName,
                        category: "Web App", // Default for user projects
                        duration: item.timeTaken,
                        ingredients: item.ingredients,
                        process: item.process,
                        image: item.image,
                        githubUrl: item.githubUrl,
                        liveUrl: item.liveUrl
                    }));
                } catch (apiErr) {
                    console.error("Failed to fetch dynamic projects", apiErr);
                }

                setProjects([...dynamicProjects, ...staticProjects]);
            } catch (err) {
                console.error("Failed to load projects", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.ingredients?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = activeCategory === "All" || 
                               project.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
                               project.ingredients?.some(tech => tech.toLowerCase().includes(activeCategory.toLowerCase()));
        
        return matchesSearch && matchesCategory;
    });

    return (
        <motion.div 
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="command-center-container"
        >
            <section className="cc-hero">
                <div className="cc-hero-3d">
                    <Suspense fallback={null}><Hero3D /></Suspense>
                </div>
                <div className="cc-hero-content">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                    >
                        Project Sharing for Developers
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    >
                        A curated showcase of high-end technical builds and open-source experiments.
                    </motion.p>
                </div>
            </section>

            <main className="cc-main">
                <div className="bento-grid-v5">
                    {/* Bento Item 1: Search & Filter */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bento-item-v5 search-filter-box"
                    >
                        <div className="filter-header">
                            <Filter size={16} />
                            <h4>Filter & Search</h4>
                        </div>
                        <div className="search-box-v5">
                            <Search size={18} />
                            <input 
                                placeholder="Search by name, tech..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="category-pills-v5">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat}
                                    className={`cat-pill-v5 ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bento Item 2: Tech Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }} 
                        className="bento-item-v5 tech-stats-box"
                    >
                       <TechStats projects={projects} />
                    </motion.div>

                    {/* Bento Item 3: Project Spotlight */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                        className="bento-item-v5 project-spotlight-box"
                    >
                        <Sparkles size={18} className="spotlight-icon" />
                        <h4>Project Spotlight</h4>
                        {projects.length > 0 && (
                            <>
                                <div className="spotlight-image-container">
                                    <img src={projects[0].image} alt={projects[0].name} className="spotlight-image" />
                                </div>
                                <div className="spotlight-content">
                                    <h5>{projects[0].name}</h5>
                                    <p>{projects[0].process?.[0]}</p>
                                    <button onClick={() => setSelectedProject(projects[0])}>View Details</button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

                <div className="cc-project-feed">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="feed-grid-v5"
                        >
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-skeleton-v5" />)
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map(p => <ProjectCard key={p.id} project={p} onView={setSelectedProject} />)
                            ) : (
                                <div className="no-results-v5">No projects found.</div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            
            <AnimatePresence>
                {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
            </AnimatePresence>
        </motion.div>
    );
}
