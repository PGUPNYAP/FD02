// src/validators/paymentValidators.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for create order
// For quick testing, create a simple validator
export const validateCreateOrder = [
  (req: Request, res: Response, next: NextFunction) => {
    const { librarianId, studentId, amount } = req.body;
    
    if (!librarianId || !studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'librarianId, studentId, and amount are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    next();
  }
];

// Validation rules for webhook
export const validateWebhook = [
  body('event')
    .notEmpty()
    .withMessage('Event is required'),
  
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  
  body('student_id')
    .isUUID()
    .withMessage('Valid student ID is required'),
  
  body('librarianId')
    .isUUID()
    .withMessage('Valid librarian ID is required'),

  // Middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Webhook validation errors',
        errors: errors.array()
      });
    }
    next();
  }
];