import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    apiKeys: { [key: string]: string };
    service: { [key: string]: string };
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    apiKeys: { type: Map, of: String, default: {} },
    service: { type: Map, of: String, default: {} },
});

export default mongoose.model<IUser>('User', UserSchema);
