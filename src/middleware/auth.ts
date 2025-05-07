import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// Tambahkan tipe untuk req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(403).json({ error: 'Access Denied: No Token Provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      role: string
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid or Expired Token' })
  }
}
