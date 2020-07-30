// Model for the admin account
// as the admin account is not strictly mentioned in the task desc, This is only a basic model

const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Admin Account needs a name'],
      unique: [true, 'This Admin already exists'],
      trim: true,
      maxlength: [
        30,
        'Name should be less than or equal to 30 characters long',
      ],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: 'Admins' }
);

module.exports = mongoose.model('Admin', AdminSchema);
