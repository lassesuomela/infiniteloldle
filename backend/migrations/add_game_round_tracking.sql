-- Migration: Add detailed game round and guess tracking
-- Date: 2026-09-12
-- Description: Adds GameRound and GameGuess tables for per-game analytics

CREATE TABLE `GameRound` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `gameType` VARCHAR(20) NOT NULL,
  `targetId` INT NOT NULL,
  `targetVariantId` INT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'in_progress',
  `startedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `endedAt` DATETIME(0) NULL,
  `guessCount` INT NOT NULL DEFAULT 0,
  `patchVersion` VARCHAR(20) NULL,
  `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  INDEX `GameRound_userId_startedAt_idx`(`userId`, `startedAt`),
  INDEX `GameRound_gameType_startedAt_idx`(`gameType`, `startedAt`),
  INDEX `GameRound_gameType_targetId_idx`(`gameType`, `targetId`),
  INDEX `GameRound_status_startedAt_idx`(`status`, `startedAt`),
  CONSTRAINT `GameRound_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `GameGuess` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gameRoundId` INT NOT NULL,
  `guessNumber` INT NOT NULL,
  `guessId` INT NOT NULL,
  `guessedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `isCorrect` BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `GameGuess_gameRoundId_guessNumber_key`(`gameRoundId`, `guessNumber`),
  INDEX `GameGuess_guessId_guessedAt_idx`(`guessId`, `guessedAt`),
  CONSTRAINT `GameGuess_gameRoundId_fkey`
    FOREIGN KEY (`gameRoundId`) REFERENCES `GameRound`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);
