'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash a default password for the initial setup
    const hashedPassword = await bcrypt.hash('admin123', 10);

    return queryInterface.bulkInsert('Users', [{
      name: 'Shop Owner',
      email: 'admin@store.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // Allows you to undo the seed if needed
    return queryInterface.bulkDelete('Users', { email: 'admin@store.com' }, {});
  }
};