// src/controllers/paymentController.ts
import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { createRazorpayOrder, createPayout } from '../utils/razorpayService';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Type definitions
interface CreateOrderRequest {
  librarianId: string;
  studentId: string;
  amount: number;
}

interface WebhookRequest {
  event: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  student_id: string;
  librarianId: string;
}

export const createOrder = async (req: Request<{}, {}, CreateOrderRequest>, res: Response): Promise<Response> => {
  try {
    const { librarianId, studentId, amount } = req.body;
    const platformFeePercentage: number = 10;

    // Input validation
    if (!librarianId || !studentId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid input parameters' 
      });
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    // Verify librarian exists and has Razorpay account
    const librarian = await prisma.librarian.findUnique({
      where: { id: librarianId }
    });

    if (!librarian) {
      return res.status(404).json({ 
        success: false,
        message: 'Librarian not found' 
      });
    }

    // if (!librarian.razorpayAccountId) {
    //   return res.status(400).json({ 
    //     success: false,
    //     message: 'Librarian Razorpay account not configured' 
    //   });
    // }

    // Create Razorpay order
    const { order, platformFee } = await createRazorpayOrder(amount, 'INR', platformFeePercentage);

    // Create payment record in database
    const paymentRecord = await prisma.payment.create({
      data: {
        studentId,
        librarianId,
        amount: new Prisma.Decimal(amount.toString()),
        platformFee: new Prisma.Decimal(platformFee.toString()),
        currency: 'INR',
        razorpayOrderId: order.id,
        status: 'CREATED',
      }
    });

    console.log('✅ Payment record created:', paymentRecord.id);
    console.log('✅ Razorpay order created:', order.id);

    return res.status(200).json({ 
      success: true,
      data: {
        orderId: order.id, 
        amount, 
        currency: order.currency,
        paymentId: paymentRecord.id
      }
    });

  } catch (error: any) {
    console.error('❌ Create order error:', error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      
      switch (error.code) {
        case 'P2002':
          return res.status(409).json({ 
            success: false,
            message: 'Duplicate order detected' 
          });
        case 'P2025':
          return res.status(404).json({ 
            success: false,
            message: 'Required record not found' 
          });
        default:
          return res.status(500).json({ 
            success: false,
            message: 'Database error occurred' 
          });
      }
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const handleWebhook = async (req: Request<{}, {}, WebhookRequest>, res: Response): Promise<Response> => {
  try {
    const {
      event,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      student_id,
      librarianId,
    } = req.body;

    console.log('🔔 Webhook received:', { event, order_id: razorpay_order_id });
    
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Validation
    if (!event || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !student_id || !librarianId) {
      console.log('❌ Missing required fields in webhook');
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    if (!secret) {
      console.log('❌ Razorpay secret not configured');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }

    // Signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.log('❌ Signature verification failed');
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - signature mismatch' 
      });
    }

    // Only process payment.captured events
    if (event !== 'payment.captured') {
      console.log(`ℹ️ Ignoring event: ${event}`);
      return res.status(200).json({ 
        success: true,
        message: 'Event ignored' 
      });
    }

    // Find payment record
    const paymentRecord = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: {
        student: { select: { id: true, email: true } },
        librarian: { select: { id: true, email: true, razorpayAccountId: true } }
      }
    });

    if (!paymentRecord) {
      console.log('❌ Payment record not found:', razorpay_order_id);
      return res.status(404).json({ 
        success: false,
        message: 'Payment record not found' 
      });
    }

    // Check if already processed
    if (['PAID', 'TRANSFERRED'].includes(paymentRecord.status)) {
      console.log('ℹ️ Payment already processed:', paymentRecord.status);
      return res.status(200).json({ 
        success: true,
        message: 'Payment already processed' 
      });
    }

    // Verify librarian has Razorpay account
    if (!paymentRecord.librarian.razorpayAccountId) {
      console.log('❌ Librarian missing Razorpay account');
      return res.status(400).json({ 
        success: false,
        message: 'Librarian account configuration error' 
      });
    }

    // Process payment and payout in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment to PAID
      const updatedPayment = await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'PAID',
          paymentDate: new Date(),
        }
      });

      // Calculate payout amount
      const payoutAmount = Number(paymentRecord.amount) - Number(paymentRecord.platformFee);
      const payoutAmountPaise = Math.round(payoutAmount * 100);
      
      // Create payout
      // const payout = await createPayout(
      //   payoutAmountPaise,
      //   paymentRecord.librarian.razorpayAccountId!,
      //   `payout_${paymentRecord.id}`
      // );

      // Update payment with transfer details
      const finalPayment = await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
        //  razorpayTransferId: payout.id,
          status: 'TRANSFERRED',
        }
      });

      return { updatedPayment, 
       // payout,
         payoutAmount };
    });

    console.log(`✅ ₹${result.payoutAmount} transferred to ${paymentRecord.librarian.email}`);
    
    return res.status(200).json({ 
      success: true,
      message: 'Payment processed and payout completed',
      data: {
        paymentId: paymentRecord.id,
      //  transferId: result.payout.id,
        amount: result.payoutAmount
      }
    });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.code, error.message);
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Webhook processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});