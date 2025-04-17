import { createAuthClient } from 'better-auth/svelte';
import { passkeyClient, anonymousClient } from 'better-auth/client/plugins';

const authClient = createAuthClient({
  plugins: [passkeyClient(), anonymousClient()]
});

export default authClient;
