import client from './client';

export interface LoginParams {
  studentId: string;
  password: string;
}

export interface RegisterParams {
  studentId: string;
  password: string;
  name: string;
  phone?: string;
}

export const loginApi = (params: LoginParams) =>
  client.post('/auth/login', params);

export const registerApi = (params: RegisterParams) =>
  client.post('/auth/register', params);
