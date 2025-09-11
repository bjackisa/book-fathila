This is a simple booking application built with [Next.js](https://nextjs.org). It stores bookings and availability in a [Supabase](https://supabase.com) Postgres database.

## Getting Started

1. Create the required tables in your database by running the SQL in `supabase/schema.sql`.
2. Set the Supabase connection environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).
3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the booking form.

An admin page is available at [http://localhost:3000/admin](http://localhost:3000/admin) where time slots can be marked as unavailable.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
