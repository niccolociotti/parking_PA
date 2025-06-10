import { ParkingMiddleware } from '../middleware/parkingMiddleware';
import { CustomError } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

describe('ParkingMiddleware – checkCapacity', () => {
  let mockCapDao: any;
  let mockResDao: any;
  let mockParkDao: any;
  let middleware: ParkingMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockCapDao = { findByParkingAndType: jest.fn() };
    mockResDao = { countOverlapping: jest.fn() };
    mockParkDao = {};
    middleware = new ParkingMiddleware(mockCapDao, mockResDao, mockParkDao);
    res = { locals: {} } as any;
    next = jest.fn();
  });

  function buildReq(body: any): Request {
    return { body } as Request;
  }

  it('genera BadRequest se manca parkingId o vehicle', async () => {
    req = buildReq({ vehicle: 'auto' });
    await middleware.checkCapacity(req as any, res as Response, next);
    expect((next as jest.Mock).mock.calls[0][0]).toBeInstanceOf(CustomError);
    expect((next as jest.Mock).mock.calls[0][0].statusCode)
      .toBe(StatusCodes.BAD_REQUEST);
  });

  it('genera NotFound se non esiste il record di capacità', async () => {
    req = buildReq({
      parkingId: 'pid',
      vehicle: 'auto',
      startTime: '2025-06-10T10:00:00Z',
      endTime: '2025-06-10T11:00:00Z'
    });
    mockCapDao.findByParkingAndType.mockResolvedValue(null);
    await middleware.checkCapacity(req as any, res as Response, next);
    expect((next as jest.Mock).mock.calls[0][0]).toBeInstanceOf(CustomError);
    expect((next as jest.Mock).mock.calls[0][0].statusCode)
      .toBe(StatusCodes.NOT_FOUND);
  });

  it('se posti esauriti imposta res.locals.capacityRejected e chiama next()', async () => {
    req = buildReq({
      parkingId: 'pid',
      vehicle: 'motorcycle',
      startTime: '2025-06-10T10:00:00Z',
      endTime: '2025-06-10T11:00:00Z'
    });
    mockCapDao.findByParkingAndType.mockResolvedValue({ capacity: 2 });
    mockResDao.countOverlapping.mockResolvedValue(2);
    await middleware.checkCapacity(req as any, res as Response, next);
    expect(res.locals?.capacityRejected).toBe(true);
    expect(next).toHaveBeenCalledWith();
  });

  it('se posti disponibili non imposta capacityRejected e chiama next()', async () => {
    req = buildReq({
      parkingId: 'pid',
      vehicle: 'van',
      startTime: '2025-06-10T10:00:00Z',
      endTime: '2025-06-10T11:00:00Z'
    });
    mockCapDao.findByParkingAndType.mockResolvedValue({ capacity: 5 });
    mockResDao.countOverlapping.mockResolvedValue(3);
    await middleware.checkCapacity(req as any, res as Response, next);
    expect(res.locals?.capacityRejected).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
