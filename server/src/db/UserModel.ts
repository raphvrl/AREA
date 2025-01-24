import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, default: '' },
    apiKeys: { type: Map, of: String, default: {} },
    idService: { type: Map, of: String, default: {} },
    service: { type: Map, of: String, default: {} },
    lastFirstName: { type: String, default: '' },
    password: { type: String, default: '' },
    area: {
        type: Map,
        of: new Schema({
            action: { type: String, required: true },
            reaction: { type: String, required: true },
            is_on: {type: String, required: true},
        }),
        default: {},
    },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
