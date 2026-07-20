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

// Login
export const loginUser = async (data: LoginRequest) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Get all users (Admin)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Create new user (Admin)
export const createUser = async (userData: CreateUserRequest) => {
  const response = await api.post('/users', userData);
  return response.data;
};