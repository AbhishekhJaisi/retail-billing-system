const { User } = require('../models');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/jwtHelper')

const registerAdmin = async (userData) => {
    const { name, email, password, role = 'admin' } = userData;

    const existingUser = await User.findOne(
        { where: { email } }
    );
    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    return newUser;
}

const loginAdmin = async (email, password) => {
    const admin = await User.findOne({
        where: { email }
    });

    if (!admin) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(admin);

    return {
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email
        }
    };
}

const getUserById = async(id) => {
    const user = await User.findOne({
        where: {id},
        attributes: ["id", "name", "email", "role"],
    });

    return user;
}

module.exports = { registerAdmin, loginAdmin,getUserById };