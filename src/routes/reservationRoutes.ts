import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { ReservationService } from "../services/reservationService";
import { ReservationDAO } from "../dao/reservationDAO";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AuthService } from "../services/authService";
import { UserDAO } from "../dao/userDAO";
import { PaymentService } from "../services/paymentService";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { PaymentController } from "../controllers/paymentController";
import { ParkingDao} from "../dao/ParkingDao";


const router = Router();

const parkingCapacityDAO = new ParkingCapacityDao();
const parkingDAO = new ParkingDao(); 
const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO,parkingDAO);
const reservationController = new ReservationController(reservationService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const paymentService = new PaymentService(reservationDAO,userDAO,parkingCapacityDAO);
const paymentController = new PaymentController(paymentService);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.isUser);

router.post("/reservation", reservationController.create);
router.get("/reservations", reservationController.list);
router.get("/reservation/:id", reservationController.listById);
router.get("/reservations/user/:userId", reservationController.listByUser);
router.delete("/reservation/:id", reservationController.delete);
router.post("/reservation/update/:id", reservationController.updateStatus);

router.post('/pay',paymentController.pay);

export default router;
