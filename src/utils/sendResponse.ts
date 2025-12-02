import type { Response } from "express";

export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null,
  errors: any = null
) => {
  const success = status >= 200 && status < 300;

  return res.status(status).json({
    success,
    message,
    data,
    errors,
  });
};
