const { registerAdmin, loginAdmin, } = require('../services/authService');
const { success, error } = require('../utils/responseHelper');

const register = async (req, res) => {
    try {
        const { name, email, password, role = 'admin' } = req.body;

        const requiredFields = { email, password };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return error(res, `${key} is missing, please enter`, null, 400);
            }
        }

        if (password.length < 6) {
            return error(res, "Password must be atleast of 6 characters", null, 400);
        }

        const newUser = await registerAdmin(req.body);

        return success(
            res, "Admin registered successfully",
            {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            201
        )
    }
    catch (err) {
        return error(res, err.message, null, 401);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginAdmin(email, password);

        return success(res, "Login successful", result, 200);
    }
    catch (err) {
        return error(res, err.message, null, 401);
    }
}

const getMe = async (req, res)=> {
    try{
        const user = req.user;

        return success(res, "Profile info fetched", user, 200)
    }
    catch(err){
        return error(res, err.message, null, 401)
    }
}

module.exports = { register, login, getMe };