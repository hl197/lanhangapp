import client from './client';

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  location: string;
  total: number;
  available: number;
  cover: string;
  description: string;
}

export const searchBooks = (params: {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
}) => client.get('/books', { params });

export const getBookDetail = (id: number) =>
  client.get(`/books/${id}`);
