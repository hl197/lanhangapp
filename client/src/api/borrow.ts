import client from './client';

export interface BorrowRecord {
  id: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  renewed: boolean;
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
  };
  bookTitle?: string;
}

export const borrowBook = (bookId: number) =>
  client.post('/borrow', { bookId });

export const renewBook = (recordId: number) =>
  client.post(`/borrow/${recordId}/renew`);

export const returnBook = (recordId: number) =>
  client.post(`/borrow/${recordId}/return`);

export const getCurrentBorrows = () =>
  client.get('/borrow/current');

export const getBorrowHistory = (page = 0, size = 20) =>
  client.get('/borrow/history', { params: { page, size } });
