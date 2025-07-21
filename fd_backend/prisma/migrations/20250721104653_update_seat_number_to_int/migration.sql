/*
  Warnings:

  - Changed the type of `seatNumber` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seatNumber",
ADD COLUMN     "seatNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_libraryId_seatNumber_key" ON "Seat"("libraryId", "seatNumber");
