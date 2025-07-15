/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `user_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_account_key` ON `user`(`account`);
