import { Model, DataTypes } from 'sequelize';
import Database from '../database';

class ActivityRole extends Model {}

ActivityRole.init({
    activity_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'activities',
            key: 'id',
        },
        primaryKey: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id',
        },
        primaryKey: true,
    },
}, {
    sequelize: Database.sequelize,
    modelName: 'ActivityRole',
    tableName: 'activity_role',
    timestamps: false,
});

export default ActivityRole;
