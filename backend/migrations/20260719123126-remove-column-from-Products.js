'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'totalPrice');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'totalPrice',{
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    });
  }
};
