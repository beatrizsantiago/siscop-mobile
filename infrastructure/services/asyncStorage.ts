import AsyncStorage from '@react-native-async-storage/async-storage';

class HandleWithToken {
  async getToken() {
    const token = await AsyncStorage.getItem('token')
    return token;
  };

  async setToken(token:string) {
    await AsyncStorage.setItem('token', token);
  };

  async clearToken() {
    await AsyncStorage.removeItem('token');
  };
};

export const asyncStorageService = new HandleWithToken();
