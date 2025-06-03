import { NextFunction, Request, Response } from "express";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes"; 
import { ReservationService } from "../services/reservationService";
import { ErrorFactory } from "../factories/errorFactory";


export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, parkingId, licensePlate, status = Status.PENDING } = req.body;
      const reservation = await this.reservationService.createReservation( userId, parkingId, licensePlate, status);
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
        res.status(StatusCodes.OK).json(updatedReservation);
      } else {
        throw ErrorFactory.entityNotFound("Reservation");
      }
    } catch (error) {
      next(error);
    }
  }
    
}