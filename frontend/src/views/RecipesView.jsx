import { useEffect, useState } from 'react';
import './RecipesView.css';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeViewCard from '../components/RecipeViewCard';

export default function RecipesView() {
    const navigate = useNavigate();

    const [Recipes, setRecipes] = useState([]);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const recipesPerPage = 10;

    useEffect(() => {
        let tempRecipes = [];

        fetch('/Data.json')
            .then(res => res.json())
            .then(data => {
                data.recipes.forEach(item => {
                    tempRecipes.push({
                        id: item.id,
                        name: item.name,
                        preparationTime: item.preparationTime,
                        ingredients: item.ingredients,
                        process: item.process,
                        image: item.image,
                    });
                });

                fetch(`${import.meta.env.VITE_API_URL}/recipes`)
                    .then(res => res.json())
                    .then(apiData => {
                        apiData.recipes.forEach(item => {
                            tempRecipes.push({
                                id: item._id,
                                name: item.dishName,
                                preparationTime: item.timeTaken,
                                ingredients: item.ingredients,
                                process: item.process,
                                image: '/images/Dummy.jpeg',
                            });
                        });
                        setRecipes(tempRecipes);
                    })
                    .catch(() => {
                        // backend optional – still show static projects
                        setRecipes(tempRecipes);
                    });
            });

        if (localStorage.getItem('user-access-token')) {
            setUserLoggedIn(true);
        }
    }, []);

    /* 🔥 FIXED SEARCH LOGIC */
    const filteredRecipes = searchQuery
        ? Recipes.filter(recipe =>
              recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : Recipes;

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;

    const currentRecipes = filteredRecipes.slice(
        indexOfFirstRecipe,
        indexOfLastRecipe
    );

    const handleMyRecipes = () => {
        userLoggedIn ? navigate('/MyWorkView') : navigate('/Login');
    };

    const handleLogOut = () => {
        localStorage.removeItem('user-access-token');
        setUserLoggedIn(false);
    };

    return (
        <>
            {/* HEADER */}
            <div className="navHeader">
                <h1 className="brand">ProjectHub</h1>

                <div className="searchContainer">
                    <input
                        className="search"
                        type="text"
                        placeholder="Search projects"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <span className="searchIcon">⌕</span>
                </div>

                <div className="navActions">
                    <button className="headButton" onClick={handleMyRecipes}>
                        My Projects
                    </button>

                    {!userLoggedIn && (
                        <button
                            className="headButton"
                            onClick={() => navigate('/Login')}
                        >
                            Login
                        </button>
                    )}

                    {!userLoggedIn && (
                        <button
                            className="headButton"
                            onClick={() => navigate('/SignUp')}
                        >
                            Sign up
                        </button>
                    )}

                    {userLoggedIn && (
                        <button
                            className="headButton"
                            onClick={handleLogOut}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* HERO */}
            <section className="heroSection">
                <h2>Discover Developer Projects</h2>
                <p>Explore real-world builds, experiments, and hackathon projects.</p>
            </section>

            {/* PROJECT GRID */}
            <div className="recipeContainer">
                {currentRecipes.length > 0 ? (
                    currentRecipes.map((item, index) => (
                        <RecipeCard
                            key={index}
                            recipe={item}
                            onView={setCurrentRecipe}
                        />
                    ))
                ) : (
                    <p className="notFound">No projects found.</p>
                )}
            </div>

            {/* PAGINATION */}
            <div className="paginationControls">
                {currentPage > 1 && (
                    <button
                        className="paginationButton"
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        ← Prev
                    </button>
                )}

                {indexOfLastRecipe < filteredRecipes.length && (
                    <button
                        className="paginationButton"
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Next →
                    </button>
                )}
            </div>

            {/* PROJECT DETAIL MODAL */}
            {currentRecipe && (
                <RecipeViewCard
                    recipe={currentRecipe}
                    onBack={() => setCurrentRecipe(null)}
                />
            )}
        </>
    );
}
