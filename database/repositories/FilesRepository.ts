import { isWeb, getDb, getWebDbKey } from '../db';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScannedFile {
  id: string;
  name: string;
  uri: string;
  size: number;
  extension: string | null;
  mimeType: string | null;
  lastModified: number | null;
  category: string;
  hash: string | null;
  isDuplicate: number;
  createdAt: number;
}

export class FilesRepository {
  
  static async saveFile(file: ScannedFile): Promise<boolean> {
    if (isWeb) {
      return this._saveWeb(file);
    }
    return this._saveNative(file);
  }

  static async getAllFiles(): Promise<ScannedFile[]> {
    if (isWeb) {
      return this._getAllWeb();
    }
    return this._getAllNative();
  }

  // Native implementations
  private static async _saveNative(file: ScannedFile): Promise<boolean> {
    const db = getDb();
    if (!db) return false;
    
    try {
      await db.runAsync(
        `INSERT INTO Files (id, name, uri, size, extension, mimeType, lastModified, category, hash, isDuplicate, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          file.id, file.name, file.uri, file.size, file.extension, file.mimeType, 
          file.lastModified, file.category, file.hash, file.isDuplicate, file.createdAt
        ]
      );
      return true;
    } catch (e: any) {
      // UNIQUE constraint failed => means file exists
      if (e.message.includes('UNIQUE constraint failed')) {
        return false; 
      }
      console.error('DB Insert Error:', e);
      return false;
    }
  }

  private static async _getAllNative(): Promise<ScannedFile[]> {
    const db = getDb();
    if (!db) return [];
    try {
      const allRows = await db.getAllAsync<ScannedFile>('SELECT * FROM Files ORDER BY createdAt DESC');
      return allRows;
    } catch (e) {
      console.error('DB Query Error:', e);
      return [];
    }
  }

  // Web implementations (AsyncStorage fallback)
  private static async _saveWeb(file: ScannedFile): Promise<boolean> {
    try {
      const existing = await this._getAllWeb();
      // Check for duplicates
      if (existing.some(f => f.uri === file.uri)) {
        return false;
      }
      existing.unshift(file);
      await AsyncStorage.setItem(getWebDbKey(), JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error('Web DB Insert Error:', e);
      return false;
    }
  }

  private static async _getAllWeb(): Promise<ScannedFile[]> {
    try {
      const data = await AsyncStorage.getItem(getWebDbKey());
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Web DB Query Error:', e);
      return [];
    }
  }
}
