import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../database';
import { User } from './User';      
import Product from './Product';
interface PurchaseAttributes {
    id: number;
    user_id: number;
    product_id: number;
    unit_price: number;
    currency: string;
    quantity: number;
    total_price: number;
    stripe_session_id: string | null;
    purchase_type: 'payment' | 'subscription';
    purchase_status: 'pending' | 'success' | 'fail';
    created_by: number | null;
    updated_by: number | null;
    created_at: Date;
    updated_at: Date;
  }
  
  interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, 'id' | 'total_price' | 'created_at' | 'updated_at'> {}
  

  class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> implements PurchaseAttributes {
    public id!: number;
    public user_id!: number;
    public product_id!: number;
    public unit_price!: number;
    public currency!: string;
    public quantity!: number;
    public total_price!: number;
    public purchase_status!: 'pending' | 'success' | 'fail';
    public purchase_type!: 'payment' | 'subscription';
    public stripe_session_id!: string | null;
    public created_by!: number | null;
    public updated_by!: number | null;
    public created_at!: Date;
    public updated_at!: Date;
  
    setTotalPrice() {
      this.total_price = this.unit_price * this.quantity;
    }
  }
  
  Purchase.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Product,
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'INR',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        set() {
          this.setDataValue('total_price', this.unit_price * this.quantity);
        },
      },
      purchase_status: {
        type: DataTypes.ENUM('pending', 'success', 'fail'),
        defaultValue: 'pending',
      },
      purchase_type: {
          type: DataTypes.ENUM('payment', 'subscription'),
          allowNull: false,
          defaultValue: 'payment',
      },
      stripe_session_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: Database.sequelize,
      modelName: 'Purchase',
      tableName: 'purchases',
      timestamps: true,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      hooks: {
        beforeCreate: (purchase) => {
          purchase.total_price = purchase.unit_price * purchase.quantity;
        },
        beforeUpdate: (purchase) => {
          purchase.total_price = purchase.unit_price * purchase.quantity;
        }
      }
    }
  );
  
  export default Purchase;
