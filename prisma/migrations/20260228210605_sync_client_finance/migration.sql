/*
  Warnings:

  - Added the required column `accountNumber` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientprofile` ADD COLUMN `accountNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NOT NULL;
