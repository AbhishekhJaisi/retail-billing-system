'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'Cost price',{
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Products', 'Selling price',{
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await QueryInterface.removeColumn('Products', 'Cost price');
    await QueryInterface.removeColumn('Products', 'Selling price');
  }
};
