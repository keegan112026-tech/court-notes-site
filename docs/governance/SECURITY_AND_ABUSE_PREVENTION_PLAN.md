# Security And Abuse Prevention Plan

Updated: 2026-03-31

## 1. Why this phase exists

The site now has working flows for:
- workspace article submission
- article comments
- likes
- moderation review
- anonymous contact intake

That means the next major production risk is no longer missing product logic. It is abuse, misuse, and weak permission boundaries.

## 2. Primary risk areas

### 2.1 Submission spam
- repeated article submissions
- repeated anonymous contact messages
- scripted comment posting

### 2.2 Engagement manipulation
- scripted likes
- rapid repeated requests from the same device or IP
- future ranking distortion

### 2.3 Moderation risk
- weak admin access control
- lack of role separation between owner and reviewer
- insufficient audit trail if multiple admins join later

### 2.4 Content safety risk
- malicious HTML or unsafe markup in article content
- abusive or irrelevant content in comments
- accidental publication of identifying details

### 2.5 Data-layer risk
- over-permissive Firestore rules
- clients updating protected fields directly
- unbounded write/read access patterns

## 3. What is already in place

- Firebase is now the primary backend.
- Pending/approved moderation status exists for articles and comments.
- `/admin` and `/api/admin` are guarded by a token-backed admin session flow.
- Admin session now supports named accounts and `owner` / `reviewer` roles.
- Delete actions in moderation are restricted to `owner`.
- Review actions write audit records to `reviewLogs`.
- Route-specific rate limiting now exists for:
  - comments
  - article submissions
  - likes
  - contact submissions
- Admin login is now rate-limited as well.
- Firestore rules have been hardened to a server-only baseline.
- Article HTML now goes through server-side sanitization before storage, and is sanitized again before render.
- Basic security headers are now sent site-wide:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Main public flows no longer depend on legacy Notion-first publication logic.

## 4. What should happen next

### Phase A: access hardening
- Move from shared-token access to stronger account authentication.
- Keep owner / reviewer role separation and extend it into a more durable admin identity model.
- Preserve per-action attribution from authenticated admin identity.

### Phase B: Firestore rules
- Restrict direct client writes to protected fields.
- Ensure article/comment `status`, `reviewedBy`, `reviewedAt`, and `reviewNote` are admin-only fields.
- Prevent public clients from directly mutating likes if the final like flow remains API-mediated.

### Phase C: anti-abuse protections
- Strengthen rate limiting per route:
  - `/api/comments`
  - `/api/submit-article`
  - `/api/contact`
  - `/api/like`
- Add bot friction on public write routes:
  - Turnstile or CAPTCHA for comments/submissions/contact
- Add stronger duplicate-like protection beyond local storage.

### Phase D: content safety
- Re-check article HTML sanitization policy.
- Validate citation markup shape before storing or rendering.
- Add moderation helpers for identifying likely doxxing or unsafe identifying content.

### Phase E: monitoring
- Add abuse-oriented logs for suspicious spikes.
- Track repeated failed admin login attempts.
- Track abnormal write volume by route.

## 5. Recommended implementation order

1. Admin auth + owner/reviewer role model
2. Firestore rules hardening
3. Public write-route rate limit review
4. CAPTCHA / bot protection
5. Like anti-abuse strengthening
6. Monitoring and alerting

## 6. Notes for future AI

- Do not treat current admin token flow as final security.
- Do not expose moderation routes publicly without stronger auth.
- Do not loosen Firestore rules for convenience in production.
- Keep the product logic unchanged:
  - local JSON for sessions/transcripts
  - Firebase for hot interaction data
  - public article layer only for approved workspace submissions
