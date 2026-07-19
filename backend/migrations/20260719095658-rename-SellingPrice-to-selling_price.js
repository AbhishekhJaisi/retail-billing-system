'use strict';

module.exports = {
   async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Products', 'Selling price', 'selling_price')
    await queryInterface.renameColumn('Products', 'Cost price', 'cost_price')
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.renameColumn('Products', 'Selling price', 'selling_price')
    await queryInterface.renameColumn('Products', 'Cost price', 'cost_price')
  }
};
