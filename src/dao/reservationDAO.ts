import { Reservation } from '../models/reservation';
import { ReservationCreationAttributes } from '../models/reservation'; 


interface ReservationDAOInterface {
    create(data: Reservation): Promise<Reservation>;
    update(id: string, updates:Partial<Reservation>): Promise<Reservation | null>;
    findAllByUser(userId:string): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation | null>;
    delete(id: string): Promise<number>;
    findAll(): Promise<Reservation[]>;
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
}
