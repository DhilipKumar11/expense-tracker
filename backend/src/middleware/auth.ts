import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { config } from '../config/env'

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    _id: string
    email: string
    role: 'user' | 'admin'
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
      return
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any
      req.user = decoded
      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      })
      return
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      })
      return
    }

    next()
  }
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      try {
        const decoded = jwt.verify(token, config.jwtSecret) as any
        req.user = decoded
      } catch (error) {
        // Token is invalid, but we don't throw error for optional auth
      }
    }

    next()
  } catch (error) {
    next()
  }
}


