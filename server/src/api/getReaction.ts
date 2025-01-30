import { Request, Response } from 'express';

const reactionsMap = new Map<string, string>([
  ['reaction1', 'sendMessage_test'],
  ['reaction2', 'test'],
]);

export const getReaction = async (req: Request, res: Response) => {
  try {
    const reactionsArray = Array.from(reactionsMap.values());

    res.status(200).json({ reactions: reactionsArray });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
