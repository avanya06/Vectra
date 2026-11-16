import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  deviceType: { type: String }, // mobile, desktop, tablet
  region: { type: String },
  referrer: { type: String }
});

export const Analytics = mongoose.model('Analytics', analyticsSchema);
