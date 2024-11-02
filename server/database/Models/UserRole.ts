import { Model, DataTypes } from 'sequelize';
import Database from '../database';
import User from './User';
import Role from './Role';

class UserRole extends Model {
    role_id: any;
}

UserRole.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: User,
          key: 'id',
        }
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: Role,
          key: 'id',
        }
      }
}, {
    sequelize: Database.sequelize,
    modelName: 'UserRole',
    tableName:'user_role',
    timestamps: false,
    underscored: true,
});

export default UserRole;
