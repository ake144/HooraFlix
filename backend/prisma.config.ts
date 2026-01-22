// prisma.config.ts
import 'dotenv/config';  // Loads env if .env present (harmless in Docker)
import { defineConfig } from 'prisma/config';  // Drop 'env' import—we won't use strict env()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  ...(process.env.DATABASE_URL && {  // Conditional: Omit datasource if no URL (e.g., during build)
    datasource: {
      url: process.env.DATABASE_URL,  // Use process.env directly—no throwing
      // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,  // Optional, if using
    },
  }),
});