// Model for student

const mongoose = require('mongoose');
const validator = require('validator');

const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student needs a name'],
    trim: true,
    maxlength: [30, 'Name should be less than or equal to 30 characters long'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid');
      }
    },
  },
  phone: {
    type: Number, //TODO
  },
  photoUID: {
    type: String,
  },
  degree: {
    type: String,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
