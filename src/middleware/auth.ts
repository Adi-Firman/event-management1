import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// Middleware untuk autentikasi JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] // Mengambil token dari header Authorization

  if (!token) {
    return res.status(403).json({ error: 'Access Denied: No Token Provided' })
  }

  // Verifikasi token JWT
  jwt.verify(token, process.env.JWT_SECRET || '', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or Expired Token' })
    }
    
    // Menambahkan informasi user ke request
    req.user = user
    next()
  })
}
