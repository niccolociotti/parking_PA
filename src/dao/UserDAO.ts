import { User } from "../models/User";
import { IDAOBaseInterface } from "./BaseDAO";
import { IUserCreate } from "../models/User";

export interface IDAOUserInterface extends IDAOBaseInterface<User, IUserCreate> {
  findall(): Promise<User[]>;
  create(userData:IUserCreate): Promise<User>;
  delete(id: string): Promise<number>;
}

export class UserDAO implements IDAOUserInterface {

  async findall(): Promise<User[]> {
   return User.findAll();
  }

  async create(userData:IUserCreate): Promise<User> {
    return User.create(userData);
  }

  async delete(id: string): Promise<number> {
    return User.destroy({ where: {id}} as any);
}
}
