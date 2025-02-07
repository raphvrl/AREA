import mongoose from 'mongoose';
import userModel from './userModel'; // Assurez-vous que le chemin est correct

// Fonction pour récupérer un utilisateur par email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

// Fonction pour mettre à jour ou créer un utilisateur
export const saveUser = async (userData: any) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email: userData.email },
      userData,
      { new: true, upsert: true }
    );
    return user;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les clés API d'un utilisateur
export const updateApiKeys = async (email: string, apiKeys: Map<string, string>) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { apiKeys },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating API keys:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les services d'un utilisateur
export const updateServices = async (email: string, services: Map<string, string>) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { service: services },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating services:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les IDs de service d'un utilisateur
export const updateIdServices = async (email: string, idServices: Map<string, string>) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { idService: idServices },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating ID services:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les URI de redirection
export const updateRedirectUri = async (email: string, service: string, redirectUri: string) => {
  try {
    const updateField = `redirectUri${service}`;
    const user = await userModel.findOneAndUpdate(
      { email },
      { [updateField]: redirectUri },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating redirect URI:', error);
    throw error;
  }
};

// Fonction pour ajouter ou mettre à jour une zone (area) d'un utilisateur
export const updateUserArea = async (email: string, areaId: string, areaData: any) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { $set: { [`area.${areaId}`]: areaData } },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating user area:', error);
    throw error;
  }
};

// Fonction pour récupérer les zones (areas) d'un utilisateur
export const getUserAreas = async (email: string) => {
  try {
    const user = await userModel.findOne({ email });
    return user?.area;
  } catch (error) {
    console.error('Error fetching user areas:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les musiques enregistrées Spotify d'un utilisateur
export const updateSpotifySavedTracks = async (email: string, savedTracks: string[]) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { 'spotify.savedTracks': savedTracks },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating Spotify saved tracks:', error);
    throw error;
  }
};

// Fonction pour mettre à jour le mot de passe d'un utilisateur
export const updatePassword = async (email: string, password: string) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Fonction pour mettre à jour le nom et prénom d'un utilisateur
export const updateName = async (email: string, firstName: string, lastName: string) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { firstName, lastName },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating name:', error);
    throw error;
  }
};