import express from 'express';
import Database from './database/database';
import RouteRegister from './routes/RouteRegister';

class App {
    public app: express.Application;
    private db: any;
    private initializeMiddleware() {
        this.app.use(express.json());
    }
    
    constructor() {
        this.app = express();
        this.db = null;
        this.initializeMiddleware();
        this.initializeDatabase();
        this.mountRoutes();
    }

    private async initializeDatabase() {
        const database = Database;
        this.db = await database.initialize();
    }

    private mountRoutes(): void {
        this.app.use('/', RouteRegister);
    }
}

export default new App().app;