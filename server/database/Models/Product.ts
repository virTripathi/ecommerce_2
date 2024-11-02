import { Model, DataTypes, Optional } from 'sequelize';
import Database from '../database';

interface ProductAttributes {
    id: number;
    name: string;
    price: number;
    description?: string;
    stock_availability?: number | null;
    is_subscription_product?: boolean;
    status_id?: number | null;
    created_at?: Date;
    created_by?: number | null;
    updated_at?: Date;
    updated_by?: number | null;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'stock_availability' | 'is_subscription_product' | 'status_id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public description?: string;
    public stock_availability?: number | null;
    public is_subscription_product?: boolean;
    public status_id?: number | null;
    public created_at?: Date;
    public created_by?: number | null;
    public updated_at?: Date;
    public updated_by?: number | null;
    public static async getAppSubscriptionProduct(): Promise<Product | null> {
        try {
            const appSubscriptionProduct = await Product.findOne({
                where: { is_subscription_product: true },
                order: [['created_at', 'DESC']],
            });
            return appSubscriptionProduct;
        } catch (error) {
            console.error('Error fetching the last subscription product:', error);
            return null;
        }
    }
}

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
            defaultValue: null,
        },
        is_subscription_product: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
