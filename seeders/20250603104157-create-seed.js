'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // **1) Creazione di almeno 3 utenti**
    const userOperatorId = uuidv4();
    const userDriver1Id = uuidv4();
    const userDriver2Id = uuidv4();
    const userDriver3Id = uuidv4();

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: userOperatorId,
          name: 'Mario Rossi',
          email: 'mario.rossi@example.com',
          password: 'mario', 
          role: 'operatore',
          tokens: 30000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: userDriver3Id,
          name: 'Paolo Gialli',
          email: 'paolo.gialli@example.com',
          password: 'paolo', 
          role: 'automobilista',
          tokens: 45000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: userDriver1Id,
          name: 'Luigi Bianchi',
          email: 'luigi.bianchi@example.com',
          password: 'luigi', 
          role: 'automobilista',
          tokens: 50000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: userDriver2Id,
          name: 'Carla Verdi',
          email: 'carla.verdi@example.com',
          password: 'carla', 
          role: 'automobilista',
          tokens: 10000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // **2) Creazione di almeno 3 parcheggi**
    const parking1Id = uuidv4();
    const parking2Id = uuidv4();
    const parking3Id = uuidv4();

    await queryInterface.bulkInsert(
      'Parkings',
      [
        {
          id: parking1Id,
          name: 'Parcheggio Centrale',
          address: 'Via Roma 1, Milano',
          capacity: 45,
          closedData: Sequelize.literal(`ARRAY[
            '2025-12-31T00:00:00.000Z'::timestamptz,
            '2026-01-01T00:00:00.000Z'::timestamptz
          ]`),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: parking2Id,
          name: 'Parcheggio Nord',
          address: 'Via Torino 25, Milano',
          capacity: 30,
          closedData: Sequelize.literal(`ARRAY[
            '2025-07-04T00:00:00.000Z'::timestamptz,
            '2025-08-15T00:00:00.000Z'::timestamptz
          ]`),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: parking3Id,
          name: 'Parcheggio Sud',
          address: 'Piazza Duomo, Milano',
          capacity: 60,
          closedData: Sequelize.literal(`ARRAY[
            '2025-11-01T00:00:00.000Z'::timestamptz,
            '2025-12-25T00:00:00.000Z'::timestamptz
          ]`),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // **3) Creazione di diverse tipologie di parcheggi (ParkingCapacities)**
    //    - Parcheggio Centrale: auto e moto
    //    - Parcheggio Nord: auto e moto
    //    - Parcheggio Sud: auto, moto e camion
    await queryInterface.bulkInsert(
      'ParkingCapacities',
      [
        // Parcheggio Centrale
        {
          id: uuidv4(),
          parkingId: parking1Id,
          vehicle: 'auto',
          capacity: 30,
          price: 2.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          parkingId: parking1Id,
          vehicle: 'moto',
          capacity: 15,
          price: 1.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Parcheggio Nord
        {
          id: uuidv4(),
          parkingId: parking2Id,
          vehicle: 'auto',
          capacity: 20,
          price: 2.2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          parkingId: parking2Id,
          vehicle: 'camion',
          capacity: 10,
          price: 2.7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Parcheggio Sud
        {
          id: uuidv4(),
          parkingId: parking3Id,
          vehicle: 'auto',
          capacity: 40,
          price: 2.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          parkingId: parking3Id,
          vehicle: 'moto',
          capacity: 20,
          price: 1.2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          parkingId: parking3Id,
          vehicle: 'camion',
          capacity: 5,
          price: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // **4) Creazione di prenotazioni collegate a tutti gli utenti**
    //    - Luigi Bianchi (userDriver1Id) → Parcheggio Centrale (auto)
    //    - Carla Verdi    (userDriver2Id) → Parcheggio Nord    (moto)
    //    - Paolo Gialli    (userDriver3Id) → Parcheggio Sud    (camion)
    await queryInterface.bulkInsert(
      'Reservations',
      [
        // Luigi Bianchi
        {
          id: uuidv4(),
          status: 'In attesa di pagamento',
          userId: userDriver1Id,
          parkingId: parking1Id,
          licensePlate: 'AB124CD',
          vehicle: 'auto',
          startTime: new Date('2025-07-01T10:00:00Z'),
          endTime: new Date('2025-07-02T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          status: 'Prenotazione rifiutata',
          userId: userDriver1Id,
          parkingId: parking1Id,
          licensePlate: 'AB124CD',
          vehicle: 'auto',
          startTime: new Date('2025-07-04T10:00:00Z'),
          endTime: new Date('2025-07-06T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Carla Verdi
        {
          id: uuidv4(),
          status: 'In attesa di pagamento',
          userId: userDriver2Id,
          parkingId: parking2Id,
          licensePlate: 'XY987ZT',
          vehicle: 'moto',
          startTime: new Date('2025-06-01T08:00:00Z'),
          endTime: new Date('2025-06-01T18:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Paolo Gialli (operatore che fa una prenotazione camion)
        {
          id: uuidv4(),
          status: 'Prenotazione confermata',
          userId: userDriver3Id,
          parkingId: parking3Id,
          licensePlate: 'ZZ123YY',
          vehicle: 'camion',
          startTime: new Date('2025-08-15T06:00:00Z'),
          endTime: new Date('2025-08-15T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Reservations', null, {});
    await queryInterface.bulkDelete('ParkingCapacities', null, {});
    await queryInterface.bulkDelete('Parkings', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
