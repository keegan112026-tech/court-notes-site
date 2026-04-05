# Firebase Setup Checklist

Updated: 2026-03-31

## What is already done
- Firebase Admin service account has been connected to `.env.local`.
- The backend provider can now switch to Firebase.
- Local APIs already read Firebase first and will gracefully fall back to empty data if Firestore is not ready.

## What still needs to be done in Firebase Console
1. Open your Firebase project.
2. Go to `Build -> Firestore Database`.
3. Click `Create database`.
4. Choose a region and create the default Firestore database.
5. After Firestore exists, return to the repo and run:

```bash
npm run firebase:seed
```

## What the seed command does
- Imports starter CMS content
- Imports starter approved article data
- Imports starter article comments
- Imports starter contact examples

## Security deployment step
After the app logic is verified, also deploy the Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Current rule posture:
- direct client Firestore reads: blocked
- direct client Firestore writes: blocked
- expected production path: Next.js server APIs via Firebase Admin SDK

Source file:
- `firebase-schema-example.json`

## Important distinction
- The Web SDK config is for browser-side Firebase usage.
- The service account JSON is for server-side `firebase-admin`.
- For this project's backend migration, the service account is the one that matters.
