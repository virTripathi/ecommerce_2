import { Model, DataTypes } from 'sequelize';
import Database from '../database';

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        stock_availability: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'statuses',
                key: 'id',
            },
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        created_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
        updated_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: true,
        },
    },
    {
        sequelize: Database.sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Product;
