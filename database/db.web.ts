import AsyncStorage from '@react-native-async-storage/async-storage';

export const isWeb = true;
const WEB_DB_KEY = 'MEMORA_WEB_DB_FILES';

export const initDatabase = async () => {
  // Web fallback initialization using AsyncStorage
  const existing = await AsyncStorage.getItem(WEB_DB_KEY);
  if (!existing) {
    await AsyncStorage.setItem(WEB_DB_KEY, JSON.stringify([]));
  }
};

// No-op for web since we use AsyncStorage
export const getDb = () => null;
export const getWebDbKey = () => WEB_DB_KEY;
