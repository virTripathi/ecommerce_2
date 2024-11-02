import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../database';

interface StatusAttributes {
    id: number;
    label: string;
    title: string;
    is_active?: boolean;
    is_inactive?: boolean;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, 'id'> {}

export class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
    public id!: number;
    public label!: string;
    public title!: string;
    public is_active!: boolean;
    public is_inactive!: boolean;
    public created_at?: Date;
    public created_by?: number;
    public updated_at?: Date;
    public updated_by?: number;

    // Method to find all active statuses
    public static async active(): Promise<Status|null> {
        return await Status.findOne({
            where: { is_active: true }
        });
    }

    // Method to find all inactive statuses
    public static async inactive(): Promise<Status|null> {
        return await Status.findOne({
            where: { is_inactive: true }
        });
    }
}

Status.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        is_inactive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        created_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
    },
    {
        sequelize: Database.sequelize,
        modelName: 'Status',
        tableName: 'statuses',
        timestamps: false,
    }
);

export default Status;
