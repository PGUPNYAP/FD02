/*
  Warnings:

  - A unique constraint covering the columns `[razorpayAccountId]` on the table `Librarian` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Librarian" ADD COLUMN     "aadhaarNumber" TEXT,
ADD COLUMN     "accountHolderName" TEXT,
ADD COLUMN     "addressProofType" TEXT,
ADD COLUMN     "addressProofUrl" TEXT,
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankIfsc" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "kycRejectedAt" TIMESTAMP(3),
ADD COLUMN     "kycSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "kycVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "razorpayAccountId" TEXT,
ADD COLUMN     "razorpayAccountStatus" TEXT,
ADD COLUMN     "razorpayKycFailureReason" TEXT,
ADD COLUMN     "razorpayKycStatus" TEXT;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "area" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpayTransferId" TEXT,
ADD COLUMN     "transferMeta" JSONB,
ADD COLUMN     "transferStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Librarian_razorpayAccountId_key" ON "Librarian"("razorpayAccountId");
