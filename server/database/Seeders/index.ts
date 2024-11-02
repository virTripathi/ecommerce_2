import { QueryInterface, Sequelize } from 'sequelize';
import {SuperAdminUserSeeder} from './SuperAdminUserSeeder';

async function runSeeders() {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    try {
        await SuperAdminUserSeeder.up(queryInterface);
        console.log('All seeders executed successfully!');
    } catch (error) {
        console.error('Error running seeders:', error);
    } finally {
        await sequelize.close();
    }
}

runSeeders();
