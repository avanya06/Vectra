import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Made optional for Google Auth users
  googleId: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  displayMode: { 
    type: String, 
    enum: ['default', 'text_only', 'avatar_only'], 
    default: 'default' 
  },
  createdAt: { type: Date, default: Date.now }
});


export const User = mongoose.model('User', userSchema);
