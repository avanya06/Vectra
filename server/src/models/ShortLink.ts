import mongoose from 'mongoose';

const shortLinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const ShortLink = mongoose.model('ShortLink', shortLinkSchema);
