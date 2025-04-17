/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { createClient } from '@libsql/client';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { env } from '$env/dynamic/private';

const dbClient = createClient({
  url: env.DB_URL || '',
  authToken: env.DB_AUTH_TOKEN || ''
}) as any;

const db = new LibsqlDialect({ client: dbClient });

export const auth = betterAuth({
  baseURL: env.BETTER_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_BASE_URL],
  database: db as any,
  advanced: {
    useSecureCookies: true
  },
  plugins: [
    anonymous({
      emailDomainName: 'example.com'
    }),
    passkey()
  ]
});

export type Auth = typeof auth;
