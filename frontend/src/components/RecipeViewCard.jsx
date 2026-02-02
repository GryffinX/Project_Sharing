import "./RecipeViewCard.css";

export default function RecipeViewCard(props) {
    const { recipe, onBack } = props;

    return (
        <div className="viewOverlay">
            <div className="viewContainer">
                <button className="closeButton" onClick={onBack}>
                    ✕
                </button>

                <div className="viewImage">
                    <img src={recipe.image} alt={recipe.name} />
                </div>

                <div className="viewBody">
                    <h2 className="viewName">{recipe.name}</h2>

                    <p className="viewStatus">{recipe.preparationTime}</p>

                    <div className="section">
                        <h4>Tech Stack</h4>
                        <div className="techStack">
                            {recipe.ingredients?.map((tech, index) => (
                                <span key={index} className="techBadge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h4>Project Details</h4>
                        <ul className="featureList">
                            {Array.isArray(recipe.process)
                                ? recipe.process.map((step, index) => (
                                      <li key={index}>{step}</li>
                                  ))
                                : <li>{recipe.process}</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
