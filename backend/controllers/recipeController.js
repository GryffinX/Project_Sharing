const Recipes = require('../models/recipeModel');
const mongoose = require('mongoose');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function validateRecipeInput({ dishName, timeTaken, ingredients, process }) {
    if (
        !dishName ||
        !timeTaken ||
        !Array.isArray(ingredients) || ingredients.length === 0 ||
        !Array.isArray(process) || process.length === 0
    ) {
        return false;
    }
    return true;
}

function parseRecipeFields({ ingredients, process }) {
    let parsedIngredients = ingredients;
    let parsedProcess = process;

    if (typeof ingredients === 'string') {
        parsedIngredients = ingredients.split(',')
            .map(i => i.trim())
            .filter(i => i.length > 0);
    }
    if (typeof process === 'string') {
        parsedProcess = process.split(',')
            .map(step => step.trim())
            .filter(step => step.length > 0);
    }
    return { parsedIngredients, parsedProcess };
}

exports.getAllRecipes = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const recipes = await Recipes.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Recipes.countDocuments();

        return res.status(200).send({
            recipes,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching Recipes", error.message);
        return res.status(500).send({ error: "Error fetching Recipes" });
    }
};

exports.getRecipeByName = async (req, res) => {
    const search = req.query.q;
    if (!search || typeof search !== "string" || search.trim() === "") {
        return res.status(400).send({ error: "Search query 'q' is required." });
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeSearch = escapeRegex(search);

    try {
        const recipes = await Recipes.find({
            dishName: { $regex: safeSearch, $options: 'i' }
        });
        if (!recipes || recipes.length === 0) {
            return res.status(404).send({ error: 'No Recipes found' });
        }
        return res.status(200).send({ recipes });
    } catch (error) {
        console.error("Error fetching Recipe", error.message);
        return res.status(500).send({ error: "Error fetching Recipe" });
    }
};

exports.getUserRecipes = async (req, res) => {
    try {
        const userID= req.user.id;
        const myRecipes= await Recipes.find({userID: userID});
        if (!myRecipes) {
            return res.status(400).send({error: "Error fetching recipes"});
        }
        return res.status(200).send({recipes: myRecipes});
    } catch (error) {
        console.error("Error fetching user recipes:", error.message);
        return res.status(500).send({ error: "Error fetching user recipes" });
    }
}

exports.createRecipe = async (req, res) => {
    let { dishName, timeTaken, ingredients, process, image, liveUrl, githubUrl } = req.body;

    const { parsedIngredients, parsedProcess } = parseRecipeFields({ ingredients, process }) 

    if (!validateRecipeInput({ dishName, timeTaken, ingredients: parsedIngredients, process: parsedProcess })) {
        return res.status(400).send({ error: "All fields (dishName, timeTaken, ingredients, process) are required and must be valid." });
    }

    try {
        const newRecipe = new Recipes({
            dishName,
            timeTaken,
            ingredients: parsedIngredients,
            process: parsedProcess,
            image: image || undefined,
            liveUrl: liveUrl || "",
            githubUrl: githubUrl || "",
            userID: req.user.id,
        });
        const savedRecipe = await newRecipe.save();
        return res.status(201).send({ newRecipe: savedRecipe });
    } catch (error) {
        console.error("Error creating Recipe", error.message);
        return res.status(500).send({ error: "Error creating Recipe" });
    }
};

exports.editRecipe = async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid recipe ID format.' });
    }

    let { dishName, timeTaken, ingredients, process, image, liveUrl, githubUrl } = req.body;

    const updateData = {};
    if (dishName !== undefined) updateData.dishName = dishName;
    if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
    if (image !== undefined) updateData.image = image;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (ingredients !== undefined) {
        updateData.ingredients = typeof ingredients === 'string'
            ? ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0)
            : ingredients;
    }
    if (process !== undefined) {
        updateData.process = typeof process === 'string'
            ? process.split(',').map(step => step.trim()).filter(step => step.length > 0)
            : process;
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).send({ error: "No valid fields provided for update." });
    }

    try {
        const updatedRecipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecipe) {
            return res.status(404).send({ error: 'Recipe not found' });
        }
        return res.status(200).send({ updatedRecipe });
    } catch (error) {
        console.error('Error updating Recipe:', error.message);
        return res.status(400).send({ error: 'Error updating Recipe' });
    }
};

exports.deleteRecipe = async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid recipe ID format.' });
    }
    try {
        const deletedRecipe = await Recipes.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).send({ error: 'Recipe not found' });
        }
        return res.status(200).send({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting Recipe:', error.message);
        return res.status(500).send({ error: 'Error deleting Recipe' });
    }
};
