import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const setArea = async (req: Request, res: Response) => {
  try {
    const { emailUser, nomArea, action, reaction } = req.body;

    if (!emailUser || !nomArea || !action || !reaction) {
      return res.status(400).json({
        message:
          'All fields are required: emailUser, nomArea, action, reaction.',
      });
    }

    const user = await userModel.findOne({ email: emailUser });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${emailUser}" not found.` });
    }

    const serviceMap = user.service as Map<string, string>;
    const areaMap = user.area as Map<
      string,
      { action: string; reaction: string; is_on: string }
    >;

    const serviceAction = action.split('_')[1];
    const serviceReaction = reaction.split('_')[1];

    if (
      !serviceMap.get(serviceAction) ||
      serviceMap.get(serviceAction) !== 'true'
    ) {
      return res.status(400).json({
        message: `Service "${serviceAction}" is not connected for action.`,
      });
    } else if (serviceReaction === 'telegram') {
      if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
        return res
          .status(400)
          .json({ message: 'Telegram configuration is missing' });
      }
    } else if (serviceReaction === 'discord') {
      if (!process.env.DISCORD_WEBHOOK_URL) {
        return res
          .status(400)
          .json({ message: 'Discord webhook URL is missing' });
      }
    } else if (
      !serviceMap.get(serviceReaction) ||
      serviceMap.get(serviceReaction) !== 'true'
    ) {
      return res.status(400).json({
        message: `Service "${serviceReaction}" is not connected for reaction.`,
      });
    }
    const newArea = {
      action,
      reaction,
      is_on: 'true',
    };

    areaMap.set(nomArea, newArea);

    await user.save();

    return res.status(200).json({
      message: `Area "${nomArea}" has been successfully added or updated.`,
    });
  } catch (error) {
    console.error('Error in setArea:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
