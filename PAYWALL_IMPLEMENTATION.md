# Paywall Implementation Summary

## Overview
Implemented "5 free problems then paywall" system using Firebase Auth + Firestore.

## Files Created

### 1. `src/lib/usageService.ts`
Usage tracking and validation service with:
- `getUserProfile(uid)` - Reads user profile from Firestore
- `consumeUse(uid)` - Increments freeUsesUsed counter
- `hasProAccess(profile)` - Checks if user has Pro access
- `canUseFree(profile)` - Checks if user can use free tier (< 5 uses)

### 2. `src/components/PaywallModal.tsx`
Mobile-first paywall modal component featuring:
- "You've used X free problems" message
- Pro benefits list
- "Go Pro – $4.99/mo" CTA (TODO: Stripe integration)
- "Log in or create account" button for anonymous users
- Styled to fit within main white card container

### 3. `src/components/PaywallModal.css`
Clean, mobile-first styling for paywall modal with:
- Overlay with fade-in animation
- Centered modal with slide-up animation
- Pro benefits section with checkmarks
- Primary/secondary button styles
- Responsive layout

### 4. `firestore.rules`
Security rules ensuring:
- Users can only read/write their own documents
- Free users can only increment freeUsesUsed by 1
- Free usage count cannot exceed 5
- Pro users have no restrictions

## Files Modified

### 1. `src/lib/authService.ts`
**Added:**
- `signInAnonymously()` function wrapping Firebase anonymous auth

### 2. `src/context/AuthContext.tsx`
**Changed:**
- Auto sign-in anonymous users when no authenticated user exists
- Calls `ensureUserDoc()` for all users (anonymous + email)

### 3. `src/components/Results.jsx`
**Added:**
- Import `useAuth`, `PaywallModal`, and usage service functions
- State management for paywall visibility and remaining uses
- Usage check before problem analysis:
  1. Load user profile
  2. Check if has Pro access OR can use free
  3. If neither, show paywall and block
  4. Otherwise, consume a use and proceed
- Render `PaywallModal` when limits exceeded

## How It Works

### First-Time User Flow:
1. User visits app → AuthContext auto signs them in anonymously
2. `ensureUserDoc()` creates Firestore profile with `freeUsesUsed: 0`
3. User submits problem → Usage check passes (0 < 5)
4. `consumeUse()` increments counter to 1
5. Problem gets analyzed
6. Repeat for problems 2-5

### Paywall Flow (6th Problem):
1. User submits 6th problem
2. Profile shows `freeUsesUsed: 5`
3. `canUseFree(profile)` returns false (5 < 5 is false)
4. `hasProAccess(profile)` returns false (plan='free', subscription='inactive')
5. PaywallModal displays
6. User sees "Go Pro" or "Log in" options

### Pro User Flow:
1. User has `subscriptionStatus: 'active'` OR `plan: 'pro'`
2. `hasProAccess(profile)` returns true
3. Usage check always passes
4. No paywall shown

## Anonymous to Email Conversion
When anonymous user creates an account:
- Firebase automatically links accounts
- Existing Firestore doc persists with usage count
- No data loss

## TODO: Stripe Integration
Currently, "Go Pro" button redirects to `/pricing` placeholder.

Next steps:
1. Create pricing page
2. Integrate Stripe Checkout
3. Handle webhook to update `subscriptionStatus` and `plan`
4. Update `stripeCustomerId` field

## Firestore Security
Rules enforce:
- Self-service read/write only
- Usage increment validation (exactly +1, max 5 for free users)
- No tampering with usage counts

## Testing Checklist
- [ ] Anonymous user gets profile created automatically
- [ ] First 5 problems work without paywall
- [ ] 6th problem triggers paywall
- [ ] Paywall shows correct "uses remaining" count
- [ ] "Go Pro" button navigates to /pricing
- [ ] Email signup preserves anonymous user's usage count
- [ ] Pro users bypass paywall entirely
- [ ] Firestore rules block unauthorized access
