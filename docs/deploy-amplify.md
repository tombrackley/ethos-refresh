# Design: Deploy Ethika Ethos to AWS Amplify Hosting

**Status:** Draft
**Owner:** leon@ethikagroup.com.au
**Last updated:** 2026-04-20

## 1. Goals

- Deploy this Vite + React SPA to AWS Amplify Hosting.
- Builds run in **GitHub Actions**, not Amplify's managed build — we keep the build pipeline in-repo and push the compiled `dist/` to Amplify.
- **Single tenant** (the default `VITE_TENANT`). Multi-tenant is not in scope.
- **Custom domain** served over HTTPS with an Amplify-managed ACM certificate.
- **Multi-branch deploys** are a stretch goal: same workflow, branch-scoped preview URLs.

## 2. Non-goals

- No server-side rendering, functions, or backend resources (Amplify Gen 2 data/auth). This is static hosting only.
- No migration of the existing Vercel deployment in this doc — both can coexist until cutover.
- No Amplify-managed build (we intentionally do **not** connect the repo to Amplify's Git integration).

## 3. Architecture

```
GitHub (push to main)
      │
      ▼
GitHub Actions  ── npm ci ──▶ npm run build ──▶ dist/ ──▶ dist.zip
      │                                                      │
      │  CI IAM user creds (secrets)                          │
      │  → sts:AssumeRole → TerraformCI (reused)              │
      ▼                                                      ▼
AWS STS (temp creds) ────────────▶ Amplify API: create-deployment
                                         │
                                         ▼
                            Upload zip to presigned S3 URL
                                         │
                                         ▼
                            Amplify API: start-deployment
                                         │
                                         ▼
                      Amplify CDN (d1xxxx.amplifyapp.com + custom domain)
```

Why this shape:

- **Auth matches `ethos-agent`.** Same pattern — CI IAM user in GH secrets assumes a scoped role. Consistent across Ethika repos; keys rotate in one place.
- **Build in CI, deploy artifact only.** Amplify's manual-deploy API accepts a zip of the built assets. We avoid Amplify's build environment entirely — no `amplify.yml`, no surprises from base-image drift.
- **One Amplify app, many branches.** Amplify supports multiple branches per app, each with its own URL. Multi-branch deploys drop in later without restructuring.

## 4. Prerequisites (one-time setup)

All AWS work lives in the **`testing` AWS account** (same account `ethos-agent`'s testing environment deploys into). Recorded here so the next person can reproduce.

### 4.1 Create the Amplify app (in the testing account)

```bash
# Configure CLI profile against the testing account first, or pass --profile.
aws amplify create-app \
  --name ethika-ethos \
  --platform WEB \
  --region ap-southeast-2
# → capture appId, e.g. d1abcd2345efgh
```

Note: **do not** connect a repository. Leave it as a manual-deploy app.

### 4.2 Create the main branch inside the app

```bash
aws amplify create-branch \
  --app-id $APP_ID \
  --branch-name main \
  --stage EXPERIMENTAL
```

### 4.3 Add the SPA rewrite rule

Our app has no React Router today, but future deep links require `index.html` fallback. Mirrors `vercel.json`. Without this, Amplify serves its static 404 for any path other than `/` — e.g. refreshing `/resources` 404s even though the app is static.

Apply via CLI (what we actually did):

```bash
AWS_PROFILE=testing aws amplify update-app \
  --app-id $APP_ID \
  --region ap-southeast-2 \
  --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>","target":"/index.html","status":"200"}]'
```

Or console → App settings → Rewrites and redirects → add:

| Source | Target | Type |
| ------ | ------ | ---- |
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|webp)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

The negative lookahead preserves real static assets — `/assets/index-abc.js`, `/favicon.ico`, source maps, fonts, etc. are served as-is; everything else falls through to `index.html`. Takes effect at the edge immediately, no redeploy needed. `update-app` replaces `customRules` wholesale, so re-running the command with additional rules requires passing the full array.

### 4.4 IAM: reuse `ethos-agent`'s generic deploy role

We follow the same auth pattern as `ethos-agent`: GitHub Actions holds long-lived IAM user credentials in repo secrets, and the user assumes a scoped role for each deploy. We reuse `ethos-agent`'s existing generic deploy role, **`TerraformCI`**, rather than standing up a dedicated `AmplifyDeploy` role. Rationale: it's already provisioned, already trusted by the CI user, already used for testing-account deploys — one less piece of infra to maintain.

Tradeoff: `TerraformCI` is broadly permissioned, so an Amplify deploy runs with more privileges than it strictly needs. Acceptable for this prototype; revisit if the app moves to a dedicated production account.

**Nothing to create.** One thing to check:

- Confirm `TerraformCI` has the Amplify actions we use — `amplify:CreateDeployment`, `amplify:StartDeployment`, `amplify:GetJob`, `amplify:CreateBranch`, `amplify:GetBranch`, `amplify:DeleteBranch`, `amplify:ListBranches`. If it's `*`-scoped or already carries `amplify:*`, we're done. If not, attach an inline policy with just those actions on `arn:aws:amplify:ap-southeast-2:<TESTING-ACCOUNT-ID>:apps/<APP_ID>/*`.

### 4.5 GitHub repo configuration

Repository → Settings → Secrets and variables → Actions. Names match `ethos-agent` so a future composite action can be shared.

Create a GitHub **environment** named `testing` (Settings → Environments → New) and put the account-scoped values there. That way any future `uat` / `prod` environment has its own `AWS_ACCOUNT_ID` without overwriting this one — mirrors `ethos-agent`'s per-environment pattern.

**Repo-level secrets** (same CI user across all environments):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**`testing` environment variables:**

- `AWS_ACCOUNT_ID` — the testing account ID
- `AWS_REGION` — `ap-southeast-2`
- `AMPLIFY_APP_ID`
- `AMPLIFY_DEPLOY_ROLE` — `TerraformCI` (reused from `ethos-agent`)

## 5. GitHub Actions workflow

New file: `.github/workflows/deploy-amplify.yml`. Mirrors `ethos-agent/.github/workflows/deploy-*.yml` for auth; adds the Amplify-specific deploy steps.

Triggers: `push: [main]` (which covers PR merges, since a merge produces a push to `main`) plus manual dispatch for testing. `paths-ignore` skips runs when only `README.md` or anything under `docs/` changes — docs edits don't need a deploy. Caveat: the filter applies to tag pushes too, so tagging a docs-only commit won't deploy; use `workflow_dispatch` on that tag to force one.

```yaml
name: Deploy to Amplify

on:
  push:
    branches: [main]
    paths-ignore:
      - 'README.md'
      - 'docs/**'
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false  # don't cancel a deploy mid-flight

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: testing
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build
      # Lint omitted from the deploy gate for now — the repo has pre-existing
      # lint errors. Re-add `- run: npm run lint` once the backlog is clean
      # (§9 open question).

      - uses: aws-actions/configure-aws-credentials@v6
        with:
          aws-access-key-id:     ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          role-to-assume:        arn:aws:iam::${{ vars.AWS_ACCOUNT_ID }}:role/${{ vars.AMPLIFY_DEPLOY_ROLE }}
          role-session-name:     amplify-deploy
          aws-region:            ${{ vars.AWS_REGION }}

      - name: Package dist
        run: (cd dist && zip -rq ../dist.zip .)

      - name: Deploy to Amplify
        env:
          APP_ID: ${{ vars.AMPLIFY_APP_ID }}
          BRANCH: ${{ github.ref_name }}
        run: |
          set -euo pipefail
          RESP=$(aws amplify create-deployment --app-id "$APP_ID" --branch-name "$BRANCH")
          JOB_ID=$(echo "$RESP" | jq -r .jobId)
          UPLOAD_URL=$(echo "$RESP" | jq -r .zipUploadUrl)

          curl --fail --silent --show-error \
               -H "Content-Type: application/zip" \
               --upload-file dist.zip "$UPLOAD_URL"

          aws amplify start-deployment \
            --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID"

          # Poll until done — fail the workflow if Amplify fails.
          for i in $(seq 1 60); do
            STATUS=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" \
              --query 'job.summary.status' --output text)
            echo "Amplify job $JOB_ID: $STATUS"
            case "$STATUS" in
              SUCCEED)  exit 0 ;;
              FAILED|CANCELLED) exit 1 ;;
            esac
            sleep 10
          done
          echo "Timed out waiting for Amplify deploy"; exit 1
```

Notes:

- **Auth mirrors `ethos-agent`**: CI user's access keys → `sts:AssumeRole` into `AmplifyDeploy`. Same action version (`configure-aws-credentials@v6`), same variable/secret shape.
- We poll `get-job` so a red CI run maps to a failed Amplify deploy — not just a successful API call.
- `concurrency` serializes deploys per-branch so two pushes don't race on the same branch.
- **Composite action?** `ethos-agent` factored auth into `.github/actions/setup-deploy`. With only one workflow here, inlining is fine. If Ethika grows a shared composite action at org level, swap it in then — the inputs already match.

## 6. Custom domain

Single production domain, e.g. `ethos.ethikagroup.com.au`.

### 6.1 Add the domain in Amplify

Console → App → Domain management → Add domain:

1. Enter root domain (e.g. `ethikagroup.com.au`).
2. Map subdomain `ethos` → branch `main`.
3. Skip the `www.` redirect unless needed.

Amplify provisions an ACM certificate in `us-east-1` (CloudFront requirement) and gives two sets of DNS records.

### 6.2 DNS records (external DNS, e.g. Cloudflare / GoDaddy)

**If the domain is NOT in Route53**, add at the registrar:

| Type    | Name                    | Value                                              | Purpose             |
| ------- | ----------------------- | -------------------------------------------------- | ------------------- |
| `CNAME` | `_<token>.ethos`        | `_<validation>.acm-validations.aws`                | ACM cert validation |
| `CNAME` | `ethos`                 | `d1abcd2345efgh.cloudfront.net` (Amplify-supplied) | Serves the app      |

Amplify surfaces the exact values on the domain page; copy them verbatim.

**If the domain IS in Route53**, tick "Amplify manages your DNS" and it provisions both records automatically.

### 6.3 Apex domain

Apex (`ethikagroup.com.au` with no subdomain) cannot be a `CNAME` per DNS rules. Options:

- Host DNS in Route53 and use an `ALIAS` record — cleanest.
- Keep apex on a separate service and use `ethos.ethikagroup.com.au` as the Amplify target.

Recommend the subdomain approach for this prototype to avoid migrating DNS.

### 6.4 Propagation

Cert issue + CloudFront propagation usually completes within 15–30 minutes. Status visible in the Amplify console. Until then, the Amplify-supplied `d1....amplifyapp.com` URL continues to work.

## 7. Multiple deploy targets (optional)

"Deploy multiple branches" really means: deploy from several kinds of refs — long-lived env branches, release branches, tags, possibly PRs. This section covers all of them.

### 7.1 Mental model: Amplify "branch" ≠ git ref

An Amplify *branch* is just a named deployment slot with its own URL and stage. It doesn't have to match a git branch 1:1. The workflow is responsible for picking which Amplify branch a given ref deploys into.

Example mapping:

| Git ref                  | Amplify branch | Stage          | URL                                                  |
| ------------------------ | -------------- | -------------- | ---------------------------------------------------- |
| `refs/heads/main`        | `main`         | `EXPERIMENTAL` | `ethos.ethikagroup.com.au` (custom) / `main.<app>…`  |
| `refs/heads/staging`     | `staging`      | `BETA`         | `staging.<app>.amplifyapp.com`                       |
| `refs/heads/release/1.2` | `release-1-2`  | `BETA`         | `release-1-2.<app>.amplifyapp.com`                   |
| `refs/tags/v1.2.0`       | `v1.2.0`       | `BETA`         | `v1-2-0.<app>.amplifyapp.com` (tag = per-tag preview; URL appended to GitHub Release body) |
| `pull_request` #42       | `pr-42`        | `PULL_REQUEST` | `pr-42.<app>.amplifyapp.com`                         |

Stage is metadata — all entries here sit in the testing AWS account, so `EXPERIMENTAL` is the honest label for the canonical `main` target. Tag slots run at `BETA` since each is a snapshot rather than a production promotion. If the app ever gets promoted to a dedicated prod account, the `main` row flips to `PRODUCTION`.

Three rules fall out:

- **Branch name sanitisation.** Amplify branch names must match `^[A-Za-z0-9._-]+$` (no slashes), so `release/1.2` → `release-1-2`. Tag names like `v1.2.0` pass through unchanged. **URL subdomains are stricter** (DNS label rules): Amplify lowercases and replaces dots and underscores with `-`, so branch `v1.2.0` is served at `v1-2-0.<app>.amplifyapp.com`. The workflow computes both — `branch` for Amplify API calls, `subdomain` for the URL posted to GitHub Releases.
- **Tags are per-tag preview slots.** A tag push creates a new Amplify branch named after the tag (e.g. `v1.2.0`) with its own `*.amplifyapp.com` URL. `main` keeps deploying to the `main` slot independently — tags do not touch it.
- **Tag URL is posted to the GitHub Release.** After a successful tag deploy, the workflow writes the Amplify URL into the release body (create-or-update). On first deploy it also attaches GitHub's auto-generated release notes (diff of PRs/commits since the previous tag). On redeploys of the same tag, the body is preserved — only the `**Deploy:**` line is kept current.

### 7.2 Workflow changes

Extend the triggers and add a ref-resolution step:

```yaml
on:
  push:
    branches: [main, staging, 'release/**']
    tags:    ['v*']
    paths-ignore:
      - 'README.md'
      - 'docs/**'
  pull_request:
    types: [opened, synchronize, reopened, closed]
  workflow_dispatch:
    inputs:
      target_branch:
        description: "Amplify branch to deploy into"
        required: true

jobs:
  deploy:
    if: github.event_name != 'pull_request' || github.event.action != 'closed'
    runs-on: ubuntu-latest
    permissions:
      contents: write  # gh release create/edit on tag pushes
    steps:
      # … checkout, setup-node, build, configure-aws-credentials as before …

      - name: Resolve Amplify target
        id: target
        run: |
          set -euo pipefail
          case "${{ github.event_name }}" in
            push)
              RAW="${{ github.ref_name }}"
              SAFE="${RAW//\//-}"
              echo "branch=$SAFE" >> "$GITHUB_OUTPUT"
              # Amplify URL subdomain is stricter than branch name.
              SUB="${SAFE,,}"; SUB="${SUB//./-}"; SUB="${SUB//_/-}"
              echo "subdomain=$SUB" >> "$GITHUB_OUTPUT"
              if [[ "${{ github.ref_type }}" == "tag" ]]; then
                # Each tag gets its own preview slot.
                echo "stage=BETA" >> "$GITHUB_OUTPUT"
              elif [[ "$SAFE" == "main" ]]; then
                echo "stage=EXPERIMENTAL" >> "$GITHUB_OUTPUT"
              else
                echo "stage=BETA" >> "$GITHUB_OUTPUT"
              fi ;;
            pull_request)
              echo "branch=pr-${{ github.event.number }}" >> "$GITHUB_OUTPUT"
              echo "stage=PULL_REQUEST" >> "$GITHUB_OUTPUT" ;;
            workflow_dispatch)
              echo "branch=${{ inputs.target_branch }}" >> "$GITHUB_OUTPUT"
              echo "stage=BETA" >> "$GITHUB_OUTPUT" ;;
          esac

      - name: Ensure Amplify branch exists
        env:
          APP_ID: ${{ vars.AMPLIFY_APP_ID }}
          BRANCH: ${{ steps.target.outputs.branch }}
          STAGE:  ${{ steps.target.outputs.stage }}
        run: |
          aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH" \
            || aws amplify create-branch --app-id "$APP_ID" --branch-name "$BRANCH" --stage "$STAGE"

      # … then the same create-deployment / upload / start-deployment / poll loop,
      # using BRANCH=${{ steps.target.outputs.branch }} instead of github.ref_name.

      - name: Annotate GitHub Release with deploy URL
        if: github.event_name == 'push' && github.ref_type == 'tag'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG: ${{ github.ref_name }}
          URL: https://${{ steps.target.outputs.branch }}.${{ vars.AMPLIFY_APP_ID }}.amplifyapp.com
        run: |
          set -euo pipefail
          DEPLOY_LINE="**Deploy:** $URL"
          if EXISTING=$(gh release view "$TAG" --json body -q .body 2>/dev/null); then
            # Release exists — preserve body, refresh only the Deploy line.
            if grep -q '^\*\*Deploy:\*\*' <<< "$EXISTING"; then
              BODY=$(sed "s|^\*\*Deploy:\*\*.*|$DEPLOY_LINE|" <<< "$EXISTING")
            else
              BODY=$(printf '%s\n\n%s\n' "$DEPLOY_LINE" "$EXISTING")
            fi
            gh release edit "$TAG" --notes "$BODY"
          else
            # First deploy for this tag — auto-generate release notes (diff of
            # PRs/commits since previous tag) and prepend the Deploy link.
            NOTES=$(gh api -X POST "repos/$GITHUB_REPOSITORY/releases/generate-notes" \
              -f tag_name="$TAG" --jq .body)
            BODY=$(printf '%s\n\n%s\n' "$DEPLOY_LINE" "$NOTES")
            gh release create "$TAG" --title "$TAG" --notes "$BODY"
          fi

      - name: Prune old tag deploy slots (keep newest 3)
        if: github.event_name == 'push' && github.ref_type == 'tag'
        env:
          APP_ID: ${{ vars.AMPLIFY_APP_ID }}
        run: |
          set -euo pipefail
          # Amplify has no native branch-retention policy — we enforce
          # "keep newest 3 tag slots" here, ordered by createTime descending.
          # Filters on `v` prefix so `main` and other non-tag branches are
          # excluded; adjust if the tag pattern changes.
          OLD=$(aws amplify list-branches --app-id "$APP_ID" \
                  --query 'sort_by(branches[?starts_with(branchName, `v`)], &createTime)[::-1].branchName' \
                  --output text | tr '\t' '\n' | tail -n +4)
          for b in $OLD; do
            echo "Pruning old tag slot: $b"
            aws amplify delete-branch --app-id "$APP_ID" --branch-name "$b"
          done

  cleanup_pr:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AMPLIFY_DEPLOY_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}
      - run: aws amplify delete-branch --app-id ${{ vars.AMPLIFY_APP_ID }} --branch-name "pr-${{ github.event.number }}"
```

### 7.3 Enabling patterns selectively

The trigger list above is the maximal case. For v1, keep only `push: [main]` and add more as needed:

- **+ staging env**: add `staging` to `push.branches`.
- **+ release previews**: add `'release/**'` and `workflow_dispatch`.
- **+ per-tag preview deploys**: add `push.tags: ['v*']`. Each tag auto-provisions its own Amplify branch; the generated URL subdomain transforms dots/underscores to `-` (e.g. `v1.2.0` → `v1-2-0.<app>.amplifyapp.com`) and that URL is written back to the GitHub Release body. `main` keeps deploying independently to the `main` slot. Retention: workflow prunes older tag slots after each deploy, keeping only the newest 3.
- **+ PR previews**: add the `pull_request` trigger and the `cleanup_pr` job.

### 7.4 IAM scope

The role policy in §4.4 already uses `apps/<APP_ID>/*` so it covers any branch under this app — no change needed when adding new targets.

### 7.5 Caveats

- **Cost**: each active Amplify branch is a separate CDN origin and bills per GB served + build-minute. Cap PR previews with the `cleanup_pr` job; periodically prune stale `release-*` branches.
- **Custom domains**: only the `main` (or `production`) branch gets the custom domain. Other targets stay on `*.amplifyapp.com` unless you explicitly add subdomain mappings (`staging.ethos.ethikagroup.com.au` → `staging` branch).
- **No native lifecycle policy on Amplify branches.** Unlike S3 or ECR, Amplify Hosting doesn't offer built-in branch retention or TTL. Retention is enforced in the workflow: after each tag deploy, older tag slots beyond the newest 3 are deleted with `amplify:DeleteBranch`. Alternative would be a scheduled workflow (cron), but bundling it into the deploy run avoids a second workflow to maintain.
- **Tag semantics**: if a tag is force-pushed (don't), Amplify redeploys from whatever the tag now points at and the release body is preserved. Treat tags as immutable.

Out of scope for v1: ship `push: [main]` only, then enable whichever of the above we actually need.

## 8. Phases and tasks

Work is split into phases so each one ends at a checkpoint that's independently verifiable. Phases 0–3 are the MVP; 4 is cleanup; 5 is optional extensions.

Legend: **(ops)** = AWS console / CLI work · **(repo)** = code change · **(decision)** = question to answer before proceeding.

### Phase 0 — Decisions (blocks all other work)

Answer these before touching infra. All captured in §9.

- [x] **AWS account.** Testing account (same as `ethos-agent` testing deploys).
- [x] **Region.** `ap-southeast-2`.
- [ ] **(decision)** Target custom domain / subdomain and DNS owner.
- [ ] **(decision)** Lint gate on deploy: block or warn?
- [ ] **(decision)** Vercel retention: keep as fallback, or remove after cutover?
- [x] **IAM role.** Reuse `ethos-agent`'s `TerraformCI` — no new role.

**Exit criterion:** remaining three answers written back into §9.

### Phase 1 — AWS setup in the testing account (one-time)

- [ ] **(ops)** Configure local AWS CLI profile against the testing account (or confirm access to the Amplify console there).
- [ ] **(ops)** Create Amplify app in testing: `aws amplify create-app --name ethika-ethos --platform WEB --region ap-southeast-2`. Capture `appId`.
- [ ] **(ops)** Create `main` Amplify branch (`create-branch --app-id $APP_ID --branch-name main --stage EXPERIMENTAL`).
- [x] **(ops)** Add SPA rewrite rule on the app (§4.3). Applied 2026-04-20 via `amplify update-app` against `d15vjb4ypvnxde` in `testing`.
- [ ] **(ops)** Verify `TerraformCI` has Amplify permissions in the testing account. Quickest check — assume the role locally and run `aws amplify list-apps`. If denied, attach the inline policy described in §4.4.

**Exit criterion:** assuming `TerraformCI` with the CI user's keys, `aws amplify get-app --app-id $APP_ID` returns the app.

### Phase 1b — GitHub setup

- [ ] **(repo)** Create GitHub environment `testing` (Settings → Environments). No protection rules needed yet; can add required reviewers later.
- [ ] **(repo)** Add **repo-level** secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (same values as `ethos-agent`).
- [ ] **(repo)** Add **environment-level** variables on `testing`: `AWS_ACCOUNT_ID` (testing account ID), `AWS_REGION` (`ap-southeast-2`), `AMPLIFY_APP_ID`, `AMPLIFY_DEPLOY_ROLE` (`TerraformCI`).

**Exit criterion:** the `testing` GH environment shows all four variables; repo shows both secrets.

### Phase 2 — Core deploy pipeline (MVP)

- [x] **(repo)** Add `.github/workflows/deploy-amplify.yml`. Triggers: `push: [main]` + `workflow_dispatch`. Lint step intentionally omitted (§9).
- [x] **(repo)** Commit + push the workflow.
- [x] **(ops)** Trigger via **Actions → Deploy to Amplify → Run workflow** (or push to `main`).
- [x] **(ops)** Fix auth (trust policy on target role in testing account updated to allow the CI user).
- [x] **(ops)** Verify job succeeds end-to-end. First green run: `workflow_dispatch` in 56s; first push-triggered in 47s.
- [ ] **(ops)** Load `https://main.<appId>.amplifyapp.com` — app renders, no console errors.
- [ ] **(ops)** Smoke-test SPA rewrite: hit a non-root path (once routing lands) and hard-refresh; should serve `index.html`.
- [ ] **(ops)** Confirm a merge to `main` from a real PR also fires the workflow (push test covers the mechanism; tick once exercised).

**Exit criterion:** pushing to `main` reliably deploys within ~3 min and the Amplify URL serves the latest commit.

### Phase 3 — Custom domain

- [ ] **(ops)** In Amplify console → Domain management → Add domain. Map subdomain → `main` branch.
- [ ] **(ops)** Add DNS records at registrar (ACM validation CNAME + CloudFront CNAME). Copy values verbatim from Amplify.
- [ ] **(ops)** Wait for cert issue + CloudFront propagation (15–30 min).
- [ ] **(ops)** Verify HTTPS works on custom domain and redirects are sane.
- [ ] **(ops)** Smoke-test the full app on the custom domain (auth flows if any, key pages, static assets).

**Exit criterion:** the agreed custom domain serves the app over HTTPS and status in Amplify console shows "Available".

### Phase 4 — Cutover & cleanup

- [ ] **(comms)** Share the new URL with stakeholders; retire old share links.
- [ ] **(repo)** Update `README.md` with the new deploy URL and a one-line "how to deploy" pointer to this doc.
- [ ] **(decision outcome)** If Vercel is being retired: remove `vercel.json`, disable Vercel project. Otherwise leave untouched and note in README it's a fallback.

**Exit criterion:** only one canonical deployed URL exists (or both are intentionally documented) and the README reflects reality.

### Phase 5 — Multiple deploy targets (optional, pick à la carte)

Each bullet is independent. Only pick up what we actually need.

- [ ] **Staging env**: add `staging` to `push.branches`, create `staging` Amplify branch, optionally wire `staging.<domain>` subdomain.
- [ ] **Release-branch previews**: add `'release/**'` to `push.branches`; rely on auto-create in the workflow (§7.2).
- [ ] **Per-tag preview deploys**: add `push.tags: ['v*']`; each tag gets its own `*.amplifyapp.com` URL, and the URL plus auto-generated release notes are written to the GitHub Release body on first deploy. Requires `permissions: contents: write` on the deploy job (for `gh release create`/`edit`). Workflow also prunes older tag slots after each deploy (retain newest 3). `main` continues to deploy to the `main` slot.
- [ ] **PR previews**: add `pull_request` trigger and the `cleanup_pr` job; optionally post preview URL as a PR comment.
- [ ] **Branch hygiene**: cron / scheduled workflow to `delete-branch` any Amplify branch not touched in N days.

**Exit criterion (per item):** the trigger deploys to the expected Amplify branch and tears down (where applicable) when the ref goes away.

## 9. Open questions

- ~~**AWS account & region.**~~ Decided: testing account, `ap-southeast-2`.
- **Domain.** `ethos.ethikagroup.com.au` is a placeholder — confirm the real hostname and who controls its DNS.
- **Lint gate.** Currently omitted — repo has 28 pre-existing ESLint errors that would block every deploy. Decide: fix the backlog and re-enable gate, or keep off permanently?
- **Vercel status.** Keep as fallback, or delete `vercel.json` once Amplify is live?
- ~~**IAM role reuse.**~~ Decided: reuse `ethos-agent`'s `TerraformCI`. Revisit if/when the app moves to a dedicated prod account.
- **CI IAM user.** Presumably reuse the `ethos-agent` CI user — confirm it's acceptable to share keys across repos.
- ~~**Tag deploy release-body format.**~~ Decided: auto-create the release; on first deploy the body is `**Deploy:** <url>` + GitHub auto-generated release notes (diff of PRs/commits since the previous tag); on redeploys preserve the body and refresh only the `**Deploy:**` line.
- ~~**Tag slot retention.**~~ Decided: keep the newest 3 tag slots; the workflow prunes older ones after each tag deploy via `amplify:DeleteBranch`. No native Amplify lifecycle policy exists. Requires `amplify:ListBranches` on `TerraformCI` (added to §4.4).
