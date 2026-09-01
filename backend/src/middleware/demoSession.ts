import { Request, Response, NextFunction } from 'express';

export interface DemoContext {
  sessionId: string;
  userId: string;
  demoUser: {
    id: string;
    email: string;
    name: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      demo?: DemoContext;
    }
  }
}

const DEMO_USER_EMAIL = 'demo.customer@agentcart.io';
const DEMO_USER_NAME = 'Demo Customer';

const SESSION_HEADER = 'x-agentcart-session-id';
const USER_HEADER = 'x-agentcart-user-id';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function demoSessionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const sessionId = req.headers[SESSION_HEADER] as string | undefined || generateId('sess');
  const userId = req.headers[USER_HEADER] as string | undefined || '00000000-0000-0000-0000-000000000001';

  req.demo = {
    sessionId,
    userId,
    demoUser: {
      id: userId,
      email: DEMO_USER_EMAIL,
      name: DEMO_USER_NAME,
    },
  };

  next();
}
