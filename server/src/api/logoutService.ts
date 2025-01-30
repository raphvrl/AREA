import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const logoutService = async (req: Request, res: Response) => {
  try {
    const { nameService, email } = req.body;

    if (!nameService || !email) {
      return res.status(400).json({
        message: 'Both "nameService" and "email" fields are required.',
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    const serviceMap = user.service as Map<string, string>;
    console.log(serviceMap.get(nameService));
    if (!serviceMap || serviceMap.get(nameService) === undefined) {
      return res.status(404).json({
        message: `Service "${nameService}" not found for user "${email}".`,
      });
    }

    serviceMap.set(nameService, 'false');

    await user.save();

    return res.status(200).json({
      message: `Service "${nameService}" has been successfully logged out.`,
    });
  } catch (error) {
    console.error('Error in logoutService:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
