'use strict';

const { v4: uuidv4 } = require('uuid');

const parkingId = uuidv4();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // User di esempio
    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      name: 'Mario Rossi',
      email: 'mario@example.com',
      password: 'mario', // NON plaintext, qui è solo demo
      role: 'operatore',
      tokens: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      id: uuidv4(),
      name: 'Luigi Bianchi',
      email: 'luigi@example.com',
      password: 'luigi', 
      role: 'automobilista',
      tokens: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Parking
    await queryInterface.bulkInsert('Parkings', [{
      id: parkingId,
      name: 'Parcheggio Centrale',
      address: 'Via Roma 1',
      closedData: new Date('2025-12-31'), 
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Ottieni l'id appena creato (in un vero seed, puoi fare una select dopo insert)
    // Qui, se hai valori statici o pre-generati per id, puoi usarli direttamente

    // ParkingCapacity
    await queryInterface.bulkInsert('ParkingCapacities', [
      {
        id: uuidv4(),
        parkingId: parkingId,
        vehicleType: 'auto',
        capacity: 30,
        price: 2.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        parkingId: parkingId,
        vehicleType: 'moto',
        capacity: 15,
        price: 1.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ParkingCapacities', null, {});
    await queryInterface.bulkDelete('Parkings', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
