import User from './UserModel';

export const createUser = async (userData: {firstName: string; lastName: string; email?: string; apiKeys?: { [key: string]: string }; idService?: { [key: string]: string }; service?: { [key: string]: string }; lastFirstName?: string; password?: string }) => {
    const user = new User(userData);
    await user.save();
    console.log('User created:', user);
};

export const createUserWithCredentials = async (lastFirstName: string, password: string) => {
    const user = new User({ lastFirstName, password });
    await user.save();
    console.log('User created with credentials:', user);
    return user;
};


export const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    return user;
};

export const updateUserApiKey = async (lastName: string, firstName: string, service: string, encryptedKey: string) => {
    const user = await User.findOneAndUpdate(
        { firstName, lastName },
        { $set: { [`apiKeys.${service}`]: encryptedKey } },
        { new: true }
    );
    console.log('Updated user:', user);
    return user;
};

export const updateUserService = async (firstName: string, lastName: string, service: string, is_activate: boolean) => {
    const user = await User.findOneAndUpdate(
        { firstName, lastName },
        { $set: { [`service.${service}`]: is_activate} },
        { new: true }
    );
    console.log('Updated user:', user);
    return user;
};
export const updateUserCredentials = async (lastName: string, firstName: string, lastFirstName: string, password: string) => {
    const user = await User.findOneAndUpdate(
        { firstName, lastName },
        { $set: { lastFirstName, password } },
        { new: true }
    );
    console.log('Updated user credentials:', user);
    return user;
};

export const updateUserIdService = async (lastName: string, firstName: string, service: string, id: string) => {
    const user = await User.findOneAndUpdate(
        { firstName, lastName },
        { $set: { [`idService.${service}`]: id} },
        { new: true }
    );
    console.log('Updated user:', user);
    return user;
};