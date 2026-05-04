# Deploy a tag

Runbook for cutting a tagged deploy on AWS Amplify. Full design: [`../deploy-amplify.md`](../deploy-amplify.md).

## TL;DR

```bash
git tag v1.2.0
git push origin v1.2.0
```

~3 min later you'll have:

- A new Amplify branch served at `https://v1-2-0.<app-id>.amplifyapp.com` (dots and underscores become `-`, everything lowercased).
- A GitHub Release for `v1.2.0` with `**Deploy:** <url>` plus auto-generated notes (PRs/commits since the previous tag).

## Prerequisites

- Tag name matches the `v*` pattern — anything else is ignored by the workflow.
- The tagged commit isn't docs-only — `paths-ignore` on `README.md` and `docs/**` will skip the run.
- `main` is already green on Amplify (tag deploys don't depend on `main`, but it's a good sanity check).

## Steps

1. **Create the tag** from whatever commit you want snapshotted (usually `main`):

   ```bash
   git checkout main && git pull
   git tag v1.2.0
   # annotated is fine too: git tag -a v1.2.0 -m "Release v1.2.0"
   ```

2. **Push it:**

   ```bash
   git push origin v1.2.0
   ```

3. **Watch the run** at `Actions → Deploy to Amplify`. The workflow:
   - Resolves `branch=v1.2.0`, `subdomain=v1-2-0`, `stage=BETA`.
   - Auto-creates the Amplify branch if missing.
   - Builds, uploads `dist.zip`, polls until `SUCCEED`.
   - Writes `**Deploy:** <url>` + generated notes to the GitHub Release (creates the release if it doesn't exist).
   - Prunes older `v*` Amplify branches, keeping only the newest 3 by `createTime`.

4. **Grab the URL** from the release page (`Releases → v1.2.0`).

## Common scenarios

**Redeploy an existing tag.** `Actions → Deploy to Amplify → Run workflow → Use workflow from: v1.2.0`. The `**Deploy:**` line gets refreshed; the rest of the release body is preserved.

**Docs-only tag didn't deploy.** Expected — `paths-ignore` excludes `README.md` and `docs/**`. Force a deploy with `workflow_dispatch` on the tag.

**Release body has the wrong URL.** Edit manually:

```bash
gh release edit v1.2.0 --notes "**Deploy:** https://v1-2-0.<app-id>.amplifyapp.com"
```

Or delete the release and re-run `workflow_dispatch` on the tag — the workflow will recreate it with auto-generated notes.

**4th tag appears, 1st tag's URL 404s.** Expected — retention is 3 slots. The Amplify branch was pruned; the GitHub Release remains (Amplify branch ≠ GitHub Release). Re-run `workflow_dispatch` on the old tag to bring the slot back.

**Wrong commit got tagged.** Move the tag (`git tag -f v1.2.0 <sha> && git push --force origin v1.2.0`). Treat this as a last resort — tags are conventionally immutable.

## Rolling back

Run `workflow_dispatch` on the previous tag. The `main` slot is untouched.

## What this doesn't do

- Doesn't touch the custom domain — that's mapped to `main` only.
- Doesn't notify anything. The only artefact is the release body.
- Doesn't prune old GitHub Releases — only Amplify slots.
