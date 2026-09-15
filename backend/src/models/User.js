import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicate model compilation
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
