# Guess Count Tracking Implementation

## Overview
This implementation adds Redis-based guess count tracking for all game types in Infiniteloldle. The system tracks how many guesses it takes each user to solve each puzzle, stores the data in Redis during gameplay, and persists it to the database upon successful completion.

## Features

### 1. Redis-Based Counting
- Real-time guess counting using Redis INCR operation
- Temporary storage during active gameplay
- Automatic cleanup after puzzle completion or reroll
- No database writes until puzzle is solved (performance optimization)

### 2. Database Persistence
- `guessCount` field added to all UserSolved* tables
- Final count saved only when puzzle is solved correctly
- Historical data available for analytics and statistics

### 3. Supported Game Types
- Champion guessing game
- Splash art recognition game
- Item identification game
- Legacy item identification game
- Ability recognition game

## Architecture

### Redis Key Structure
All Redis keys are generated through centralized helper functions located in `backend/helpers/redisKeys.js`:

```javascript
const GuessCountKeys = {
  champion: (userId) => `userId:${userId}:champion:guessCount`,
  splash: (userId) => `userId:${userId}:splash:guessCount`,
  item: (userId) => `userId:${userId}:item:guessCount`,
  oldItem: (userId) => `userId:${userId}:oldItem:guessCount`,
  ability: (userId) => `userId:${userId}:ability:guessCount`,
};
```

### Data Flow

```
User Makes Guess
    ↓
Increment Redis Counter (INCR)
    ↓
Guess Correct?
    ├─ No  → Return feedback to user
    └─ Yes → Get count from Redis
             ↓
             Save count to database
             ↓
             Delete Redis key
             ↓
             Assign new puzzle
```

### Reroll Flow

```
User Requests Reroll
    ↓
Assign New Puzzle
    ↓
Delete Redis Counter
    ↓
Fresh Start (count = 0)
```

## Implementation Details

### Modified Files

#### Cache Layer (`backend/cache/cache.js`)
Added methods:
- `increment(key, ttlInSeconds)` - Atomic increment operation
- `getGuessCount(key)` - Retrieve current count with default 0

#### Helper Functions (`backend/helpers/redisKeys.js`)
New file providing centralized key generation:
- `GuessCountKeys.champion(userId)`
- `GuessCountKeys.splash(userId)`
- `GuessCountKeys.item(userId)`
- `GuessCountKeys.oldItem(userId)`
- `GuessCountKeys.ability(userId)`

#### Controllers
All guess controllers updated:
- `championController.js` - Champion and Ability games
- `itemController.js` - Item game
- `oldItemController.js` - Legacy Item game
- `userController.js` - Reroll endpoints

Each guess endpoint now:
1. Increments Redis counter before processing guess
2. Retrieves count from Redis on correct guess
3. Saves count to database with solution
4. Deletes Redis key after saving

Each reroll endpoint now:
1. Deletes Redis key when assigning new puzzle

#### Database Schema (`backend/prisma/schema.prisma`)
Updated all UserSolved* models:
```prisma
model UserSolvedChampions {
  userId     Int
  championId Int
  guessCount Int       @default(0)  // NEW FIELD
  // ... rest of fields
}
```

Same for:
- `UserSolvedSplashes`
- `UserSolvedItems`
- `UserSolvedOldItems`
- `UserSolvedAbilities`

#### User Model (`backend/models/v2/user.js`)
Updated all `addSolved*` methods to accept `guessCount` parameter:
```javascript
async addSolvedChampion(userId, championId, guessCount = 0) {
  return prisma.userSolvedChampions.create({
    data: { userId, championId, guessCount },
  });
}
```

## Database Migration

### Automatic Migration (Development)
```bash
npx prisma db push
```

### Manual Migration (Production)
```bash
mysql -u root -p loldle < migrations/add_guess_count.sql
```

The migration adds `guessCount INT NOT NULL DEFAULT 0` to all UserSolved* tables.

## Testing

### Test Suite (`backend/tests/guessCount.test.js`)
Comprehensive test coverage including:
1. Redis counter increments on wrong guesses
2. Counter increments multiple times correctly
3. Final count saved to database on correct guess
4. Redis key deleted after saving to database
5. Counter resets on reroll action

### Running Tests
```bash
npm test
```

## API Behavior

### No Breaking Changes
- All existing API endpoints maintain backward compatibility
- Response formats unchanged
- New field only visible in database queries

### Performance Impact
- Minimal overhead (Redis operations are sub-millisecond)
- Reduced database writes (only on solve, not per guess)
- Better scalability than database-only approach

## Security Considerations

- ✅ CodeQL scan passed with 0 alerts
- ✅ No SQL injection vulnerabilities
- ✅ Redis keys scoped per user
- ✅ Input validation maintained
- ✅ No sensitive data in Redis keys

## Maintenance

### Changing Key Format
All key generation is centralized in `backend/helpers/redisKeys.js`. To change the key format:
1. Update the `generateGuessCountKey` function
2. All controllers automatically use new format
3. No need to search/replace across files

### Adding New Game Types
To add guess counting to a new game type:
1. Add new key function to `GuessCountKeys` object
2. Add `guessCount` field to UserSolved* table
3. Update model `addSolved*` method
4. Increment Redis in guess endpoint
5. Save count on correct guess
6. Reset on reroll

## Future Enhancements

Possible improvements:
- Average guess count analytics dashboard
- Leaderboards based on guess efficiency
- Difficulty ratings based on average guesses
- Historical trends and insights
- Per-puzzle guess statistics

## Dependencies

- `ioredis`: Redis client (already in use)
- `ioredis-mock`: Testing Redis functionality (already in use)
- No new dependencies added

## Rollback Plan

If issues arise, rollback is simple:
1. Remove `guessCount` column from database tables
2. Revert to previous git commit
3. No data loss for existing functionality
