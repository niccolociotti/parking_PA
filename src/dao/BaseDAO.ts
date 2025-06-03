export interface IDAOBaseInterface<T,CreateData = T> {
  findall(): Promise<T[]>;
  create(Data:CreateData): Promise<T>;
  delete(id: string): Promise<number>;
}

