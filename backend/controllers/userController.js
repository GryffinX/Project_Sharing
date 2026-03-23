const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send({ users: users })
    } catch (error) {
        console.error('Error fetching all users', error.message);
        return res.status(500).send({ error: 'Error fetching all users' })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({ user });
    } catch (error) {
        console.error('Error fetching user', error.message);
        return res.status(500).send({ error: 'Error fetching user' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user', error.message);
        return res.status(500).send({ error: 'Error updating user' });
    }
}