import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const SuperAdminUserSeeder = {
    async up(queryInterface: QueryInterface) {
        const passwordHash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'defaultPassword', 10);

        const [[user]]:any = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = '${process.env.SUPERADMIN_EMAIL || 'superadmin@example.com'}' LIMIT 1;`
        );
        if(!user) {
            await queryInterface.bulkInsert('users', [
                {
                    name: 'Super Admin',
                    email: process.env.SUPERADMIN_EMAIL || 'superadmin@example.com',
                    password: passwordHash,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]); 
            const [[user]]:any = await queryInterface.sequelize.query(
                `SELECT id FROM users WHERE email = '${process.env.SUPERADMIN_EMAIL || 'superadmin@example.com'}' LIMIT 1;`
            );   
        }
        
        const userId = user?.id;

        const [role]:any = await queryInterface.sequelize.query(
            `SELECT id FROM roles WHERE label = 'superadmin' LIMIT 1;`
        );

        const roleId = role[0]?.id;

        if (userId && roleId) {
            await queryInterface.bulkInsert('user_role', [
                {
                    user_id: userId,
                    role_id: roleId
                },
            ]);
        } else {
            console.warn("Either 'superadmin' user or role not found. Skipping user_role association.");
        }
    },

    async down(queryInterface: QueryInterface) {
        const [[user]]:any = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = '${process.env.SUPERADMIN_EMAIL || 'superadmin@example.com'}' LIMIT 1;`
        );

        const userId = user?.id;
        if (userId) {
            await queryInterface.bulkDelete('user_role', { user_id: userId });
        }

        return queryInterface.bulkDelete('users', { email: process.env.SUPERADMIN_EMAIL || 'superadmin@example.com' });
    },
};
