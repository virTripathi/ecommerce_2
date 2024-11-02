import { Model, DataTypes } from 'sequelize';
import Database from '../database';

class Activity extends Model {
    id: Number;
}

Activity.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    module_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'modules',
            key: 'id',
        },
    },
    type: {
        type: DataTypes.ENUM('create', 'read', 'update', 'delete'),
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    status_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'statuses',
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    sequelize: Database.sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: false,
});

export default Activity;
