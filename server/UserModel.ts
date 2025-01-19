import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email?: string;
    apiKeys: { [key: string]: string };
    idService: { [key: string]: string };
    service: { [key: string]: string };
    lastFirstName?: string;
    password?: string;
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true , default: '' },
    apiKeys: { type: Map, of: String, default: {} },
    idService: { type: Map, of: String, default: {} },
    service: { type: Map, of: String, default: {} },
    lastFirstName: { type: String, default: '' },
    password: { type: String, default: '' },
});

export default mongoose.model<IUser>('User', UserSchema);
