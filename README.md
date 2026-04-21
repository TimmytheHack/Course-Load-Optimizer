# Course Load Optimizer

A frontend-first planning app that helps students compare semester options, detect overload risk, and choose the most realistic schedule before registration.

## What It Shows

- Three candidate semester plans
- A stress score based on workload, conflicts, commitments, and exam timing
- A built-in demo semester with one overloaded plan, one balanced plan, and one exam-clustered plan

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Submission / Deploy

The app is ready to import into Vercel as a standard Next.js project.

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import the repo into Vercel.
3. Confirm the framework is **Next.js**.
4. Keep the defaults:
   - Install Command: `npm install`
   - Build Command: `npm run build`
5. Deploy.

No environment variables are required.

## Notes

- Use Node `20` or newer. `.nvmrc` is included.
- If Windows throws `EPERM` during install/build, close running Node processes and retry.
- If `next build` fails on an `exFAT` drive with an `EISDIR ... readlink` error, move the repo to an `NTFS` volume first.
