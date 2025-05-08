import { Request, Response, NextFunction } from 'express'

interface CustomUser {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
  email: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: CustomUser;
}

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    next()
  }
}
