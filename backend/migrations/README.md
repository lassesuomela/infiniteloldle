# Database Migrations

This directory contains SQL migration scripts for updating the database schema.

## Running Migrations

### Option 1: Using Prisma (Recommended for development)
```bash
npx prisma db push
```

### Option 2: Manual SQL Migration (For production)
```bash
mysql -u root -p loldle < migrations/add_guess_count.sql
```

## Available Migrations

### add_guess_count.sql
**Date:** 2025-11-15  
**Description:** Adds `guessCount` column to all UserSolved* tables to track how many guesses it took to solve each puzzle.

**Affected Tables:**
- UserSolvedChampions
- UserSolvedSplashes
- UserSolvedItems
- UserSolvedOldItems
- UserSolvedAbilities

**Changes:**
- Adds `guessCount INT NOT NULL DEFAULT 0` to each table

**Safe to Run:** Yes, uses ADD COLUMN with DEFAULT value, won't affect existing data.

### add_game_round_tracking.sql
**Date:** 2026-09-12  
**Description:** Adds `GameRound` and `GameGuess` tables for detailed per-round/per-guess tracking.

**Affected Tables:**
- GameRound
- GameGuess

**Changes:**
- Adds per-round status/timing/target tracking
- Adds per-guess sequential logging with uniqueness on `(gameRoundId, guessNumber)`
- Adds analytics-oriented indexes for user, game type, status, and guess lookups

**Safe to Run:** Yes, creates new tables only and does not modify existing solved-target tables.
