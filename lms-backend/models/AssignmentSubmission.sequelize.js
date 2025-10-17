// AssignmentSubmission model (Sequelize for MySQL)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentRollNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assignmentFile: {
    type: DataTypes.JSON,
    allowNull: true
  },
  marks: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assignment_submissions',
  timestamps: true
});

module.exports = AssignmentSubmission;
