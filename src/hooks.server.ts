import { auth } from '$lib/auth'; // path to your auth file
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {
  console.log('event.request.url', event.request.url);
  console.log('BETTER_BASE_URL', env.BETTER_BASE_URL);
  return svelteKitHandler({ event, resolve, auth });
}
