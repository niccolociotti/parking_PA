
import { User } from "../models/User";
import { randomUUID } from "crypto";
/*
export class UserService {
  constructor(private userDAO: UserDAO) {}

  async listUsers(): Promise<User[]> {
    return this.userDAO.findall();
  }

  async createUser(name: string, email: string, role: string): Promise<User> {
    const userData ={
      id: randomUUID(),
      name,
      email,
      role,
    };
    return this.userDAO.create(userData);
  }

  async deleteUser(id: string): Promise<number> {
    return this.userDAO.delete(id);
  }
  
}
*/