'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Products', 'price', 'totalPrice')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Products','price', 'totalPrice')
  }
};
