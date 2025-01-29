import { Request, Response } from 'express';

const actionsMap = new Map<string, string>([
  ['action1', 'receiveEmail_test'],
  ['action2', 'repoCreated_github'],
  ['action3', 'checkNewSong_spotify'],
]);

export const get_action = async (req: Request, res: Response) => {
  try {
    const actionsArray = Array.from(actionsMap.values());

    res.status(200).json({ actions: actionsArray });
  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}; 
