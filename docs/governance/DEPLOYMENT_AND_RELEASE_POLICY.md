# DEPLOYMENT AND RELEASE POLICY

## Production target

- `https://court-notes-site.vercel.app/`

## Before deployment

1. run `npm run gate:check`
2. confirm the deployment source branch
3. confirm the relevant pages locally
4. confirm whether the change affects formal routes or only non-formal routes

## After deployment

Record in `DEPLOYMENT_LEDGER.md`:

- date
- branch
- commit SHA
- environment
- deployment or release note
- checked routes
- result

## Important distinction

- Production shows what users currently see
- A local branch is not production until deployment is confirmed
