---
name: Supabase Integration Architecture
overview: Comprehensive architecture plan for integrating Supabase into SkIntel, covering authentication, database schema, data persistence, and service layer design.
todos:
  - id: setup-supabase
    content: Set up Supabase project, configure environment variables, and test connection
    status: pending
  - id: enhance-schema
    content: Create enhanced database schema with all required tables (check_ins, fingerprint_insights, user_products, etc.) and RLS policies
    status: pending
    dependencies:
      - setup-supabase
  - id: auth-integration
    content: Replace mock authentication in AuthContext.jsx with Supabase Auth, including session management and error handling
    status: pending
    dependencies:
      - setup-supabase
  - id: service-layer
    content: Create service layer files (checkinService.js, routineService.js, fingerprintService.js) with CRUD operations
    status: pending
    dependencies:
      - enhance-schema
  - id: context-updates
    content: Update existing contexts and create new ones (CheckinContext, RoutineContext) to use Supabase services
    status: pending
    dependencies:
      - service-layer
      - auth-integration
  - id: component-integration
    content: Update components (Checkin.jsx, RoutineBuilder.jsx, Fingerprint.jsx, Dashboard.jsx) to use new contexts and services
    status: pending
    dependencies:
      - context-updates
  - id: migration-script
    content: Create one-time migration script to move localStorage data to Supabase for existing users
    status: pending
    dependencies:
      - enhance-schema
  - id: testing-validation
    content: Test all flows (auth, check-ins, routines, fingerprint), validate RLS policies, and handle edge cases
    status: pending
    dependencies:
      - component-integration
---

# Supabase Integration Architecture for SkIntel

## Overview

This plan outlines a complete Supabase integration architecture for SkIntel, replacing mock authentication and localStorage with a production-ready backend. The integration will enable real user accounts, persistent data storage, and scalable features.

## Current State Analysis

**Already Integrated:**

- `@supabase/supabase-js` package installed
- Basic `supabase.js` service file exists
- `UserPreferencesContext` already uses Supabase for preferences
- Schema file (`supabase-schema.sql`) with basic tables

**Needs Integration:**

- Authentication (currently mock/localStorage)
- Check-ins (currently localStorage)
- Routines (schema exists but not used)
- Fingerprint insights (currently mock data)
- Products database (optional enhancement)
- Community/circles (optional enhancement)

## Database Schema Design

### Core Tables

#### 1. **user_preferences** (Already exists)

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users, UNIQUE)
- liked_ingredients: TEXT[]
- disliked_ingredients: TEXT[]
- sensitivities: TEXT[]
- skin_type: TEXT (oily, dry, combo, normal)
- created_at, updated_at: TIMESTAMP
```

#### 2. **routines** (Schema exists, needs implementation)

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- name: TEXT (e.g., "Morning Routine", "Evening Routine")
- time_of_day: TEXT (AM/PM)
- products: JSONB (array of product objects with function, order)
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

#### 3. **check_ins** (New table needed)

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- date: DATE
- breakout: INTEGER (0-3)
- irritation: INTEGER (0-3)
- dryness: INTEGER (0-3)
- redness: INTEGER (0-3)
- tried_something_new: BOOLEAN
- products_used: JSONB (array of product IDs used that day)
- notes: TEXT
- created_at: TIMESTAMP
```

#### 4. **fingerprint_insights** (New table needed)

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- ingredient_id: TEXT
- insight_type: TEXT (likely_works, possible_trigger, avoid)
- confidence: TEXT (high, medium, low)
- reason: TEXT
- calculated_at: TIMESTAMP
- created_at, updated_at: TIMESTAMP
```

#### 5. **products** (Optional - for product database)

```sql
- id: UUID (PK)
- name: TEXT
- brand: TEXT
- function: TEXT (cleanser, serum, etc.)
- ingredients: TEXT[]
- description: TEXT
- image_url: TEXT
- created_at, updated_at: TIMESTAMP
```

#### 6. **user_products** (New - user's personal product library)

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- product_id: UUID (FK to products, nullable)
- name: TEXT (for custom products)
- brand: TEXT
- function: TEXT
- ingredients: TEXT[]
- notes: TEXT
- created_at, updated_at: TIMESTAMP
```

#### 7. **circles** (Optional - for community features)

```sql
- id: UUID (PK)
- name: TEXT
- description: TEXT
- matching_criteria: JSONB (ingredient fingerprints)
- member_count: INTEGER
- created_at: TIMESTAMP
```

#### 8. **circle_memberships** (Optional)

```sql
- id: UUID (PK)
- circle_id: UUID (FK to circles)
- user_id: UUID (FK to auth.users)
- joined_at: TIMESTAMP
```

### Row Level Security (RLS) Policies

All tables should have RLS enabled with policies ensuring:

- Users can only read/write their own data
- Public read access for reference data (products, ingredients)
- Community features with appropriate sharing policies

## Architecture Components

### 1. Authentication Layer

**File: `src/contexts/AuthContext.jsx`**

Replace mock authentication with Supabase Auth:

```javascript
// Current: Mock auth with localStorage
// Proposed: Supabase Auth with session management

Key Changes:
- Use supabase.auth.signUp(), signIn(), signOut()
- Listen to auth state changes with supabase.auth.onAuthStateChange()
- Store session in context, sync with localStorage for persistence
- Handle email confirmation, password reset flows
- Support OAuth providers (Google, etc.) if needed
```

**Authentication Flow:**

```
User Action → Supabase Auth API → Session Token → 
AuthContext Update → Protected Routes → User Data Load
```

### 2. Service Layer

**New File: `src/services/checkinService.js`**

- `createCheckin(userId, checkinData)` - Save daily check-in
- `getCheckins(userId, dateRange)` - Retrieve check-in history
- `getCheckinStats(userId)` - Aggregate statistics

**New File: `src/services/routineService.js`**

- `saveRoutine(userId, routineData)` - Persist routine
- `getRoutines(userId)` - Load user's routines
- `updateRoutine(routineId, updates)` - Update routine
- `deleteRoutine(routineId)` - Remove routine

**New File: `src/services/fingerprintService.js`**

- `calculateFingerprint(userId)` - Analyze check-ins and generate insights
- `getFingerprintInsights(userId)` - Retrieve current insights
- `updateInsightConfidence(insightId, confidence)` - Manual adjustments

**New File: `src/services/productService.js`** (Optional)

- `searchProducts(query)` - Search product database
- `addUserProduct(userId, productData)` - Add to personal library
- `getUserProducts(userId)` - Get user's product collection

### 3. Context Updates

**AuthContext.jsx Changes:**

- Replace mock signIn/signUp with Supabase calls
- Add session management
- Add loading states for auth operations
- Handle auth errors gracefully

**UserPreferencesContext.jsx:**

- Already uses Supabase ✓
- May need error handling improvements

**New Context: `src/contexts/CheckinContext.jsx`**

- Manage check-in state
- Load check-in history
- Provide check-in creation/update functions

**New Context: `src/contexts/RoutineContext.jsx`**

- Manage routine state
- Load/save routines from Supabase
- Sync with local state for offline support

### 4. Component Integration Points

**Pages to Update:**

1. **Login.jsx / Signup.jsx**

   - Already structured correctly
   - Just need AuthContext to use Supabase

2. **Checkin.jsx**

   - Replace `localStorage.setItem('checkins')` with `checkinService.createCheckin()`
   - Load check-in history on mount

3. **RoutineBuilder.jsx**

   - Add save/load functionality
   - Persist routine changes to Supabase
   - Load saved routines on mount

4. **Fingerprint.jsx**

   - Replace `mockUserInsights` with `fingerprintService.getFingerprintInsights()`
   - Trigger fingerprint recalculation after check-ins

5. **Dashboard.jsx**

   - Load real check-in statistics
   - Show actual routine data
   - Display real insights

## Data Flow Architecture

### Authentication Flow

```
User Login → Supabase Auth → Session Token → 
AuthContext → User ID → Load User Data (Preferences, Routines, etc.)
```

### Check-in Flow

```
User Submits Check-in → checkinService.createCheckin() → 
Supabase Insert → Trigger Fingerprint Recalculation → 
Update Fingerprint Insights → Refresh Dashboard
```

### Routine Flow

```
User Builds Routine → RoutineBuilder State → 
User Saves → routineService.saveRoutine() → 
Supabase Upsert → Load on Next Visit
```

### Fingerprint Calculation Flow

```
Check-in Created → Database Trigger / Function → 
Analyze Check-in History → Calculate Ingredient Correlations → 
Store Insights in fingerprint_insights table → 
Update UI via Context
```

## Environment Configuration

**File: `.env`** (Create if doesn't exist)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**File: `.env.example`** (Template)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Database Functions & Triggers

### PostgreSQL Functions

**Function: `calculate_fingerprint_insights(user_id UUID)`**

- Analyzes user's check-in history
- Correlates ingredient usage with skin reactions
- Generates confidence scores
- Inserts/updates fingerprint_insights table

**Function: `get_user_statistics(user_id UUID)`**

- Aggregates check-in data
- Returns skin health trends
- Calculates ingredient effectiveness

### Triggers

**Trigger: `on_checkin_insert`**

- After check-in insert, automatically trigger fingerprint recalculation
- Update user statistics

## Migration Strategy

### Phase 1: Authentication

1. Update `AuthContext.jsx` to use Supabase Auth
2. Test login/signup flows
3. Migrate existing demo users (if any)

### Phase 2: Check-ins

1. Create `check_ins` table
2. Implement `checkinService.js`
3. Update `Checkin.jsx` to use service
4. Migrate localStorage check-ins to Supabase (one-time script)

### Phase 3: Routines

1. Enhance `routines` table schema if needed
2. Implement `routineService.js`
3. Update `RoutineBuilder.jsx` to persist routines
4. Add routine loading on app start

### Phase 4: Fingerprint Insights

1. Create `fingerprint_insights` table
2. Implement calculation logic (client or server-side)
3. Update `Fingerprint.jsx` to use real data
4. Set up automatic recalculation

### Phase 5: Enhanced Features (Optional)

1. Product database
2. Community/circles features
3. Advanced analytics

## Security Considerations

1. **RLS Policies**: All user data tables must have RLS enabled
2. **API Keys**: Never expose service role key in client
3. **Input Validation**: Validate all user inputs before database operations
4. **Rate Limiting**: Consider Supabase rate limits for free tier
5. **Data Privacy**: Ensure user data is properly isolated

## Performance Optimizations

1. **Indexing**: Add indexes on frequently queried columns (user_id, date)
2. **Caching**: Cache user preferences and routines in context
3. **Pagination**: Implement pagination for check-in history
4. **Real-time**: Use Supabase Realtime for live updates (optional)

## Error Handling

All service functions should:

- Return consistent `{ data, error }` format
- Handle network errors gracefully
- Provide user-friendly error messages
- Log errors for debugging

## Testing Considerations

1. Test authentication flows (login, signup, logout)
2. Test RLS policies (users can't access other users' data)
3. Test data persistence across sessions
4. Test offline behavior (if implementing offline support)

## File Structure

```
src/
├── services/
│   ├── supabase.js (exists, needs env vars)
│   ├── checkinService.js (new)
│   ├── routineService.js (new)
│   ├── fingerprintService.js (new)
│   └── productService.js (new, optional)
├── contexts/
│   ├── AuthContext.jsx (update)
│   ├── UserPreferencesContext.jsx (already uses Supabase)
│   ├── CheckinContext.jsx (new)
│   └── RoutineContext.jsx (new)
└── utils/
    └── migration.js (one-time localStorage migration script)
```

## Next Steps

1. Set up Supabase project and get credentials
2. Run enhanced schema SQL in Supabase SQL editor
3. Configure environment variables
4. Implement services layer
5. Update contexts to use services
6. Update components to use new contexts
7. Test end-to-end flows
8. Deploy and monitor