import "./RecipeCard.css";

export default function RecipeCard(props) {
    const { recipe, onView } = props;

    return (
        <div className="cardContainer">
            <div className="cardImage">
                <img src={recipe.image} alt={recipe.name} />
            </div>

            <div className="cardBody">
                <h4 className="cardName">{recipe.name}</h4>

                <p className="cardStatus">
                    {recipe.preparationTime}
                </p>

                {/* Tech stack preview */}
                <div className="techStack">
                    {recipe.ingredients?.slice(0, 3).map((tech, index) => (
                        <span key={index} className="techBadge">
                            {tech}
                        </span>
                    ))}
                </div>

                <button
                    className="cardButton"
                    onClick={() => onView(recipe)}
                >
                    View Project
                </button>
            </div>
        </div>
    );
}
