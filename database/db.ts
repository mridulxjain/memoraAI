import * as SQLite from 'expo-sqlite';

export const isWeb = false;
const WEB_DB_KEY = 'MEMORA_WEB_DB_FILES'; // Kept for interface parity

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  // Native SQLite initialization
  db = await SQLite.openDatabaseAsync('memoraai.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      uri TEXT NOT NULL UNIQUE,
      size INTEGER NOT NULL,
      extension TEXT,
      mimeType TEXT,
      lastModified INTEGER,
      category TEXT NOT NULL,
      hash TEXT,
      isDuplicate INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
  `);
};

export const getDb = () => db;
export const getWebDbKey = () => WEB_DB_KEY;
