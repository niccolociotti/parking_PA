import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  list = async (req: Request, res: Response) => {
    const users = await this.userService.listUsers();
    res.json(users);
  };

  create = async (req: Request, res: Response) => { 
    const { name, email, role } = req.body;
    const user = await this.userService.createUser(name, email, role);
    res.status(201).json(user);
  };

  delete = async (req: Request, res: Response) => {
  const deleted = await this.userService.deleteUser(req.params.id);

  if (deleted > 0) {
    res.status(200).json({ message: `User with ID ${req.params.id} deleted.` });
  } else {
    res.status(404).json({ error: `User with ID ${req.params.id} not found.` });
  }
};

  /*
  get = async (req: Request, res: Response) => {
    const user = await this.userService.getUser(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
  };

  
    
  };*/
}
