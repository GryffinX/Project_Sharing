const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const {requiredRole} = require('../middleware/verifyRoleMiddleware');

userRouter.get('/', requiredRole(['admin']), userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);

module.exports = userRouter;