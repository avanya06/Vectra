import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', existingUser.username);
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log('User created:', user._id);
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.password) {
      return res.status(400).json({ error: 'Please sign in with Google' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    
    // Redirect to frontend with token
    // Adjust the URL to match the deployed frontend or localhost
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    res.redirect(`${frontendUrl}/dashboard?token=${token}`);
  } catch (error) {
    console.error('Google Callback Error:', error);
    res.redirect('/login?error=auth_failed');
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    // user is attached by authenticateToken middleware
    const userData = await User.findById(user.id).select('-password');
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log('Update profile request body:', req.body);
    const userId = (req.user as any).id;
    console.log('Update profile for user:', userId);
    
    const { displayName, bio, avatarUrl, displayMode } = req.body;
    
    // Validate displayMode if present
    if (displayMode && !['default', 'text_only', 'avatar_only'].includes(displayMode)) {
        console.log('Invalid displayMode:', displayMode);
        return res.status(400).json({ error: 'Invalid display mode' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { displayName, bio, avatarUrl, displayMode },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
        console.log('User not found during update');
        return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Error updating profile' });
  }
};

