# Course Load Optimizer

Frontend-first Next.js app for comparing semester plans, spotting overload risk, and choosing the most realistic schedule before registration.

## Quick Deploy

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import it into Vercel as a Next.js project.
3. Keep the default install/build settings and deploy.

No environment variables are required.

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pre-Deploy Checks

Run the same checks locally before submitting:

```bash
npm run lint
npm run typecheck
npm run build
```

To preview the production build locally after a successful build:

```bash
npm run start
```

If Windows leaves `node_modules` in a locked state and `npm install` or `npm run build` fails with `EPERM`, close any running Node processes and retry with a clean reinstall:

```bash
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run build
```

If `next build` fails on Windows with an `EISDIR ... readlink` error and the project is on an `exFAT` drive, move the repo to an `NTFS` volume first. This is a Windows filesystem/symlink issue, not an app-code issue.

## Vercel Deployment

1. Open Vercel and choose **Add New Project**.
2. Select this repository.
3. Confirm the framework is **Next.js**.
4. Use the default settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: leave blank
5. Deploy.

## Environment Variables

No environment variables are required for this project.

## Node Version

Use Node `20` or newer. The repo includes `.nvmrc` with `20` for local alignment with Vercel.
