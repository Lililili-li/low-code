interface IDb {
  getItem: (key: string) => string,
  setItem: () => void,
  delete: () => void,
  update: () => string,
}

class Db implements IDb{
  constructor (private readonly db: Db) {

  }
  getItem(key: string) {
    return this.db.getItem(key);
  }
}

// export default new Db();
