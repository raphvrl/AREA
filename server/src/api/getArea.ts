import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const get_area = async (req: Request, res: Response) => {
  try {
    const { email_user } = req.params;

    if (!email_user) {
      return res.status(400).json({ message: 'Email user is required.' });
    }

    const user = await UserModel.findOne({ email: email_user });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email_user}" not found.` });
    }

    const areaMap = user.area as
      | Map<string, { action: string; reaction: string; is_on: string }>
      | undefined;
    if (!areaMap) {
      return res.status(200).json({ areas: [] });
    }

    const areas = Array.from(areaMap.entries()).map(([nom_area, area]) => ({
      nom_area,
      action: area.action,
      reaction: area.reaction,
      is_on: area.is_on,
    }));

    return res.status(200).json({ areas });
  } catch (error) {
    console.error('Error in get_area:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
