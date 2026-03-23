const mongoose= require('mongoose');

const recipeSchema= new mongoose.Schema({
    dishName: {
        type: String,
        required: true
    }, 
    timeTaken: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    process: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80"
    },
    liveUrl: {
        type: String,
        default: ""
    },
    githubUrl: {
        type: String,
        default: ""
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
});

const Recipes= mongoose.model('projects', recipeSchema);

module.exports= Recipes;