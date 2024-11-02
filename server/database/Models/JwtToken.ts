import { DataTypes, Model } from 'sequelize';
import db from '../database';
import { User } from './User';

class JwtToken extends Model {
  public id!: number;
  public user_id!: number;
  public token!: string;
  public created_at!: Date;
  public expires_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JwtToken.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize: db.sequelize,
  tableName: 'jwt_tokens',
  timestamps: true,
  underscored: true,
});

export default JwtToken;