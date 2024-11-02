import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/database';

class Database {
  public sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,{
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect
    });
  }

  async checkDatabaseExists(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error: any) {
      console.log('Unable to connect to the database:', error.message);
      return false;
    }
  }

  async initialize(): Promise<Sequelize> {
    return this.sequelize;
  }
}

export default new Database();