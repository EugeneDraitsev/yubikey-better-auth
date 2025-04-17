import { auth } from '$lib/auth'; // path to your auth file
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/api/')) {
    return svelteKitHandler({ event, resolve, auth });
  }
  return resolve(event);
}
