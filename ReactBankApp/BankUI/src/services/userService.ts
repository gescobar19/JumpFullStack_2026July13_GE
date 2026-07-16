import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};


export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}) => {
  const response = await api.post('/users', userData);
  return response.data;
};