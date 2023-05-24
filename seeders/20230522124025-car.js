'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    Example:
    await queryInterface.bulkInsert('Cars', [
      {
        title: 'Rx7',
        body: 'Mobil ini sangat keren',
        approved: true
      },
      {
        title: 'Brio',
        body: 'Mobil ini lebih keren dari rx7',
        approved: false
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Cars', null, {});
  }
};
