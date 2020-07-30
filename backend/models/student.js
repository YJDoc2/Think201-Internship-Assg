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
    unique: [true, "This email is already registered"],
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid');
      }
    },
  },
  phone: {
    type: Number,
    required: [true, "Phone number is a required field"],
    validate: {
      validator: (num) => {
        return num > 999999999 && num <= 9999999999;
      },
      message: 'Not a valid phone number'
    }
  },
  photoUID: {
    required: [true, "Image is required"],
    type: String,
  },
  degree: {
    required: [true, "Degree is a required field"],
    type: String,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
