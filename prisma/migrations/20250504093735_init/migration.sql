/*
  Warnings:

  - Added the required column `update_time` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `update_time` DATETIME(3) NOT NULL;
