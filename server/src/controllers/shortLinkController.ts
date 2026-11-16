import { Request, Response } from 'express';
import { ShortLink } from '../models/ShortLink';
import crypto from 'crypto';

export const createShortLink = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Simple 6-char random string
    const shortCode = crypto.randomBytes(3).toString('hex');

    // Check collision (unlikely but good practice)
    const existing = await ShortLink.findOne({ shortCode });
    if (existing) {
        return res.status(409).json({ error: 'Collision detected, please try again' });
    }

    // If user is authenticated (optional, depends on middleware usage)
    const userId = (req as any).user?.id;

    const shortLink = new ShortLink({
      originalUrl,
      shortCode,
      user: userId
    });

    await shortLink.save();

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/s/${shortCode}`;

    res.status(201).json({ shortUrl, shortCode, originalUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error creating short link' });
  }
};

export const redirectShortLink = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const link = await ShortLink.findOne({ shortCode: code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    link.clicks++;
    await link.save();

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Error redirecting' });
  }
};
