import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  type: { type: String, enum: ['time', 'device', 'location', 'performance'], required: true },
  condition: { type: String, required: true },
  action: { type: String, enum: ['boost', 'hide', 'pin'], default: 'boost' },
  weight: { type: Number, default: 0 }
});

const linkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: '🔗' },
  basePriority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  rules: [ruleSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Link = mongoose.model('Link', linkSchema);
