/*
  Warnings:

  - You are about to drop the column `availability` on the `workerprofile` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `workerprofile` DROP FOREIGN KEY `WorkerProfile_userId_fkey`;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `jobId` VARCHAR(191) NOT NULL,
    MODIFY `comment` TEXT NULL;

-- AlterTable
ALTER TABLE `workerprofile` DROP COLUMN `availability`,
    MODIFY `cnicEncrypted` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `WorkerProfile` ADD CONSTRAINT `WorkerProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
