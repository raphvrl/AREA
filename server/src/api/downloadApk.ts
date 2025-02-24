import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const downloadApk = async (req: Request, res: Response) => {
  try {
    const apkDir = '/apk';

    if (!fs.existsSync(apkDir)) {
      return res.status(404).json({ 
          success: false, 
          message: 'Dossier APK non trouvé' 
      });
    }

    const files = fs.readdirSync(apkDir);

    const apkFile = files.find(file => file.endsWith('.apk'));

    if (!apkFile) {
      return res.status(404).json({ 
          success: false, 
          message: 'Fichier APK non trouvé' 
      });
    }

    const filePath = path.join(apkDir, apkFile);

    res.download(filePath, apkFile, (err) => {
      if (err) {
        return res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du téléchargement de l\'APK' 
        });
      }
    });

  } catch (error) {
    return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors du téléchargement de l\'APK' 
    });
  }
};