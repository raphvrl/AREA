import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const getLoginService = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: 'The "email" field is required.' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    const serviceMap = user.service as Map<string, string> | undefined;
    if (!serviceMap) {
      return res.status(200).json({ activeServices: [] });
    }

    console.log('Service Map:', serviceMap);

    const activeServices: string[] = [];
    for (const [serviceName, value] of serviceMap.entries()) {
      if (value === 'true') {
        activeServices.push(serviceName);
      }
    }

    return res.status(200).json({ activeServices });
  } catch (error) {
    console.error('Error fetching login services:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
