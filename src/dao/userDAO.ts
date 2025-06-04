import { User } from '../models/user';

interface UserDAOInterface {
  findByEmail(data: string): Promise<User | null>;
}

export class UserDAO implements UserDAOInterface {
   async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({where: {email}});
  }

}