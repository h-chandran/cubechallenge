# SkIntel - Ingredient-Centric Skincare App

A personalized skincare app that focuses on ingredient-level analysis, compatibility checking, and routine building.

## Features

- **Ingredient Analysis**: Check product ingredients for compatibility, sensitivities, and conflicts
- **Routine Builder**: Build personalized skincare routines with automatic compatibility validation
- **User Preferences**: Track ingredients you like, dislike, or are sensitive to
- **Function-Based Organization**: Routines organized by product function (cleanser, serum, moisturizer, etc.)
- **Conflict Detection**: Automatic warnings for incompatible ingredient combinations

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend/Auth**: Supabase (PostgreSQL + Authentication)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Styling**: CSS Modules + CSS Variables

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account (for backend and authentication)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Set up the database schema:
   - In your Supabase SQL editor, run:
   ```sql
   CREATE TABLE user_preferences (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     liked_ingredients TEXT[],
     disliked_ingredients TEXT[],
     sensitivities TEXT[],
     skin_type TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE routines (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT,
     products JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ingredients/     # Ingredient analysis components
│   └── routine/         # Routine builder components
├── pages/               # Page components
├── contexts/            # React contexts (Auth, UserPreferences)
├── services/            # Supabase client
├── data/                # Mock ingredient and product data
├── utils/               # Helper functions
└── styles/              # Global styles
```

## Key Features

### Ingredient Compatibility Rules

The app includes built-in compatibility rules for common ingredients:
- Vitamin C + Niacinamide: Should not be applied immediately together
- Vitamin C + AHA/BHA: Can cause irritation
- Retinol + Acids: Should not be used together

### Routine Building

Routines are automatically sorted by:
1. **Function order**: Cleanser → Toner → Exfoliant → Serum → Moisturizer → Sunscreen
2. **Step order**: Products are numbered sequentially

### User Preferences

Users can:
- Mark ingredients as "liked" (work well for their skin)
- Mark ingredients as "sensitive" (cause reactions)
- Set their skin type (oily, dry, combo, normal)

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Design Theme

- **Primary Colors**: Light blue (#E3F2FD) and white
- **Secondary Color**: Green (#4CAF50)
- **Accent**: Blue (#2196F3)

## Future Enhancements

- Community features (subreddit-style groups)
- Product integration (Oliveyoung API, affiliate links)
- Expanded ingredient database
- Advanced routine recommendations
- Product search and filtering

## License

MIT
