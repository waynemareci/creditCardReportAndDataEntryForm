# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Financial Account Manager web application built with Next.js 15 that allows users to track credit card accounts, manage balances, make payments, and view financial summaries. The application is transitioning from localStorage-based storage to MongoDB/Mongoose for data persistence.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

The development server runs at http://localhost:3000

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom print styles
- **State Management**: React useState/useEffect hooks (client-side only)
- **Main Page**: `app/page.tsx` contains all UI logic in a single-file architecture with three main components:
  - `AccountForm`: Form for adding/editing accounts
  - `AccountTable`: Sortable table with account data, totals, and export functionality
  - `Home`: Main component managing state and CRUD operations

### Backend Architecture
- **API Routes**: Next.js API routes in `app/api/accounts/`
  - `GET/POST /api/accounts` - Fetch all accounts or create new account
  - `PUT/DELETE /api/accounts/[id]` - Update or delete specific account
  - `POST /api/accounts/migrate` - Migrate data from localStorage to MongoDB
- **Database**: MongoDB with Mongoose ODM
  - Connection utility: `lib/mongodb.js`
  - Account model: `models/Account.js`
- **Data Model**: See `app/types.ts` for TypeScript interfaces

### Key Features
- CRUD operations for financial accounts
- Sortable columns in account table
- Payment tracking functionality
- CSV export and print functionality
- Account reordering (up/down positioning)
- Utilization percentage calculations
- Summary row with totals for credit limits, amounts owed, and minimum payments

### Current State & Known Issues
- The application is in a **transitional state** between localStorage and MongoDB
- `app/page.tsx` still uses localStorage for persistence (see `saveAccounts` at line 662)
- The `fetchAccounts` function (line 650) calls `/api/accounts` but the API is not fully integrated
- User authentication is not implemented - API routes use hardcoded `'current-user-id'` placeholder
- MongoDB connection requires `MONGODB_URI` environment variable (not committed to repo)

### Data Model
The `Account` interface (app/types.ts) includes:
- Required: `id`, `accountName`, `creditLimit`, `position`
- Optional: `accountNumber`, `amountOwed`, `minimumMonthlyPayment`, `interestRate`, `rateExpiration`, `rewards`, `lastUsed`

### Path Aliases
The project uses `@/*` to reference the root directory (configured in tsconfig.json).

## Working with this Codebase

When modifying account-related functionality:
1. Update the TypeScript interface in `app/types.ts`
2. Update the Mongoose schema in `models/Account.js`
3. Modify form fields in the `AccountForm` component (app/page.tsx)
4. Update table columns in the `AccountTable` component (app/page.tsx)

When working with the database:
- Ensure MongoDB connection is established before any database operations
- All API routes should validate and handle errors appropriately
- Consider adding proper user authentication before production deployment

When modifying styles:
- Global styles and print media queries are in `app/globals.css`
- The application has extensive print styling for account reports
- Tailwind v4 is used with PostCSS configuration
