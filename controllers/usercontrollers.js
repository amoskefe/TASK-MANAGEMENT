const User = require('../models/userModel');

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Fetching user profile failed' });
    }
};



// Delete User Account
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Deleting user account failed' });
    }
};

// updateUser
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};
