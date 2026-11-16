import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL || 'http://localhost:5001'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by googleId
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists by email
        const email = profile.emails?.[0]?.value;
        if (email) {
          existingUser = await User.findOne({ email });
          if (existingUser) {
            // Link Google account to existing email account
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
          }
        }

        // Create new user
        const newUser = new User({
          username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000),
          email: email,
          googleId: profile.id,
          // No password for Google users
        });

        await newUser.save();
        done(null, newUser);

      } catch (error) {
        done(error, undefined);
      }
    }
  ));
} else {
  console.warn('⚠️  Google Client ID or Secret not found in environment variables. Google OAuth is disabled.');
}
