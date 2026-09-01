import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      sendData: <T>(data: T, meta?: Record<string, unknown>) => void;
      sendCreated: <T>(data: T, location?: string) => void;
      sendDeleted: () => void;
    }
  }
}

export function responseWrapper(_req: Request, res: Response, next: NextFunction): void {
  res.sendData = function <T>(data: T, meta?: Record<string, unknown>) {
    const payload: { success: boolean; data: T; meta?: Record<string, unknown> } = {
      success: true,
      data,
    };
    if (meta && Object.keys(meta).length > 0) {
      payload.meta = meta;
    }
    return this.status(200).json(payload);
  };

  res.sendCreated = function <T>(data: T, location?: string) {
    if (location) {
      this.set('Location', location);
    }
    return this.status(201).json({
      success: true,
      data,
    });
  };

  res.sendDeleted = function () {
    return this.status(200).json({
      success: true,
      data: null,
    });
  };

  next();
}
