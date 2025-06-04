import { NextFunction, Request, Response } from "express";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes"; 
import { ReservationService } from "../services/reservationService";
import { ErrorFactory } from "../factories/errorFactory";
import { parseDateString } from "../helpers/dateParser";
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';



export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, parkingId, licensePlate, vehicle, status = Status.PENDING } = req.body;
      const reservation = await this.reservationService.createReservation( userId, parkingId, licensePlate, vehicle, status);
      res.status(StatusCodes.CREATED).json(reservation);
    } catch (error) {
      next(error)
    }
  }

  listByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
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

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reservations = await this.reservationService.findAllReservations();
      res.status(StatusCodes.OK).json(reservations);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: Request, res: Response) => {   
    const deleted = await this.reservationService.deleteReservation(req.params.id);

    if (deleted > 0) {
    res.status(StatusCodes.OK).json({ message: `Reservation with ID ${req.params.id} deleted.` });
  } else {
    throw ErrorFactory.entityNotFound("Reservation");
    }

  }

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.id;
    const status  = req.body;

    try {
      const updatedReservation = await this.reservationService.updateReservation(reservationId, status);
      
      if (updatedReservation) {
        res.status(StatusCodes.OK).json({status: Status.CANCELED,reservation:updatedReservation});
      } else {
        throw ErrorFactory.entityNotFound("Reservation");
      }
    } catch (error) {
      next(error);
    }
  }

    postReservationsReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plates: platesRaw, start: startRaw, end: endRaw, format: fmtRaw } = req.body;

      if (!Array.isArray(platesRaw) || platesRaw.length === 0) {
        throw ErrorFactory.badRequest('Il campo “plates” è obbligatorio e deve essere un array di stringhe.');
      }
      // controlliamo che ogni elemento di platesRaw sia stringa non vuota
      const plates = platesRaw
        .map((p: any) => (typeof p === 'string' ? p.trim().toUpperCase() : ''))
        .filter((p: string) => p.length > 0);
      if (plates.length === 0) {
        throw ErrorFactory.badRequest('Almeno una targa valida nel campo “plates”.');
      }

      // 2) Parsare date
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
        plates,
        startTime,
        endTime,
      );

      // 6) Restituisco JSON oppure genero PDF
      if (format === 'json') {
        res.json({ reservations });
      } 

      // --- FORMATO PDF ---
     
      const pdfDir = path.resolve(__dirname, '../../pdf');

      const filename = `report_${Date.now()}.pdf`;
      const filePath = path.join(pdfDir, filename);

      // c) Imposto header per il download del PDF al client
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // d) Creo il documento PDF
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
      const usableWidth = pageWidth - leftMargin - rightMargin;

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
        doc.text(`Targhe: ${plates.join(', ')}`, { align: 'left' });
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

        // Salto di riga fisso
        currentY += rowHeight;
      });

      // j) Chiudo il documento
      doc.end();

      }catch (error) {
        next(error);  
    }
  }
    
}