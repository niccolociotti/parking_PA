import { Fine } from '../models/fine';
import { FineCreationAttributes } from '../models/fine'; 

interface FineDAOInterface {
  create(data: Fine): Promise<Fine>;
}

export class FineDAO implements FineDAOInterface {
   async create(data: FineCreationAttributes): Promise<Fine> {
    return await Fine.create(data);
  }

}
