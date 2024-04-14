## Warning Notice
This is a complete rewrite of the original [Climate Archive](https://climatearchive.org/) frontend for visualising (paleo)climate model data. The original version was written in vanilla JavaScript, this rewrite uses NextJS+React. The 3D visualisation uses the [react-three-fiber]https://github.com/pmndrs/react-three-fiber React renderer for threejs. This is still under heavy development and not yet in production use. Also, not all features from the original platform are already available, but will rather be added step-by-step. 

Input model data for the visualisation assumes bitmap files produced with the [nimbus](https://github.com/sebsteinig/nimbus) package and stored in the [archive-db](https://github.com/WillemNicolas/archive-db) PostgreSQL database. 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
