# TypeScript Support

This project now includes TypeScript support with a very permissive configuration to enable gradual migration.

## Configuration

### Backend (`backend/tsconfig.json`)
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Disabled (all strict checks turned off)
- **Allow JS**: Yes - JavaScript files are allowed alongside TypeScript
- **Check JS**: No - JavaScript files are not type-checked

### Frontend (`frontend/tsconfig.json`)
- **Target**: ES2020
- **Module**: ESNext (for Vite bundler)
- **JSX**: react-jsx
- **Strict Mode**: Disabled (all strict checks turned off)
- **Allow JS**: Yes - JavaScript files are allowed alongside TypeScript
- **Check JS**: No - JavaScript files are not type-checked

## Shared Types

Type definitions are located in:
- **Backend**: `backend/types/`
- **Frontend**: `frontend/src/types/`

### Available Types

#### Champion Types (`champion.ts`)
- `Champion` - Full champion entity with all properties
- `ChampionNameAndKey` - Simplified champion data
- `ChampionGuess` - Frontend-specific with match results

#### Item Types (`item.ts`)
- `Item` - Current item entity
- `OldItem` - Legacy item entity
- `ItemOption` - Frontend select option format

#### User Types (`user.ts`)
- `User` - Full user entity
- `UserStats` - User statistics for display
- `UserUpdate` - Update payload types
- `LeaderboardEntry` - Scoreboard data

#### Game Types (`game.ts`) - Frontend only
- `GameMode` - Type of game being played
- `GameState` - Current game state
- `GuessResult` - Result of a guess
- `GameSettings` - User preferences

#### API Types (`api.ts`)
- `ApiResponse<T>` - Generic API response wrapper
- `ApiErrorResponse` - Error response structure
- Specific response types for different endpoints

## Usage Examples

### Backend
```javascript
// You can import types in JSDoc comments for better IDE support
/**
 * @typedef {import('./types').Champion} Champion
 * @param {Champion} champion
 */
function processChampion(champion) {
  console.log(champion.name);
}
```

### Frontend
```typescript
import { Champion, GameState } from './types';

// Use in React components
const MyComponent: React.FC<{ champion: Champion }> = ({ champion }) => {
  return <div>{champion.name}</div>;
};
```

## Development Workflow

1. **Current State**: All JavaScript files continue to work as-is
2. **Type Safety**: TypeScript compiler is configured to not block on errors
3. **IDE Benefits**: You get autocomplete and IntelliSense even in JS files

## Gradual Migration Strategy

### Phase 1 (Complete) ✅
- ✅ TypeScript installed and configured
- ✅ Very permissive compiler options set
- ✅ Build tools work with TypeScript enabled
- ✅ Shared type definitions created

### Phase 2 (Future Work)
- Convert utility functions to TypeScript
- Add JSDoc types to existing JavaScript files
- Gradually enable stricter compiler options

### Phase 3 (Future Work)
- Convert React components to TypeScript (.tsx)
- Convert Express routes to TypeScript
- Enable `noImplicitAny` and other strict checks

## Type Checking

Run type checking without emitting files:

**Backend:**
```bash
cd backend
npx tsc --noEmit
```

**Frontend:**
```bash
cd frontend
npx tsc --noEmit
```

## Building

The existing build commands continue to work:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Testing

Tests continue to work with the existing setup. No changes required to test infrastructure.

## Notes

- The TypeScript configuration is intentionally very permissive to minimize friction
- All strict type checking is disabled to allow gradual adoption
- JavaScript and TypeScript files can coexist
- Type definitions provide IDE benefits even without converting to TypeScript
- Future work can progressively tighten the rules as the codebase stabilizes
- Some type definitions intentionally use `any` to maintain flexibility during the migration phase
- Index signatures in API response types allow backward compatibility with existing code
