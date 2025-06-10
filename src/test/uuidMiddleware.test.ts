import { UUIDMiddleware } from '../middleware/UUIDMiddleware';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../factories/errorFactory';

describe('UUIDMiddleware - unit', () => {
  const mw = new UUIDMiddleware().validateUUID;

  const buildReq = (params: Record<string, string>) =>
    ({ params } as any); // cast rapido per il mock

  it('chiama next() senza argomenti se tutti gli UUID sono validi', () => {
    const req = buildReq({ userId: 'e603cb6d-97e3-435f-bdc3-38f28823e7cc' });
    const next = jest.fn();

    mw(req, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // nessun errore passato
  });

  it('propaga un CustomError se un param id non è UUID', () => {
    const req = buildReq({ reservationId: '123-not-valid' });
    const next = jest.fn();

    mw(req, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(CustomError);
    expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});
