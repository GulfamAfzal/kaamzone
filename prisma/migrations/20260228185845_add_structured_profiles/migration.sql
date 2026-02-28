/*
  Warnings:

  - You are about to drop the column `city` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `workerprofile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnicNumber]` on the table `WorkerProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `district` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tehsil` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnicNumber` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tehsil` to the `WorkerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `workerprofile` DROP FOREIGN KEY `WorkerProfile_userId_fkey`;

-- AlterTable
ALTER TABLE `application` ADD COLUMN `message` TEXT NULL;

-- AlterTable
ALTER TABLE `job` DROP COLUMN `city`,
    ADD COLUMN `district` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `tehsil` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `workerprofile` DROP COLUMN `city`,
    ADD COLUMN `accountNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `cnicNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `district` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `tehsil` VARCHAR(191) NOT NULL,
    MODIFY `cnicEncrypted` TEXT NULL;

-- CreateTable
CREATE TABLE `ClientProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `cnicNumber` VARCHAR(191) NOT NULL,
    `cnicPhoto` TEXT NULL,
    `province` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `tehsil` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ClientProfile_userId_key`(`userId`),
    UNIQUE INDEX `ClientProfile_cnicNumber_key`(`cnicNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `WorkerProfile_cnicNumber_key` ON `WorkerProfile`(`cnicNumber`);

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerProfile` ADD CONSTRAINT `WorkerProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
