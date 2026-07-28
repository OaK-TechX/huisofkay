# Homelab alternate host (GitLab + Coolify)

Netlify is the primary host. This is the fallback/alternate on the homelab
cluster, deployed from the internal GitLab through Coolify as a Docker build.
It reads the same Neon database, so the catalog is identical to production.

## Status (prepared 2026-07-28)

Done autonomously and safe to hand off:
- App containerized: `Dockerfile` (Next 16 standalone) + `.dockerignore`.
  `next.config.ts` gates `output: "standalone"` behind `BUILD_STANDALONE=true`
  so the Netlify build is unaffected.
- Image build + run VERIFIED on VM 274: healthy, home renders the Neon
  catalog, `/admin` gates to login, `/watch/...` + PWA manifest serve 200.
  Image size ~272 MB.
- Pushed to the homelab GitLab: `git@gitlab.hm.iamkay.eu:kay/huisofkay.git`
  (branches `main` and `netflix-rebuild`, identical).

Left for an in-session go (changes homelab service/network state + needs a
Coolify login, so not done overnight):
- Create the Coolify app, set env, attach a domain + Traefik route + DNS.

## Facts you need

- Coolify primary: `http://10.0.10.80:8000` (API health = 200). UI is
  Authelia-gated at `https://coolify.hm.iamkay.eu`.
- Repo (internal): `git@gitlab.hm.iamkay.eu:kay/huisofkay.git`, branch `main`.
- Container listens on port `3000` (`HOSTNAME=0.0.0.0`).
- Neon DB endpoint is public EU-central and reachable from the homelab.
- Cover images are static (`public/media/...`) so they serve from the image.
  Admin image UPLOADS use Netlify Blobs and will NOT work on this host - that
  is fine for a read-mostly fallback; edit catalog text/covers from the
  Netlify-hosted admin, both hosts read the same Neon row.

## Steps in Coolify (v4)

1. Log in to `https://coolify.hm.iamkay.eu` (Authelia, then Coolify).
2. New Resource -> Private Repository (with GitHub App is GitHub-only; for our
   GitLab use the **Deploy Key** flow per `reference_coolify_v4_gitlab.md`):
   - Repository URL: `git@gitlab.hm.iamkay.eu:kay/huisofkay.git`
   - Coolify shows a deploy public key -> add it under the GitLab project
     Settings -> Repository -> Deploy keys (read access is enough).
   - Branch: `main`.
3. Build pack: **Dockerfile** (Coolify auto-detects the root `Dockerfile`).
4. Port: set the exposed port to `3000`.
5. Environment variables (Coolify -> the app -> Environment):
   - `DATABASE_URL`  = the Neon URL (copy from `~/dev/huisofkay/.env` on VM 274)
   - `AUTH_SECRET`   = the value in that same `.env`
   - `AUTH_TRUST_HOST` = `true`
   - `AUTH_URL`      = the public URL you attach in step 6
     (e.g. `https://huisofkay.hm.iamkay.eu`)
   - (do NOT set `BUILD_STANDALONE`; the Dockerfile sets it at build time)
6. Domain: internal-only fallback recommended first ->
   `huisofkay.hm.iamkay.eu`.
   - Coolify domain field: `http://huisofkay.hm.iamkay.eu` (Coolify wires the
     Traefik labels + LE via the shared wildcard).
   - Pi-hole: add `huisofkay.hm.iamkay.eu -> 10.0.10.29` (Traefik VIP) on both
     LXC 253 and 263, same pattern as every other service.
   - If you later want it publicly reachable as a true failover, add a CF
     Tunnel route (that is a separate, deliberate decision - keep it internal
     until you want it to be able to take over from Netlify).
7. Deploy. Watch the build logs; first build pulls node:20-alpine + installs
   deps (~1-2 min). Health = the Dockerfile `HEALTHCHECK` on `/`.
8. Verify: `https://huisofkay.hm.iamkay.eu` shows the same 8-world catalog as
   production, `/admin` gates to login.

## Fallback without Coolify (plain Docker on a node)

If Coolify is unavailable, the image runs anywhere Docker does:

```
git clone git@gitlab.hm.iamkay.eu:kay/huisofkay.git && cd huisofkay
docker build -t huisofkay:latest .
docker run -d --name huisofkay -p 3000:3000 --restart unless-stopped \
  -e DATABASE_URL="<neon-url>" -e AUTH_SECRET="<secret>" \
  -e AUTH_TRUST_HOST=true -e AUTH_URL="https://huisofkay.hm.iamkay.eu" \
  huisofkay:latest
```

Then point a Traefik dynamic route + Pi-hole record at that node:3000.
