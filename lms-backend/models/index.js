// Model relationships and exports (Sequelize)
const sequelize = require('../config/database');
const User = require('./User.sequelize');
const Student = require('./Student.sequelize');
const Course = require('./Course.sequelize');
const Enrollment = require('./Enrollment.sequelize');
const Event = require('./Event.sequelize');
const AssignmentSubmission = require('./AssignmentSubmission.sequelize');

// Define relationships

// User (Teacher) - Course relationship (one-to-many)
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Student - Course relationship (many-to-many through Enrollment)
Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentId', as: 'enrolledCourses' });
Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseId', as: 'enrolledStudents' });

// Direct associations for easier querying
Student.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
Enrollment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User (Teacher) - Event relationship
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Course - Event relationship (optional)
Course.hasMany(Event, { foreignKey: 'relatedCourse', as: 'events' });
Event.belongsTo(Course, { foreignKey: 'relatedCourse', as: 'course' });

// Course - AssignmentSubmission relationship
Course.hasMany(AssignmentSubmission, { foreignKey: 'courseId', as: 'submissions' });
AssignmentSubmission.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Student - AssignmentSubmission relationship
Student.hasMany(AssignmentSubmission, { foreignKey: 'studentId', as: 'submissions' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

module.exports = {
  sequelize,
  User,
  Student,
  Course,
  Enrollment,
  Event,
  AssignmentSubmission
};
