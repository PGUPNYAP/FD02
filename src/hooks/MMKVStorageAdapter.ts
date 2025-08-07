// // src/hooks/MMKVStorageAdapter.ts
// import { MMKV } from 'react-native-mmkv';

// // Create a separate MMKV instance for Amplify to avoid conflicts
// const amplifyStorage = new MMKV({
//   id: 'amplify-storage',
// });

// // Create AsyncStorage-compatible interface for Amplify
// export const MMKVStorageAdapter = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       return amplifyStorage.getString(key) || null;
//     } catch (error) {
//       console.error('MMKVStorageAdapter getItem error:', error);
//       return null;
//     }
//   },
  
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       amplifyStorage.set(key, value);
//     } catch (error) {
//       console.error('MMKVStorageAdapter setItem error:', error);
//     }
//   },
  
//   async removeItem(key: string): Promise<void> {
//     try {
//       amplifyStorage.delete(key);
//     } catch (error) {
//       console.error('MMKVStorageAdapter removeItem error:', error);
//     }
//   },
  
//   async clear(): Promise<void> {
//     try {
//       amplifyStorage.clearAll();
//     } catch (error) {
//       console.error('MMKVStorageAdapter clear error:', error);
//     }
//   },
  
//   async getAllKeys(): Promise<string[]> {
//     try {
//       return amplifyStorage.getAllKeys();
//     } catch (error) {
//       console.error('MMKVStorageAdapter getAllKeys error:', error);
//       return [];
//     }
//   },
  
//   async multiGet(keys: string[]): Promise<[string, string | null][]> {
//     try {
//       return keys.map(key => [key, amplifyStorage.getString(key) || null]);
//     } catch (error) {
//       console.error('MMKVStorageAdapter multiGet error:', error);
//       return keys.map(key => [key, null]);
//     }
//   },
  
//   async multiSet(pairs: [string, string][]): Promise<void> {
//     try {
//       pairs.forEach(([key, value]) => {
//         amplifyStorage.set(key, value);
//       });
//     } catch (error) {
//       console.error('MMKVStorageAdapter multiSet error:', error);
//     }
//   },
  
//   async multiRemove(keys: string[]): Promise<void> {
//     try {
//       keys.forEach(key => {
//         amplifyStorage.delete(key);
//       });
//     } catch (error) {
//       console.error('MMKVStorageAdapter multiRemove error:', error);
//     }
//   },
// };