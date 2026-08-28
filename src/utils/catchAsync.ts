import { Request, Response, NextFunction, RequestHandler } from 'express';

// Asynchronous controller-এর টাইপ সংজ্ঞায়িত করা
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Higher-order function যা try-catch-এর কাজ স্বয়ংক্রিয়ভাবে করে
export const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };
};