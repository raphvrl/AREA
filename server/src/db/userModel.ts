import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, default: '' },
  apiKeys: { type: Map, of: String, default: {} },
  idService: { type: Map, of: String, default: {} },
  service: { type: Map, of: String, default: {} },
  lastFirstName: { type: String, default: '' },
  password: { type: String, default: '' },
  redirectUriLinkedin: { type: String, default: '' },
  redirectUriDropbox: { type: String, default: '' },
  redirectUriNotion: { type: String, default: '' },
  redirectUriTwitch: { type: String, default: '' },
  area: {
    type: Map,
    of: new Schema({
      action: { type: String, required: true },
      option_action: { type: String, default: '' },
      reaction: { type: String, required: true },
      option_reaction: { type: String, default: '' },
      is_on: { type: String, required: true },
    }),
    default: {},
  },
  spotify: {
    savedTracks: { type: [String], default: [] }, // Stocker les IDs des musiques enregistrées
  },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
