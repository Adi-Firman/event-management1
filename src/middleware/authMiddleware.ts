// src/middleware/authMiddleware.ts
import jwt from 'jsonwebtoken'

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1] // Ambil token dari header Authorization

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return res.status(500).json({ error: 'JWT_SECRET is not defined in .env' })
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user // Simpan user dalam request
    next()
  })
}
