import { Response } from 'express';

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || 'Operation successful',
    data: data.data,
  });
};
