require('dotenv').config();
const express=require('express');
const cors = require('cors')
const mongoConnection = require('./config/mongodb');
const recipeRouter= require('./routes/recipe');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user')
const {authenticate}= require('./middleware/authMiddleware');
const {requiredRole} = require('./middleware/verifyRoleMiddleware');


const app=express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

const PORT= process.env.PORT || 3000;

mongoConnection();



app.use('/recipes',recipeRouter);
app.use('/auth', authRouter);
app.use('/user', authenticate, userRouter);

app.get('/', (req,res) => {
    return res.status(200).send({message: "Server is successfully running"});
})
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;