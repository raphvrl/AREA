import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './UserModel';

const router = express.Router();

const loginOrCreateUser = async (lastFirstName: string, password: string) => {
    const [lastName, firstName] = lastFirstName.split(' ');

    if (!lastName || !firstName) {
        throw new Error('Invalid lastFirstName format. Expected format: "LastName FirstName".');
    }

    let user = await User.findOne({ lastName, firstName });

    if (user) {
        if (user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password.');
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.lastFirstName = lastFirstName;
            await user.save();
            user.password = hashedPassword;
            await user.save();
        }
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ lastName, firstName, lastFirstName, password: hashedPassword });
        await user.save();
    }

    return user;
};

router.post('/api/login', async (req: Request, res: Response) => {
    const { lastFirstName, password } = req.body;

    if (!lastFirstName || !password) {
        return res.status(400).json({ error: 'Missing lastFirstName or password' });
    }

    try {
        const user = await loginOrCreateUser(lastFirstName, password);
        res.status(200).json({ message: 'User logged in or created successfully', user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
