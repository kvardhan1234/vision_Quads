// Course model (Sequelize for MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: 'Self-Paced'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  files: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  assignmentEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'courses',
  timestamps: true
});

module.exports = Course;
