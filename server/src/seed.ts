import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Link } from './models/Link';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  
  // Clear existing
  await User.deleteMany({});
  await Link.deleteMany({});

  // Create User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = new User({
    username: 'demo_user',
    email: 'demo@smartorbit.hub',
    password: hashedPassword
  });
  await user.save();

  // Create Links
  const links = [
    {
      user: user._id,
      title: 'Portfolio Website',
      url: 'https://portfolio.dev',
      icon: '🌐',
      basePriority: 10,
      rules: [
        { type: 'device', condition: 'desktop', action: 'boost', weight: 5 },
        { type: 'location', condition: 'global', action: 'boost', weight: 2 }
      ]
    },
    {
      user: user._id,
      title: 'Instagram',
      url: 'https://instagram.com/user',
      icon: '📸',
      basePriority: 5,
      rules: [
        { type: 'device', condition: 'mobile', action: 'boost', weight: 10 },
        { type: 'time', condition: 'night', action: 'boost', weight: 8 }
      ]
    },
    {
      user: user._id,
      title: 'GitHub Projects',
      url: 'https://github.com/user',
      icon: '💻',
      basePriority: 8,
      rules: [
        { type: 'device', condition: 'desktop', action: 'boost', weight: 8 },
        { type: 'time', condition: 'morning', action: 'boost', weight: 4 }
      ]
    },
    {
      user: user._id,
      title: 'WhatsApp Contact',
      url: 'https://wa.me/number',
      icon: '💬',
      basePriority: 6,
      rules: [
        { type: 'device', condition: 'mobile', action: 'boost', weight: 6 },
        { type: 'location', condition: 'india', action: 'boost', weight: 12 }
      ]
    }
  ];

  await Link.insertMany(links);
  console.log('Database seeded!');
  process.exit(0);
};

seed();
