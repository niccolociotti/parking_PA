import { randomUUID } from "crypto";
import { Parking } from "../models/parking";
import { ParkingDao } from "../dao/ParkingDao";
import { ErrorFactory } from "../factories/errorFactory";
import { ReservationDAO } from "../dao/reservationDAO";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { PaymentService } from "./paymentService";
import { Status } from "../utils/Status";
import { eachHourOfInterval, endOfHour, subHours } from "date-fns";
import { timeStamp } from "console";

type DayOfWeek = 'Lun' | 'Mar' | 'Mer' | 'Gio' | 'Ven' | 'Sab' | 'Dom';

/** ParkingService gestisce le operazioni sui parcheggi.
 * @class ParkingService
 * @description Fornisce metodi per creare, eliminare, aggiornare e recuperare parcheggi,
 * calcolare statistiche sui parcheggi e gestire le prenotazioni.
 * @param parkingDao - Istanza di ParkingDao per interagire con il database dei parcheggi 
 * @param reservationDAO - Istanza di ReservationDAO per interagire con il database delle prenotazioni
 * @param parkingCapacityDAO - (opzionale) Istanza di ParkingCapacityDao per interagire con il database delle capacità dei parcheggi
 * */

export class ParkingService {  
  constructor(private parkingDao: ParkingDao, private reservationDAO: ReservationDAO, private parkingCapacityDAO?: ParkingCapacityDao) {}
  /**
   * Trova tutti i parcheggi
   * @returns Lista di parcheggi
   */

  async findAll(): Promise<Parking[]> {
    return this.parkingDao.findAll();
  } 

  /**
   * Crea un nuovo parcheggio
   * @param name - Nome del parcheggio
   * @param address - Indirizzo del parcheggio
   * @param capacity - Capacità del parcheggio
   * @param closedData - Date in cui il parcheggio è chiuso
   * @returns Il parcheggio creato
   */
  
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

  /**
   * Elimina un parcheggio per ID
   * @param id - ID del parcheggio da eliminare
   * @returns Numero di parcheggi eliminati (0 o 1)
   */

  async delete(id: string): Promise<number> {
    const deleted= await this.parkingDao.delete(id);
    if (deleted === 0) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return deleted;
  }

  /**
   * Trova un parcheggio per ID
   * @param id - ID del parcheggio da trovare
   * @returns Il parcheggio trovato o null se non esiste
   */

  async findById(id: string): Promise<Parking | null> {
    return this.parkingDao.findById(id);
  }

  /**
   * Aggiorna un parcheggio per ID
   * @param id - ID del parcheggio da aggiornare
   * @param updates - Oggetto con i campi da aggiornare
   * @returns Il parcheggio aggiornato o null se non esiste
   */

  async update(id: string, updates: Partial<Parking>): Promise<Parking | null> {
    const parkings = await this.parkingDao.update(id, updates);
    if (!parkings) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return parkings
  }

  /**
   * Calcola le statistiche di un parcheggio
   * @param parkingId - ID del parcheggio
   * @param startTime - Data di inizio per il calcolo delle statistiche (opzionale)
   * @param endTime - Data di fine per il calcolo delle statistiche (opzionale)
   * @returns Oggetto con le statistiche del parcheggio
   */

  async getParkingStatistics(parkingId: string, startTime?: Date, endTime?: Date): Promise<any> {
    const parking = await this.parkingDao.findById(parkingId);
    if (!parking) {
      throw ErrorFactory.entityNotFound('Parking');
    }

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

    const cappedEnd = subHours(latest, 1); 

    const hours = eachHourOfInterval({
      start: earliest,
      end: cappedEnd
    });  
    const occupationPoints = hours.map(hourStart => {
      
    const hourEnd = endOfHour(hourStart);
    const occupied = allReservations.filter(r =>
      [Status.PENDING, Status.CONFIRMED].includes(r.status as Status) &&
      r.startTime < hourEnd &&
      r.endTime > hourStart
    ).length;

    return { timestamp: hourStart, occupied }
  })    
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
    for (const point of occupationPoints) {
  if (point.occupied === 0) {
    console.log(`Slot alle ${point.timestamp}: occupazione = ${point.occupied}`);
  }
}
    const contemporaryMaxOccupancy = Math.max(...allOccValues);
    const contemporaryMinOccupancy = Math.min(...allOccValues);

    
    // 7) Fatturato totale (solo status CONFIRMED o COMPLETED)

    let revenue = 0;
    allReservations.filter(r => r.status && [Status.CONFIRMED].includes(r.status as Status))
      .forEach(r => {
        // Estrai il tipo di veicolo dalla prenotazione
        const veh = r.vehicle;
        // Prendi la tariffa al minuto corrispondente
        const pricePerMin = priceByVehicle[veh];      
        // Calcola il prezzo totale della singola prenotazione passando prezzo al minuto, startTime e endTime
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
