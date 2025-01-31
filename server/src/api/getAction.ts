import { Request, Response } from 'express';

const actionsMap = new Map<string, string>([
  ['action1', 'receiveEmail_test'],
  ['action2', 'repoCreatedGithub'],
  ['action3', 'checkNewSongSpotify'],
]);

export const getAction = async (req: Request, res: Response) => {
  try {
    const actionsArray = Array.from(actionsMap.values());

    res.status(200).json({ actions: actionsArray });
  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
