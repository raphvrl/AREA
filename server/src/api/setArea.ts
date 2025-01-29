import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const set_area = async (req: Request, res: Response) => {
    try {
        const { email_user, nom_area, action, reaction } = req.body;

        if (!email_user || !nom_area || !action || !reaction) {
            return res.status(400).json({ message: 'All fields are required: email_user, nom_area, action, reaction.' });
        }

        const user = await UserModel.findOne({ email: email_user });
        if (!user) {
            return res.status(404).json({ message: `User with email "${email_user}" not found.` });
        }

        const serviceMap = user.service as Map<string, string>;
        const areaMap = user.area as Map<string, { action: string; reaction: string; is_on: string }>;

        const service_action = action.split('_')[1];
        const service_reaction = reaction.split('_')[1];

        if (!serviceMap.get(service_action) || serviceMap.get(service_action) !== 'true') {
            return res.status(400).json({ message: `Service "${service_action}" is not connected for action.` });
        }

        if (service_reaction === 'telegram') {
            if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
                return res.status(400).json({ message: 'Telegram configuration is missing' });
            }
        } else if (service_reaction === 'discord') {
            if (!process.env.DISCORD_WEBHOOK_URL) {
                return res.status(400).json({ message: 'Discord webhook URL is missing' });
            }
        } else if (!serviceMap.get(service_reaction) || serviceMap.get(service_reaction) !== 'true') {
            return res.status(400).json({ message: `Service "${service_reaction}" is not connected for reaction.` });
    }
        const new_area = {
            action,
            reaction,
            is_on: 'true',
        };

        areaMap.set(nom_area, new_area);

        await user.save();

        return res.status(200).json({ message: `Area "${nom_area}" has been successfully added or updated.` });
    } catch (error) {
        console.error('Error in set_area:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
