/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { createAuthMiddleware } from 'better-auth/api';
import { createClient } from '@libsql/client';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { env } from '$env/dynamic/private';

const dbClient = createClient({
  url: env.DB_URL || '',
  authToken: env.DB_AUTH_TOKEN || ''
}) as any;

const db = new LibsqlDialect({ client: dbClient });

export const auth = betterAuth({
  baseURL: env.BETTER_BASE_URL?.replace('https', 'http'),
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_BASE_URL],
  database: db as any,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/passkey/generate-register-options') {
        const result = ctx.context.returned as {
          user: { id: string; displayName: string; name?: string };
        };

        const modified = {
          ...result
          // user: {
          //   ...result?.user,
          //   displayName: result?.user?.displayName || result?.user?.name
          // }
        };

        return ctx.json(modified);
      }
    })
  },
  plugins: [
    anonymous({
      emailDomainName: 'example.com'
    }),
    passkey()
  ]
});

export type Auth = typeof auth;
