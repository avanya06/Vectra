import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Link } from '../models/Link';
import mongoose from 'mongoose';

export const trackClick = async (req: Request, res: Response) => {
  try {
    const { linkId, deviceType, region, referrer } = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Fire and forget - don't block response? 
    // Actually, usually the client calls this asynchronously.
    
    await Analytics.create({
      link: linkId,
      userAgent,
      deviceType: deviceType || 'desktop',
      region: region || 'global',
      referrer: referrer || 'direct',
      timestamp: new Date()
    });

    // Optionally increment a counter on the Link model for fast retrieval
    // await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }); 
    // But our Link model doesn't have clicks field yet (it has rules).
    // Let's stick to Analytics model for now.

    res.status(200).json({ status: 'tracked' });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Error tracking click' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // 1. Get all links for this user
    const links = await Link.find({ user: userId });
    const linkIds = links.map(l => l._id);

    // 2. Aggregate Analytics
    const totalVisits = await Analytics.countDocuments({ link: { $in: linkIds } });
    
    // Total Clicks (In this context, visits to links ARE clicks from the hub)
    // If we were tracking Hub Views separately, we'd need a different model.
    // For now, let's assume "Analytics" tracks Link Clicks.
    const totalClicks = totalVisits; 

    // Top Performer
    const topLinks = await Analytics.aggregate([
      { $match: { link: { $in: linkIds } } },
      { $group: { _id: '$link', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topPerformer = null;
    if (topLinks.length > 0) {
      const linkDoc = links.find(l => l._id.toString() === topLinks[0]._id.toString());
      topPerformer = {
        name: linkDoc?.title,
        clicks: topLinks[0].count
      };
    }

    // Daily Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Analytics.aggregate([
      { 
        $match: { 
          link: { $in: linkIds },
          timestamp: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalVisits, // This acts as "Total Clicks" for now
      totalClicks,
      topPerformer,
      dailyStats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
};
