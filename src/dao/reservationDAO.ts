import { Reservation } from '../models/reservation';
import { ReservationCreationAttributes } from '../models/reservation'; 
import { Op,fn,col,where as seqWhere } from 'sequelize';
import { Vehicles } from '../utils/Vehicles';
import { Status } from '../utils/Status';
import { start } from 'repl';


interface ReservationDAOInterface {
    create(data: Reservation): Promise<Reservation>;
    update(id: string, updates:Partial<Reservation>): Promise<Reservation | null>;
    findAllByUser(userId:string): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation | null>;
    delete(id: string): Promise<number>;
    findAll(): Promise<Reservation[]>;
    report(userId: string,parkingId?: string, startTime?: Date, endTime?: Date): Promise<Reservation[]>;
}

export class ReservationDAO implements ReservationDAOInterface {
    async create(reservation: ReservationCreationAttributes): Promise<Reservation> {
        return await Reservation.create(reservation);
    }

    async update(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
        const reservation = await Reservation.findByPk(id);
        if (reservation === null ) {
            throw new Error(`Reservation with id ${id} not found`);
        }
        return await reservation.update(updates);
    }

    async findAllByUser(userId:string): Promise<Reservation[]> {
        return await Reservation.findAll({where: { userId }});
    }

    async findById(id: string): Promise<Reservation | null> {
        return await Reservation.findByPk(id);
    }

    async delete(id: string): Promise<number> {
       return await Reservation.destroy({ where: { id } });
    }

    async findAll(): Promise<Reservation[]> {
        return await Reservation.findAll();
    }

    async findByPlate(licensePlate: string): Promise<Reservation | null> {
        return await Reservation.findOne({ where: { licensePlate } });
    }

    async countOverlapping(
    parkingId: string,
    vehicle: Vehicles,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    return Reservation.count({
      where: {
        parkingId,
        vehicle,
        status: { [Op.in]: [Status.PENDING, Status.CONFIRMED] },
        // condizione di “overlap”:
        // NON (prenotazione endTime < nostro startTime
        //    OR prenotazione startTime > nostro endTime)
        [Op.not]: [
          { endTime: { [Op.lt]: startTime } },
          { startTime: { [Op.gt]: endTime } },
        ],
      },
    });
  }

  async findByPlatesAndPeriod( plates: string[], startTime: Date, endTime: Date, parkingIds?: string[]): Promise<Reservation[]> {

    const whereClause: any = {
    licensePlate: { [Op.in]: plates },
    status:       { [Op.in]: [Status.PENDING, Status.CONFIRMED] },
    // Confrontiamo solo la parte “data” di startTime e endTime, 
    // escludendo l’orario:
    [Op.and]: [
      // DATE("startTime") >= 'YYYY-MM-DD'
      seqWhere(fn("DATE", col("startTime")), { [Op.gte]: startTime }),
      // DATE("endTime")   <= 'YYYY-MM-DD'
      seqWhere(fn("DATE", col("endTime")),   { [Op.lte]: endTime   }),
    ],
  };

  if (parkingIds && parkingIds.length > 0) {
    whereClause.parkingId = { [Op.in]: parkingIds };
  }

  return Reservation.findAll({
    where: whereClause,
    order: [["startTime", "ASC"]],
  });
  }

  async findAllByParkingAndPeriod(parkingId: string, startTimeMin?: Date, endTimeMax?: Date): Promise<Reservation[]> {

    const whereClause: any = {
    parkingId,
    status: { [Op.in]: [Status.PENDING, Status.CONFIRMED, Status.REJECTED] }
  };

  if (startTimeMin) {
    whereClause.startTime = { [Op.gte]: startTimeMin };
  }
  if (endTimeMax) {
    whereClause.endTime = { [Op.lte]: endTimeMax };
  }

  return Reservation.findAll({
    where: whereClause,
    order: [['startTime', 'ASC']],
  });
  }

  async report( userId: string,parkingId?: string, startTime?: Date, endTime?: Date): Promise<Reservation[]> {
    const whereClause: any = {};

    whereClause.userId = userId;

    if (parkingId) {
      whereClause.parkingId = parkingId;
    }
    if (startTime) {
      whereClause.startTime = { [Op.gte]: startTime };
    }
    if (endTime) {
      whereClause.endTime = { [Op.lte]: endTime };
    }
    return await Reservation.findAll({ where: whereClause });
  }
}
