import { Model, DataTypes } from 'sequelize';
import Database from '../database';

export class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public mobile_number!: string;
    public address!: string;
    public password!: string;
    public is_super_admin!: boolean;
    public is_prime_user!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
        },
        mobile_number: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        is_super_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_prime_user: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize: Database.sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        hooks: {
            beforeCreate: (user: User) => {
                user.created_at = new Date(); // Set current timestamp
                user.updated_at = new Date(); // Set current timestamp
            },
            beforeUpdate: (user: User) => {
                user.updated_at = new Date(); // Update timestamp on update
            },
        },
    }
);
export default User;
