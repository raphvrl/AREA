import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const logout_service = async (req: Request, res: Response) => {
  try {
    const { name_service, email } = req.body;

    if (!name_service || !email) {
      return res.status(400).json({
        message: 'Both "name_service" and "email" fields are required.',
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    const serviceMap = user.service as Map<string, string>;
    console.log(serviceMap.get(name_service));
    if (!serviceMap || serviceMap.get(name_service) === undefined) {
      return res.status(404).json({
        message: `Service "${name_service}" not found for user "${email}".`,
      });
    }

    serviceMap.set(name_service, 'false');

    await user.save();

    return res.status(200).json({
      message: `Service "${name_service}" has been successfully logged out.`,
    });
  } catch (error) {
    console.error('Error in logout_service:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
