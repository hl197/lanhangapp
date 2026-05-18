import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";

export const saveToken = async (token: string) =>
  AsyncStorage.setItem(TOKEN_KEY, token);

export const getToken = async (): Promise<string | null> =>
  AsyncStorage.getItem(TOKEN_KEY);

export const removeToken = async () => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = async (user: object) =>
  AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

export const getUser = async () => {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : null;
};
