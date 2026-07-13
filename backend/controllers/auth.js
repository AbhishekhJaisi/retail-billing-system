const { registerAdmin, loginAdmin } = require('../services/authService');
const { success, error } = require('../utils/responseHelper');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate all required fields
        if (!name || !name.trim()) {
            return error(res, 'Name is required', null, 400);
        }
        if (!email) {
            return error(res, 'Email is required', null, 400);
        }
        if (!password) {
            return error(res, 'Password is required', null, 400);
        }
        if (password.length < 6) {
            return error(res, 'Password must be at least 6 characters', null, 400);
        }

        const newUser = await registerAdmin(req.body);

        return success(
            res,
            'Account registered successfully',
            {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            201
        );
    } catch (err) {
        // Duplicate email → 409 Conflict
        if (err.message === 'Email is already registered') {
            return error(res, err.message, null, 409);
        }
        return error(res, err.message || 'Registration failed', null, 500);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return error(res, 'Email and password are required', null, 400);
        }

        const result = await loginAdmin(email, password);

        return success(res, 'Login successful', result, 200);
    } catch (err) {
        return error(res, err.message || 'Login failed', null, 401);
    }
};

const getMe = async (req, res) => {
    try {
        return success(res, 'Profile info fetched', req.user, 200);
    } catch (err) {
        return error(res, err.message || 'Could not fetch profile', null, 500);
    }
};

const logout = async (req, res) => {
    try {
        return success(res, 'Logout successful', null, 200);
    } catch (err) {
        return error(res, err.message || 'Logout failed', null, 500);
    }
};

module.exports = { register, login, getMe, logout };
