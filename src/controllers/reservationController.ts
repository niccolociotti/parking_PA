import { NextFunction, Request, Response } from "express";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes"; 
import { ReservationService } from "../services/reservationService";
import { ErrorFactory } from "../factories/errorFactory";
import { parseDateString } from "../helpers/dateParser";
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { Parser as CsvParser } from 'json2csv';
import { mkdir, writeFile } from 'fs/promises'; 




export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  /**
   * Crea una nuova prenotazione per un utente.
   * Questa funzione riceve i dati della prenotazione dal body della richiesta, imposta lo stato in base alla disponibilità
   * (pending o rejected), e chiama il ReservationService per creare la prenotazione. Se la capacità è esaurita, restituisce errore.
   * Viene utilizzata nella rotta POST /reservation.
   * @param req - Richiesta HTTP contenente userId, parkingId, licensePlate, vehicle
   * @param res - Risposta HTTP con la prenotazione creata o errore
   * @param next - Funzione per la gestione degli errori
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const userId = (req as any).user.id as string;
      const { parkingId, licensePlate, vehicle} = req.body;

      const capacityRejected = res.locals.capacityRejected;

      const finalStatus = capacityRejected ? Status.REJECTED : Status.PENDING;

      const reservation = await this.reservationService.createReservation( userId, parkingId, licensePlate, vehicle,finalStatus);
      if(!res.locals.capacityRejected){
        res.status(StatusCodes.CREATED).json({Prenotazione:reservation});
      }else{
        throw ErrorFactory.customMessage("Prenotazione rifiutata per mancanza di posti disponibili.", StatusCodes.BAD_REQUEST);
          
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Restituisce tutte le prenotazioni di un utente specifico.
   * Recupera l'userId dai parametri della richiesta e usa il ReservationService per ottenere tutte le prenotazioni associate.
   * Se non ci sono prenotazioni, restituisce errore. Usata nella rotta GET /reservations/user/:userId.
   * @param req - Richiesta HTTP con userId nei parametri
   * @param res - Risposta HTTP con l'elenco delle prenotazioni
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con l'elenco delle prenotazioni dell'utente o un errore se non trovate
   */
  listByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id as string;
    try {
      const reservations = await this.reservationService.findReservationsByUserId(userId);
      if (reservations.length > 0) {
        res.status(StatusCodes.OK).json(reservations);
      } else {
        throw ErrorFactory.entityNotFound("Reservations");
      }
    } catch (error) {
      next(error)
    }
  }


  /**
   * Restituisce i dettagli di una prenotazione tramite il suo ID.
   * Prende l'id della prenotazione dai parametri della richiesta e usa il ReservationService per recuperare i dettagli.
   * Se la prenotazione non esiste, restituisce errore. Usata nella rotta GET /reservation/:id.
   * @param req - Richiesta HTTP con id nei parametri
   * @param res - Risposta HTTP con i dettagli della prenotazione
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con i dettagli della prenotazione o un errore se non trovata
   */
  listById = async (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.id;
    try {
      const reservation = await this.reservationService.findReservationById(reservationId);
      if (reservation) {
        res.status(StatusCodes.OK).json(reservation);
      } else {
        throw ErrorFactory.entityNotFound("Reservations");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restituisce tutte le prenotazioni presenti nel sistema.
   * Chiama il ReservationService per ottenere tutte le prenotazioni senza filtri.
   * Usata nella rotta GET /reservations.
   * @param req - Richiesta HTTP
   * @param res - Risposta HTTP con tutte le prenotazioni
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con tutte le prenotazioni o un errore se non trovate
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reservations = await this.reservationService.findAllReservations();
      res.status(StatusCodes.OK).json(reservations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina una prenotazione tramite il suo ID.
   * Prende l'id della prenotazione dai parametri della richiesta e chiama il ReservationService per eliminarla.
   * Se la prenotazione viene eliminata restituisce conferma, altrimenti errore. Usata nella rotta DELETE /reservation/:id.
   * @param req - Richiesta HTTP con id nei parametri
   * @param res - Risposta HTTP di conferma eliminazione
   * @returns Restituisce una risposta HTTP di conferma eliminazione o un errore se la prenotazione non esiste
   */
  delete = async (req: Request, res: Response) => {   
    const deleted = await this.reservationService.deleteReservation(req.params.id);

    if (deleted > 0) {
    res.status(StatusCodes.OK).json({ message: `Reservation with ID ${req.params.id} deleted.` });
  } else {
    throw ErrorFactory.entityNotFound("Reservation");
    }

  }

  /**
   * Aggiorna una prenotazione esistente.
   * Riceve l'id della prenotazione dai parametri e i nuovi dati dal body, poi chiama il ReservationService per aggiornare.
   * Se nessun campo è fornito, restituisce errore. Usata nella rotta POST /reservation/update/:id.
   * @param req - Richiesta HTTP con id nei parametri e dati aggiornati nel body
   * @param res - Risposta HTTP con la prenotazione aggiornata
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con la prenotazione aggiornata o un errore se non trovata
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.id;
    const userId = (req as any).user.id as string;

    const {parkingId, licensePlate, vehicle, startTime, endTime} = req.body;

    const updates = {
      userId,
      parkingId,
      licensePlate,
      vehicle,
      startTime,
      endTime
    };

    const allUndefined = Object.values(updates).every(val => val === undefined);
    if (allUndefined) {
      throw ErrorFactory.badRequest("Nessun campo da aggiornare.");
}

    try {
      const updatedReservation = await this.reservationService.updateReservation(reservationId, updates);

      if (updatedReservation) {
        res.status(StatusCodes.OK).json({Prenotazione:updatedReservation});
      } else {
        throw ErrorFactory.entityNotFound("Reservation");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Genera un report delle prenotazioni filtrate per targhe e periodo, in formato JSON o PDF.
   * Riceve dal body le targhe, le date e il formato desiderato. Chiama il ReservationService per ottenere i dati,
   * poi restituisce il report nel formato richiesto. Usata nella rotta POST /reservationsReport.
   * @param req - Richiesta HTTP con plates, start, end, format nel body
   * @param res - Risposta HTTP con il report in formato richiesto
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con il report delle prenotazioni in formato JSON o PDF
   */
  postReservationsReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { licensePlates: licensePlatesRaw, start: startRaw, end: endRaw, format: fmtRaw } = req.body;

      if (!Array.isArray(licensePlatesRaw) || licensePlatesRaw.length === 0) {
        throw ErrorFactory.badRequest('Il campo “plates” è obbligatorio e deve essere un array di stringhe.');
      }
      // controllo che ogni elemento di platesRaw sia stringa non vuota
      const licensePlates = licensePlatesRaw
        .map((p: any) => (typeof p === 'string' ? p.trim().toUpperCase() : ''))
        .filter((p: string) => p.length > 0);
      if (licensePlates.length === 0) {
        throw ErrorFactory.badRequest('Almeno una targa valida nel campo “plates”.');
      }

      // Parsare date
      const startTime = parseDateString(startRaw);
      const endTime   = parseDateString(endRaw);
      if (!startTime || !endTime) {
        throw ErrorFactory.badRequest('Formati di data non validi. Usa “DD-MM-YYYY” o ISO.');
      }
      if (startTime.getTime() > endTime.getTime()) {
        throw ErrorFactory.badRequest('La data “start” deve essere precedente o uguale a “end”.');
      }

      const format = (typeof fmtRaw === 'string' && fmtRaw.toLowerCase() === 'pdf') ? 'pdf' : 'json';

      const reservations = await this.reservationService.getReservationsByPlatesPeriod(
        licensePlates,
        startTime,
        endTime,
      );

      // Restituisco JSON oppure genero PDF
      if (format === 'json') {
        res.json({ reservations });
      } 

      // --- FORMATO PDF ---
     
      const pdfDir = path.resolve(__dirname, '../../pdf');

      const filename = `report_${Date.now()}.pdf`;
      const filePath = path.join(pdfDir, filename);

      // Imposto header per il download del PDF al client
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Creo il documento PDF
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        layout: 'landscape',
        autoFirstPage: false,
      });

      // Collegamento al response e allo stream su file
      doc.pipe(res);
      const fileStream = fs.createWriteStream(filePath);
      doc.pipe(fileStream);

      // Aggiungo la prima pagina
      doc.addPage();
      const pageWidth = doc.page.width;
      const leftMargin = doc.page.margins.left;
      const rightMargin = doc.page.margins.right;

      // Definisco posizioni X fisse per le colonne
      const colX = {
        id: leftMargin,
        parking: leftMargin + 130,
        plate: leftMargin + 260,
        vehicle: leftMargin + 345,
        start: leftMargin + 420,
        end: leftMargin + 505,
        status: leftMargin + 590,
      };
      // Altezza fissa riga
      const rowHeight = 20;

      // Funzione per disegnare l’intestazione di pagina (header + colonne)
      const drawHeader = () => {
        doc.font('Helvetica-Bold').fontSize(18).text('Report Prenotazioni', { align: 'center' });
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(12).fillColor('gray');
        doc.text(`Periodo: dal ${startTime.toLocaleDateString('it-IT')} al ${endTime.toLocaleDateString('it-IT')}`, {
          align: 'left',
        });
        doc.moveDown(0.2);
        doc.text(`Targhe: ${licensePlates.join(', ')}`, { align: 'left' });
        doc.moveDown(0.2);
        
        doc.moveDown(0.6);

        const headerY = doc.y;
        // Riga di intestazione colonna
        doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
        doc.text('ID Prenot.',   colX.id,       headerY);
        doc.text('Parking ID',   colX.parking,  headerY);
        doc.text('Targa',        colX.plate,    headerY);
        doc.text('Veicolo',      colX.vehicle,  headerY);
        doc.text('Inizio',       colX.start,    headerY);
        doc.text('Fine',         colX.end,      headerY);
        doc.text('Stato',        colX.status,   headerY);
        doc.moveDown(0.3);

        // Riga orizzontale sotto l’intestazione
        const yLine = doc.y;
        doc.strokeColor('#AAAAAA').lineWidth(0.5)
           .moveTo(leftMargin, yLine)
           .lineTo(pageWidth - rightMargin, yLine)
           .stroke();
        doc.moveDown(0.5);
      };

      // Disegno l’intestazione sulla prima pagina
      drawHeader();

      // e) Righe dati
      doc.font('Helvetica').fontSize(8).fillColor('black');
      let currentY = doc.y;

      reservations.forEach((r, index) => {
        // Se supero il margine inferiore, aggiungo nuova pagina e re-disegno header
        if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          drawHeader();
          currentY = doc.y;
        }

        const startStr = new Date(r.startTime).toLocaleString('it-IT', { hour12: false });
        const endStr   = new Date(r.endTime).toLocaleString('it-IT',   { hour12: false });

        // Disegno ogni campo esattamente a X fisso
        doc.text(r.id,           colX.id,     currentY, { width: 120, height: rowHeight });
        doc.text(r.parkingId,    colX.parking, currentY, { width: 120, height: rowHeight });
        doc.text(r.licensePlate, colX.plate,   currentY, { width: 80,  height: rowHeight });
        doc.text(r.vehicle,      colX.vehicle, currentY, { width: 80,  height: rowHeight });
        doc.text(startStr,       colX.start,   currentY, { width: 80,  height: rowHeight });
        doc.text(endStr,         colX.end,     currentY, { width: 80,  height: rowHeight });
        doc.text(r.status ?? '', colX.status,  currentY, { width: 100, height: rowHeight });

        currentY += rowHeight;
      });
      doc.end();

      }catch (error) {
        next(error);  
    }
  }

  /**
   * Genera un report delle prenotazioni di un utente, opzionalmente filtrato per parcheggio e periodo, in formato JSON, CSV o PDF.
   * Riceve l'userId e il formato dai parametri, e le date/parkingId dalla query. Chiama il ReservationService per ottenere i dati,
   * poi restituisce il report nel formato richiesto. Usata nella rotta GET /reservationsReport/:id/:format.
   * @param req - Richiesta HTTP con id e format nei parametri, start/end/parkingId nella query
   * @param res - Risposta HTTP con il report in formato richiesto
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con il report delle prenotazioni in formato JSON, CSV o PDF
   */
  reportReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw ErrorFactory.badRequest('ID utente mancante.');
      }

      const format = req.params.format;
      if (!['json', 'csv', 'pdf'].includes(format)) {
        throw ErrorFactory.badRequest('Formato non valido. Usa “json”, “csv” o “pdf”.');
      }
      let { start: startRaw, end: endRaw, parkingId: parkingIdRaw } = req.query as { start?: string; end?: string; parkingId?: string};

      let startTime: Date | undefined = undefined;
      let endTime: Date | undefined = undefined;
      let parkingId: string | undefined = undefined;

      if (startRaw) {
        const startTimeParsed = parseDateString(startRaw);
        if (!startTimeParsed) {
          throw ErrorFactory.badRequest('Formato di data non valido');
        }
        startTime = startTimeParsed;
      }

      if (endRaw) {
        const endTimeParsed = parseDateString(endRaw);
        if (!endTimeParsed) {
          throw ErrorFactory.badRequest('Formato di data non valido');
        }
        endTime = endTimeParsed;
      }

      if (parkingIdRaw) {
        parkingId = parkingIdRaw.toString().trim();
      }

      if (startTime && endTime && startTime.getTime() > endTime.getTime()) {
        throw ErrorFactory.badRequest('La data “start” deve essere precedente o uguale a “end”.');
      }
      const reservations = await this.reservationService.getReservationsReport(userId,parkingId, startTime, endTime);  
      if (format === 'json'){
        if(reservations.length > 0) {
        res.status(StatusCodes.OK).json(reservations);
      } else {
        throw ErrorFactory.entityNotFound("Reservations");
      }
    }

    if (format === 'csv') {
      const csv = new CsvParser().parse(reservations);
      const filename = `reservations-${userId}.csv`;
      const filePath = path.join(__dirname, '../../csv', filename);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, csv);
      return res.download(filePath);
    }

    if (format === 'pdf') {
      const pdfDoc = new PDFDocument();
      const filename = `reservations-${userId}.pdf`;
      const filePath = path.join(__dirname, '../../pdf', filename);
      await mkdir(path.dirname(filePath), { recursive: true });
      const writeStream = fs.createWriteStream(filePath);
      pdfDoc.pipe(writeStream);

      pdfDoc.fontSize(20).text('Report Prenotazioni', { align: 'center' });
      pdfDoc.moveDown();

      // Aggiungo le intestazioni
      pdfDoc.fontSize(12).text('ID Prenotazione | Parking ID | Targa | Veicolo | Inizio | Fine | Stato');
      pdfDoc.moveDown();

      // Aggiungo i dati delle prenotazioni
      reservations.forEach(reservation => {
        const startStr = new Date(reservation.startTime).toLocaleString('it-IT', { hour12: false });
        const endStr = new Date(reservation.endTime).toLocaleString('it-IT', { hour12: false });
        pdfDoc.text(`${reservation.id} | ${reservation.parkingId} | ${reservation.licensePlate} | ${reservation.vehicle} | ${startStr} | ${endStr} | ${reservation.status}`);
      });

      pdfDoc.end();
      writeStream.on('finish', () => {
        res.download(filePath, filename);
      });
    }
    } catch (error) {
      next(error);
    }
  }
    
}