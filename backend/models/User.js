const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified',
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'profile_picture',
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      notifications: {
        pillReminders: true,
        cycleUpdates: true,
        healthInsights: true,
      },
      privacy: {
        shareData: false,
        publicProfile: false,
      },
      ui: {
        theme: 'pink',
        animations: true,
      },
    },
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'viewer'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

module.exports = User;
