// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrate: {
//     url: process.env.DATABASE_URL!,
//   },
// });

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});