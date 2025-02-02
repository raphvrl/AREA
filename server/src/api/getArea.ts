import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const getArea = async (req: Request, res: Response) => {
  try {
    const { emailUser } = req.params;

    if (!emailUser) {
      return res.status(400).json({ message: 'Email user is required.' });
    }

    const user = await userModel.findOne({ email: emailUser });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${emailUser}" not found.` });
    }

    const areaMap = user.area as
      | Map<
          string,
          {
            action: string;
            reaction: string;
            is_on: string;
            option_action?: string;
            option_reaction?: string;
          }
        >
      | undefined;

    if (!areaMap) {
      return res.status(200).json({ areas: [] });
    }

    const areas = Array.from(areaMap.entries()).map(([nomArea, area]) => ({
      nomArea,
      action: area.action,
      reaction: area.reaction,
      is_on: area.is_on,
    }));

    return res.status(200).json({ areas });
  } catch (error) {
    console.error('Error in getArea:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
