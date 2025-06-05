import { randomUUID } from "crypto";
import { Parking } from "../models/parking";
import { ParkingDao } from "../dao/ParkingDao";
import { ErrorFactory } from "../factories/errorFactory";
import { ReservationDAO } from "../dao/reservationDAO";
import { StatsResult } from "../models/statsResults";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { PaymentService } from "./paymentService";
import { Status } from "../utils/Status";
import { DayOfWeek } from "../models/statsResults";

export class ParkingService {  
  constructor(private parkingDao: ParkingDao, private reservationDAO: ReservationDAO, private parkingCapacityDAO?: ParkingCapacityDao) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingDao.findAll();
  } 

  async create(name: string, address: string, capacity:number, closedData: Date[]): Promise<Parking> {
  if (!name || !address || !closedData) {
    throw ErrorFactory.entityNotFound("Parking");
  }

  const parkingData= {
    id: randomUUID(),
    name,
    address,
    capacity,
    closedData,
  } 
  return this.parkingDao.create(parkingData);
  }

  async delete(id: string): Promise<number> {
    const deleted= await this.parkingDao.delete(id);
    if (deleted === 0) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return deleted;
  }

  async findById(id: string): Promise<Parking | null> {
    return this.parkingDao.findById(id);
  }

  async update(id: string, updates: Partial<Parking>): Promise<Parking | null> {
    const parkings = await this.parkingDao.update(id, updates);
    if (!parkings) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return parkings
  }

  async getParkingStatistics(parkingId: string, startTime?: Date, endTime?: Date): Promise<any> {
    const parking = await this.parkingDao.findById(parkingId);
    if (!parking) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    const maxCapacity = parking.capacity;

    const parkingCapacity = await this.parkingCapacityDAO?.findByParkingsById(parkingId);
    if (!parkingCapacity || parkingCapacity.length === 0) {
      throw ErrorFactory.entityNotFound('Parking');
    }

    const priceByVehicle: Record<string, number> = {};
    parkingCapacity.forEach(park => {
      // cap.vehicle es. "auto", cap.price (o cap.pricePerMinute) es. 2.5
      priceByVehicle[park.vehicle] = park.price;
    });
    const allReservations = await this.reservationDAO.findAllByParkingAndPeriod(
      parkingId,
      startTime,
      endTime
    );

    if (allReservations.length === 0) {
      return {
        averageOccupancy: {
          'Lun': {}, 'Mar': {}, 'Mer': {}, 'Gio': {}, 'Ven': {}, 'Sab': {}, 'Dom': {}
        },
        maxOccupancy: 0,
        minOccupancy: 0,
        revenue: 0,
        rejectedCount: 0,
        mostRequestedSlot: '',
      };
    }

    // 3) Calcolo earliest e latest per definire “hour bins”
    const earliest = startTime ? new Date(startTime) : new Date(Math.min(...allReservations.map(r => r.startTime.getTime())));
    const latest = endTime ? new Date(endTime) : new Date(Math.max(...allReservations.map(r => r.endTime.getTime())));

    earliest.setMinutes(0, 0, 0);
    latest.setMinutes(0, 0, 0);

    const hourBins: Date[] = [];
    let cursor = new Date(earliest);
    while (cursor.getTime() <= latest.getTime()) {
      hourBins.push(new Date(cursor));
      cursor.setHours(cursor.getHours() + 1);
    }

    // 4) Rilevo occupazione in ciascun bin orario
    interface OccupationPoint {
      timestamp: Date;
      occupied: number;
    }
    const occupationPoints: OccupationPoint[] = [];

    hourBins.forEach(hourStart => {
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);

      const countHere = allReservations.filter(r => {
        // Solo prenotazioni “active” per occupazione
        if (!r.status || ![Status.PENDING, Status.CONFIRMED].includes(r.status as Status)) return false;
        // Verifica overlap con [hourStart, hourEnd)
        return !(r.endTime <= hourStart || r.startTime >= hourEnd);
      }).length;

      occupationPoints.push({ timestamp: hourStart, occupied: countHere });
    });

    const daysMap: DayOfWeek[] = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    // 5) Raggruppo per giorno della settimana e fascia oraria
    const groupByDayHour: Record<DayOfWeek, Record<string, number[]>> = {
      'Lun': {}, 'Mar': {}, 'Mer': {}, 'Gio': {}, 'Ven': {}, 'Sab': {}, 'Dom': {}
    };

    occupationPoints.forEach(({ timestamp, occupied }) => {
  // 1) Ottengo l’indice numerico del giorno (0 = Dom, 1 = Lun, …, 6 = Sab)
  const dowIndex = timestamp.getDay(); 
  
  // 2) Converto in "Lun", "Mar", …, "Dom"
  const dow: DayOfWeek = daysMap[dowIndex];

  // 3) Creo la stringa per la fascia oraria, es. "08:00-09:00"
  const hh = timestamp.getHours(); 
  const slot = `${hh.toString().padStart(2, '0')}:00-${(hh + 1).toString().padStart(2, '0')}:00`;

  // 4) Se non esiste ancora, inizializzo l’array
  if (!groupByDayHour[dow][slot]) {
    groupByDayHour[dow][slot] = [];
  }

  // 5) Aggiungo il valore di occupazione
  groupByDayHour[dow][slot].push(occupied);
});
    const averageOccupancy: Record<DayOfWeek, Record<string, number>> = {
      'Lun': {}, 'Mar': {}, 'Mer': {}, 'Gio': {}, 'Ven': {}, 'Sab': {}, 'Dom': {}
    };
    Object.entries(groupByDayHour).forEach(([dow, slotMap]) => {
      (Object.entries(slotMap) as [string, number[]][]).forEach(([slot, arr]) => {
        const sum = arr.reduce((a, b) => a + b, 0);
        averageOccupancy[dow as DayOfWeek][slot] = parseFloat((sum / arr.length).toFixed(2));
      });
    });

    // 6) Occupazione max e min
    const allOccValues = occupationPoints.map(p => p.occupied);
    const contemporaryMaxOccupancy = Math.max(...allOccValues);
    const contemporaryMinOccupancy = Math.min(...allOccValues);

    
    // 7) Fatturato totale (solo status CONFIRMED o COMPLETED)

    const price: Record<string, number> = {};
    parkingCapacity.forEach(cap => {
      // cap.vehicle es. "auto", cap.price es. 2.5
      price[cap.vehicle] = cap.price;
  });

    let revenue = 0;

    console.log(price);

    allReservations.filter(r => r.status && [Status.CONFIRMED].includes(r.status as Status))
      .forEach(r => {
        // 4.a) Estrai il tipo di veicolo dalla prenotazione
        const veh = r.vehicle;
        // 4.b) Prendi la tariffa al minuto corrispondente
        const pricePerMin = price[veh];      
        // 4.d) Calcola il prezzo totale della singola prenotazione passando prezzo al minuto, startTime e endTime
        revenue += PaymentService.calculatePrice(pricePerMin, r.startTime, r.endTime);
      });    
 
    // 8) Conteggio richieste rifiutate (status = REJECTED)
    const rejectedCount = allReservations.filter(r => r.status === Status.REJECTED).length;

    // 9) Fascia oraria più richiesta (conteggio sull’inizio prenotazione)
    const startSlotCount: Record<string, number> = {};
    allReservations.forEach(r => {
      if (r.status || [Status.PENDING, Status.CONFIRMED].includes(r.status as Status)) {
        const hh = r.startTime.getHours(); //(es 16)
        const slot = `${hh.toString().padStart(2, '0')}:00-${(hh + 1).toString().padStart(2, '0')}:00`; //slot= "16:00-17:00"
        startSlotCount[slot] = (startSlotCount[slot] || 0) + 1; //startSlotCount["16:00-17:00"]=1 -> startSlotCount = {"16:00-17:00": 1};
      }
    });
    let mostRequestedSlot = '';
    let bestCount = -1;
    Object.entries(startSlotCount).forEach(([slot, cnt]) => {
      if (cnt > bestCount) {
        bestCount = cnt;
        mostRequestedSlot = slot;
      }
    })

    return {
      averageOccupancy,
      contemporaryMaxOccupancy,
      contemporaryMinOccupancy,
      revenue,
      rejectedCount,
      mostRequestedSlot
    };
  }

}
