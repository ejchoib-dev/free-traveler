# Deployment Checklist

## Overview

This document outlines the deployment requirements and configuration for the Traveler application on Vercel and Supabase. All items must be verified before production deployment.

---

## Phase 1: Pre-Deployment Verification

### 1.1 Environment Variables

#### Vercel Dashboard Configuration

Required environment variables in Vercel project settings:

```
# External Services
FLIGHT_OUTBOUND_URL=https://skyscanner.co.kr
HOTEL_OUTBOUND_URL=https://booking.com
MOFA_SAFETY_URL=https://www.mofa.go.kr/www/brd/m_4797/list.do

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PUBLIC_ANON_KEY]

# Supabase (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
```

**Verification:**
- [ ] All URLs are HTTPS
- [ ] URLs match allowed hosts in source code
- [ ] Service Role Key is marked as "Sensitive" and not exposed to browser
- [ ] Anon Key is marked as "Shared" but contains only public permissions
- [ ] No secrets are committed to Git

#### Build Environment Variables

For Vercel build step, ensure:

```bash
# Can be set in Vercel UI under "Environment Variables"
NODE_ENV=production
SKIP_ENV_VALIDATION=false
```

### 1.2 Supabase Configuration

#### RLS (Row Level Security) Policies

- [ ] All 6 tables have RLS enabled
- [ ] Auth table: Only users can read/update own profile
- [ ] Mate Post table: Public read, authenticated write
- [ ] Mate Application table: Participants can read/write own applications
- [ ] Block List: Users can manage own blocks
- [ ] Report table: Admins only
- [ ] Admin URL Settings table: Admins only

#### Database Schema

- [ ] All migrations from `DB-SCHEMA-BASE` applied
- [ ] RLS policies from `DB-RLS-BASE` in place
- [ ] Test data from `DB-SEED-BASE` loaded for development
- [ ] Production data cleared or anonymized before deployment

#### Authentication

- [ ] PKCE flow enabled in Supabase Auth settings
- [ ] Email provider configured
- [ ] Password reset email templates configured
- [ ] Email verification disabled (optional, based on requirements)

### 1.3 Security Checks

#### Client-Side Bundle Analysis

```bash
# Run after build to verify no secrets in bundle
npm run build
npx bundles-analyzer ./out
```

Verify:
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in bundle
- [ ] No hardcoded API keys or passwords in bundle
- [ ] Sensitive environment variables prefixed with `NEXT_PUBLIC_` only for public data

#### HTTPS/TLS

- [ ] Vercel provides free TLS by default (no configuration needed)
- [ ] Domain uses HTTPS-only redirect
- [ ] No mixed content warnings in browser DevTools
- [ ] SSL certificate auto-renews (Vercel handles)

#### Secret Rotation

- [ ] Service Role Key in `.env.local` (local dev only)
- [ ] No `.env.local` committed to Git
- [ ] `.env.local` listed in `.gitignore`
- [ ] Plan for key rotation if compromised

---

## Phase 2: Infrastructure & Billing

### 2.1 Vercel Configuration

#### Project Settings

- [ ] Framework Preset: Next.js
- [ ] Node Version: 18.x
- [ ] Build Command: `npm run build`
- [ ] Start Command: `next start`
- [ ] Install Command: `npm ci`

#### Preview Deployments

- [ ] Preview deployments enabled for Pull Requests
- [ ] Auto-cancel outdated PR deployments: **Enabled**
- [ ] Automatic Merge: **Disabled** (manual review only)

#### Domains

- [ ] Primary domain configured (e.g., `traveler.example.com`)
- [ ] HTTPS redirection enabled
- [ ] Environment-specific domains (Preview, Production)

### 2.2 Supabase Configuration

#### Plan & Billing

- [ ] Plan Type: **Free or Pro** (must be under ₩100,000/month equivalent)
- [ ] Compute: Small (free) or custom
- [ ] Storage: Standard
- [ ] Real-time: Disabled (not used in this project)
- [ ] Backups: At least weekly

#### Cost Estimation

| Component | Estimated Cost | Limit |
|-----------|---------------|----|
| Vercel | Free-$20/month | Free tier sufficient for MVP |
| Supabase | Free-₩30,000/month | Upgrade to Pro if exceeded |
| Domain | $10-15/year | External registrar |
| **Total** | **₩50,000-100,000/month** | ✓ Within budget |

**Verification:**
- [ ] Current bill < ₩100,000/month
- [ ] Auto-scaling configured to prevent runaway costs
- [ ] Billing alerts set for 80% of monthly limit

### 2.3 Monitoring & Observability

#### Vercel Analytics

- [ ] Web Vitals monitoring enabled
- [ ] Performance dashboard configured
- [ ] Error tracking integrated

#### Supabase Monitoring

- [ ] Database performance metrics visible
- [ ] Query performance reviewed
- [ ] Storage usage monitored
- [ ] Connection pool not exhausted

---

## Phase 3: Deployment Steps

### 3.1 Pre-Deployment Checklist

```bash
# 1. Verify local build succeeds
npm run build
npm run typecheck
npm run lint
npm run test:unit

# 2. Verify E2E tests pass
npm run test:e2e

# 3. Check Git status
git status
git log --oneline -5

# 4. Create feature branch
git checkout -b deploy/production-v1.0.0
```

### 3.2 Vercel Deployment

#### Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select repository: `anthropics/traveler-app`
4. Configure project:
   - Framework: Next.js
   - Root Directory: `app`
   - Node Version: 18.x
5. Add environment variables from **Phase 1.1**
6. Click "Deploy"

#### Verify Deployment

- [ ] Build succeeds (watch build logs)
- [ ] Preview URL is accessible
- [ ] No 404 or 500 errors on main pages
- [ ] Environment variables loaded correctly (check in Vercel logs)

### 3.3 Smoke Testing on Preview

```bash
# Test key endpoints on Preview deployment
curl -I https://[preview-url]/
curl -I https://[preview-url]/about
curl -I https://[preview-url]/travel-tools
curl -I https://[preview-url]/mates
curl -I https://[preview-url]/account
```

- [ ] All endpoints return 200 or 304
- [ ] No CORS errors in browser console
- [ ] Supabase connection works
- [ ] Images load correctly

### 3.4 Production Promotion

1. Review pull request in GitHub
2. Merge to `main` branch after approval
3. Wait for Vercel to auto-deploy to production URL
4. Verify production smoke tests pass

---

## Phase 4: Post-Deployment Verification

### 4.1 Production Health Checks

```bash
# Run smoke tests against production
PLAYWRIGHT_TEST_BASE_URL=https://traveler.example.com \
npm run test:e2e
```

- [ ] All E2E tests pass on production
- [ ] Database connections healthy
- [ ] Auth system functional
- [ ] External links working (Skyscanner, Booking.com, MOFA)

### 4.2 Security Audit

- [ ] No errors in browser DevTools Security tab
- [ ] No mixed content warnings
- [ ] HTTPS enforced on all pages
- [ ] Supabase RLS policies in effect
- [ ] Service Role Key not exposed in any logs
- [ ] No API keys in error messages

### 4.3 Monitoring Setup

- [ ] Vercel analytics dashboard linked
- [ ] Error tracking enabled (optional: Sentry)
- [ ] Performance baseline established
- [ ] Alerting configured for critical errors

### 4.4 Documentation

- [ ] README.md updated with deployment instructions
- [ ] CONTRIBUTING.md includes deployment guide
- [ ] Rollback procedure documented
- [ ] Incident response plan prepared

---

## Phase 5: Ongoing Maintenance

### 5.1 Regular Checks

- [ ] Monthly: Review Vercel & Supabase billing
- [ ] Weekly: Check error logs and performance metrics
- [ ] Weekly: Monitor database storage growth
- [ ] As needed: Rotate secrets if compromise suspected

### 5.2 Updates

- [ ] Pin Node.js version in Vercel UI
- [ ] Review and apply Next.js security updates monthly
- [ ] Keep Supabase client library updated
- [ ] Review Supabase security advisories

### 5.3 Disaster Recovery

- [ ] Database backups: **Daily** (Supabase Pro plan)
- [ ] Backup retention: **30 days minimum**
- [ ] Test restore procedure quarterly
- [ ] Document RTO (Recovery Time Objective): **1 hour**
- [ ] Document RPO (Recovery Point Objective): **1 hour**

---

## Rollback Procedure

If production issues are discovered post-deployment:

1. **Identify Issue:**
   - Check Vercel deployment logs
   - Check Supabase error logs
   - Verify database migrations

2. **Immediate Action:**
   ```bash
   # Revert to previous production deployment
   # In Vercel UI: Deployments > [Previous Build] > Promote to Production
   ```

3. **Analyze:**
   - Root cause analysis
   - Database state verification
   - Client cache invalidation

4. **Re-deploy:**
   - Fix issue locally
   - Create new PR and review
   - Merge to `main` and redeploy

---

## References

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Supabase Production Guide](https://supabase.com/docs/guides/hosting/production-checklist)
- [Next.js Production Checklist](https://nextjs.org/docs/deployment/production-checklist)
- [OWASP Security Deployment](https://owasp.org/www-community/Deployment)

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | — | — | — |
| DevOps Lead | — | — | — |
| Product Manager | — | — | — |

---

**Last Updated:** 2026-09-17
**Reviewed By:** —
**Next Review:** 2026-10-17
