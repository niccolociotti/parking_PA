import { User } from './User';
import { Parking } from './parking';
import { ParkingCapacity } from './parkingCapacity';
import { Reservation } from './reservation';

// 1 Parking ha molte ParkingCapacity (1:N)
Parking.hasMany(ParkingCapacity, { foreignKey: 'parkingId' });
ParkingCapacity.belongsTo(Parking, { foreignKey: 'parkingId' });

// 1 User ha molte Reservation (1:N)
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

// 1 ParkingCapacity ha molte Reservation (1:N)
ParkingCapacity.hasMany(Reservation, { foreignKey: 'parkingCapacityId' });
Reservation.belongsTo(ParkingCapacity, { foreignKey: 'parkingCapacityId' });

