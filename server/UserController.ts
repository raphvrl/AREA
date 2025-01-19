import User from './UserModel';

export const createUser = async (userData: { firstName: string; lastName: string; email: string; apiKeys: { [key: string]: string } }) => {
    const user = new User(userData);
    await user.save();
    console.log('User created:', user);
};

export const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    return user;
};

export const updateUserApiKey = async (email: string, service: string, encryptedKey: string) => {
    const user = await User.findOneAndUpdate(
        { email },
        { $set: { [`apiKeys.${service}`]: encryptedKey } },
        { new: true }
    );
    console.log('Updated user:', user);
    return user;
};
