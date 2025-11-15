-- Migration: Add guessCount columns to UserSolved* tables
-- Date: 2025-11-15
-- Description: Adds guessCount tracking for all game types (champion, splash, item, oldItem, ability)

-- Add guessCount to UserSolvedChampions
ALTER TABLE `UserSolvedChampions` 
ADD COLUMN `guessCount` INT NOT NULL DEFAULT 0;

-- Add guessCount to UserSolvedSplashes
ALTER TABLE `UserSolvedSplashes` 
ADD COLUMN `guessCount` INT NOT NULL DEFAULT 0;

-- Add guessCount to UserSolvedItems
ALTER TABLE `UserSolvedItems` 
ADD COLUMN `guessCount` INT NOT NULL DEFAULT 0;

-- Add guessCount to UserSolvedOldItems
ALTER TABLE `UserSolvedOldItems` 
ADD COLUMN `guessCount` INT NOT NULL DEFAULT 0;

-- Add guessCount to UserSolvedAbilities
ALTER TABLE `UserSolvedAbilities` 
ADD COLUMN `guessCount` INT NOT NULL DEFAULT 0;
