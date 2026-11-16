import { Request, Response } from 'express';
import { Link } from '../models/Link';
import { User } from '../models/User';
import { Analytics } from '../models/Analytics';
import { AuthRequest } from '../middleware/auth';

// CRUD
export const createLink = async (req: AuthRequest, res: Response) => {
  try {
    const link = new Link({ ...req.body, user: req.user.id });
    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: 'Error creating link' });
  }
};

export const getLinks = async (req: AuthRequest, res: Response) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ basePriority: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching links' });
  }
};

export const updateLink = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const link = await Link.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: 'Error updating link' });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const link = await Link.findOneAndDelete({ _id: id, user: req.user.id });
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting link' });
  }
};

// THE SMART ENGINE
export const getPublicLinks = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const links = await Link.find({ user: user._id, isActive: true }); 

    const { device, region, timeOfDay } = req.query as any; // Context from frontend

    // Get real click counts
    const linkIds = links.map(l => l._id);
    const clickCounts = await Analytics.aggregate([
      { $match: { link: { $in: linkIds } } },
      { $group: { _id: '$link', count: { $sum: 1 } } }
    ]);
    const clickMap = new Map(clickCounts.map(c => [c._id.toString(), c.count]));

    const sortedLinks = links.map((link: any) => {
      let score = link.basePriority || 0;
      const appliedRules: string[] = [];

      link.rules.forEach((rule: any) => {
        let match = false;
        if (rule.type === 'device' && rule.condition === device) match = true;
        if (rule.type === 'time' && rule.condition === timeOfDay) match = true;
        if (rule.type === 'location' && rule.condition === region) match = true;
        
        // Performance Rule (Real-time check)
        if (rule.type === 'performance') {
           const clicks = clickMap.get(link._id.toString()) || 0;
           const threshold = parseInt(rule.condition.replace(/[^0-9]/g, '')) || 0; // Extract number
           if (clicks > threshold) {
             match = true;
           }
        }

        if (match) {

          if (rule.action === 'boost') score += rule.weight;
          if (rule.action === 'hide') score = -1000;
          if (rule.action === 'pin') score = 1000;
          appliedRules.push(rule.type);
        }
      });

      return { ...link.toObject(), score, appliedRules };
    }).sort((a, b) => b.score - a.score);

    // Filter out hidden ones
    const visibleLinks = sortedLinks.filter(l => l.score > -100);

    res.json({
      profile: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        displayMode: (user as any).displayMode || 'default'
      },
      links: visibleLinks
    });

  } catch (error) {
    res.status(500).json({ error: 'Error fetching public links' });
  }
};

