import { create } from 'zustand';
import { loginApi, registerApi, LoginParams, RegisterParams } from '../api/auth';
import { saveToken, removeToken, saveUser, getUser } from '../utils/storage';

interface UserInfo {
  userId: number;
  name: string;
}

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  loading: false,

  login: async (params) => {
    set({ loading: true });
    try {
      const res: any = await loginApi(params);
      const { token, userId, name } = res.data;
      await saveToken(token);
      await saveUser({ userId, name });
      set({ user: { userId, name }, isLoggedIn: true, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (params) => {
    set({ loading: true });
    try {
      const res: any = await registerApi(params);
      const { token, userId, name } = res.data;
      await saveToken(token);
      await saveUser({ userId, name });
      set({ user: { userId, name }, isLoggedIn: true, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await removeToken();
    set({ user: null, isLoggedIn: false });
  },

  restoreSession: async () => {
    const user = await getUser();
    if (user) {
      set({ user, isLoggedIn: true });
    }
  },
}));
