import './MyWorkView.css';
import MyWorkCard from '../components/MyWorkCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyWorkView() {
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState([]);
    const [recipeName, setRecipeName] = useState('');
    const [recipeTime, setRecipeTime] = useState('');
    const [recipeSteps, setRecipeSteps] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [currentRecipe, setCurrentRecipe] = useState(null);

    const getUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const getConfig = () => {
        const user = getUser();
        return {
            headers: {
                Authorization: `Bearer ${user?.token || ''}`,
            },
        };
    };

    useEffect(() => {
        const getSpecificRecipes = async () => {
            const user = getUser();
            if (!user?.token) {
                setRecipe([]);
                return;
            }

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/recipes/my`,
                    getConfig()
                );
                setRecipe(res?.data?.recipes || []);
            } catch (error) {
                console.error('Failed to fetch projects:', error.message);
                setRecipe([]);
            }
        };

        getSpecificRecipes();
    }, []);

    const handleCreate = () => {
        setModalType('create');
        setCurrentRecipe(null);
        setRecipeName('');
        setRecipeTime('');
        setRecipeIngredients('');
        setRecipeSteps('');
        setShowModal(true);
    };

    const handleEdit = (recipe) => {
        setModalType('edit');
        setCurrentRecipe(recipe);
        setRecipeName(recipe.dishName);
        setRecipeTime(recipe.timeTaken);
        setRecipeIngredients(
            Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(', ')
                : recipe.ingredients
        );
        setRecipeSteps(
            Array.isArray(recipe.process)
                ? recipe.process.join(', ')
                : recipe.process
        );
        setShowModal(true);
    };

    const handleDelete = async (recipe) => {
        try {
            const token = localStorage.getItem('user-access-token');
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/recipes/${recipe._id}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            setRecipe(prev => prev.filter(r => r._id !== recipe._id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleSubmit = async () => {
        if (!recipeName || !recipeTime || !recipeIngredients || !recipeSteps) {
            alert('All fields are required.');
            return;
        }

        const payload = {
            dishName: recipeName,
            timeTaken: recipeTime,
            ingredients: recipeIngredients.split(',').map(i => i.trim()),
            process: recipeSteps.split(',').map(s => s.trim()),
        };

        try {
            const user = getUser();
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token || ''}`,
                },
            };

            if (currentRecipe?._id) {
                const res = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/recipes/${currentRecipe._id}`,
                    payload,
                    config
                );
                setRecipe(prev =>
                    prev.map(r =>
                        r._id === res.data.updatedRecipe._id
                            ? res.data.updatedRecipe
                            : r
                    )
                );
            } else {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/recipes`,
                    payload,
                    config
                );
                setRecipe(prev => [...prev, res.data.newRecipe]);
            }

            setShowModal(false);
        } catch (error) {
            alert('Error saving project');
        }
    };

    return (
        <div className="dashboardContainer">
            {/* HEADER */}
            <div className="dashboardHeader">
                <button className="backButton" onClick={() => navigate('/')}>
                    ← Back
                </button>
                <h1>My Projects</h1>
                <button className="createButton" onClick={handleCreate}>
                    + Add Project
                </button>
            </div>

            {/* PROJECT LIST */}
            <div className="projectsGrid">
                {recipe.length > 0 ? (
                    recipe.map(item => (
                        <MyWorkCard
                            key={item._id}
                            recipe={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="emptyState">
                        You haven’t added any projects yet.
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>
                            {modalType === 'edit'
                                ? 'Edit Project'
                                : 'Add New Project'}
                        </h2>

                        <input
                            type="text"
                            placeholder="Project title"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Status / Duration"
                            value={recipeTime}
                            onChange={(e) => setRecipeTime(e.target.value)}
                        />

                        <textarea
                            placeholder="Tech stack (comma separated)"
                            value={recipeIngredients}
                            onChange={(e) =>
                                setRecipeIngredients(e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Project features / implementation"
                            value={recipeSteps}
                            onChange={(e) => setRecipeSteps(e.target.value)}
                        />

                        <div className="modalButtons">
                            <button onClick={handleSubmit}>Save</button>
                            <button
                                className="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
