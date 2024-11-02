import Database from '../database';
import User from './User';
import Role from './Role';
import UserRole from './UserRole';
import Activity from './Activity';
import ActivityRole from './ActivityRole';
import JwtToken from './JwtToken';
import Product from './Product';
import Status from './Status';

// Define associations
UserRole.belongsTo(Role, { foreignKey: 'role_id', targetKey: 'id' });
Role.hasMany(UserRole, { foreignKey: 'role_id' });

UserRole.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(UserRole, { foreignKey: 'user_id' });

// Export models and Sequelize instance for use in other files
export { User, Role, UserRole,Activity, ActivityRole, JwtToken, Product, Status };
export default Database.sequelize;
