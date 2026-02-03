import './MyWorkCard.css';

export default function MyWorkCard(props) {
    const { recipe, onEdit, onDelete } = props;

    if (!recipe) return null;

    return (
        <div className="projectCard">
            <img
                src={"https://placehold.co/600x400/020617/38bdf8?text=Project+"}
                alt={recipe.dishName}
                className="projectImage"
            />

            <div className="projectHeader">
                <h3>{recipe.dishName}</h3>
                <span className="projectStatus">
                    {recipe.timeTaken}
                </span>
            </div>

            <div className="projectSection">
                <h4>Tech Stack</h4>
                <div className="techStack">
                    {(Array.isArray(recipe.ingredients)
                        ? recipe.ingredients
                        : [recipe.ingredients]
                    ).map((item, i) => (
                        <span key={i} className="techBadge">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="projectSection">
                <h4>Features / Implementation</h4>
                <ul className="featureList">
                    {(Array.isArray(recipe.process)
                        ? recipe.process
                        : [recipe.process]
                    ).map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ul>
            </div>

            <div className="cardActions">
                <button
                    onClick={() => onEdit(recipe)}
                    className="actionButton"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(recipe)}
                    className="actionButton deleteButton"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
