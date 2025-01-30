import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://root:root@cluster0.1iiqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('MongoDB Connected...');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message); // Assure que 'err' est un objet de type Error
    } else {
      console.error('Unexpected error', err);
    }
    process.exit(1); // Arrête le processus en cas d'erreur critique
  }
};

export default connectDB;
