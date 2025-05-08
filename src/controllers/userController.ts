import jwt from 'jsonwebtoken';

// Di dalam login handler
import { Request, Response } from 'express';

// Assuming you retrieve the user object from a database or request
const loginHandler = (req: Request, res: Response) => {
  const user = {
    id: '123', // Replace with actual user ID
    email: 'user@example.com', // Replace with actual user email
    role: 'user', // Replace with actual user role
  }; // Closing the user object properly
  const userToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token: userToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
};
