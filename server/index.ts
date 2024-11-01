import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to Database
AppDataSource.initialize()
  .then(() => {
    app.use('/', router);
    console.log('Connected to the database');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log('Database connection error:', error));
