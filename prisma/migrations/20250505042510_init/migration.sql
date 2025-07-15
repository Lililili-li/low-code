/*
  Warnings:

  - Added the required column `name` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `publish` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publish_time` DATETIME(3) NULL,
    ADD COLUMN `unpublish_time` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `avatar` VARCHAR(191) NULL DEFAULT 'https://vue.mtruning.club/static/png/person.png';

-- CreateTable
CREATE TABLE `project_page` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL,
    `project_id` INTEGER NULL,
    `page_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
