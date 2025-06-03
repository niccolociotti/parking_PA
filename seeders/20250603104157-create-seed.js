'use strict';

const { v4: uuidv4 } = require('uuid');

const parkingId = uuidv4();
const parkingCapacityAutoId = uuidv4(); 
const userId = uuidv4();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // User di esempio
    await queryInterface.bulkInsert('Users', [{
      id: userId,
      name: 'Mario Rossi',
      email: 'marioo@example.com',
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
        id: parkingCapacityAutoId,
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

    // Reservation di esempio
    await queryInterface.bulkInsert('Reservations', [
      {
        id: uuidv4(),
        status: 'In attesa di pagamento',
        userId: userId,
        parkingId: parkingCapacityAutoId,
        licensePlate: 'AB124CD',
        startTime: new Date('2025-07-01T08:00:00Z'),
        endTime: new Date('2025-07-02T18:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        status: 'In attesa di pagamento',
        userId: userId,
        parkingId: parkingCapacityAutoId,
        licensePlate: 'AB123CD',
        startTime: new Date('2025-06-01T08:00:00Z'),
        endTime: new Date('2025-06-02T18:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});

    //Fine 

    await queryInterface.bulkInsert('Fines', [
      {
        id: uuidv4(),
        price: 100,
        licensePlate: 'AB123CD',
        parkingId: parkingId,
        violationTime: new Date(),
        reason: 'Transito senza prenotazione valida',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        price: 150,
        licensePlate: 'AB124CD',
        parkingId: parkingId,
        violationTime: new Date(),
        reason: 'Transito con prenotazione scaduta',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Fines', null, {});
    await queryInterface.bulkDelete('Reservations', null, {});
    await queryInterface.bulkDelete('ParkingCapacities', null, {});
    await queryInterface.bulkDelete('Parkings', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
