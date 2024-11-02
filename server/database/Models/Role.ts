import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../database';
import { User } from './User';
import { Status } from './Status';

interface RoleAttributes {
    id: number;
    label: string; 
    title: string;
    status_id?: number;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public label!: string;
    public title!: string;
    public status_id?: number;
    public created_at?: Date;
    public created_by?: number;
    public updated_at?: Date;
    public updated_by?: number;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: DataTypes.ENUM('admin', 'editor', 'viewer'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Status,
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        created_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
    },
    {
        sequelize: Database.sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false,
    }
);
export default Role;