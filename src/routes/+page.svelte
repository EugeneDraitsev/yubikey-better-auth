<script lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import authClient from '$lib/auth-client';
  import MessageHandler from '$lib/MessageHandler.svelte';

  let isLoading = $state(false);
  let isLogoutLoading = $state(false);
  let error = $state('');
  let message = $state('');

  const session = authClient.useSession();
  const passkeys = authClient.useListPasskeys();

  let isSessionPending = $derived($session?.error?.status === 0 || $session.isPending);

  function clearError() {
    error = '';
  }

  function clearMessage() {
    message = '';
  }

  async function loginAnonymously() {
    isLoading = true;
    error = '';
    message = '';

    try {
      const result = await authClient.signIn.anonymous();
      if (result?.error) {
        error = result.error.message || 'Failed to login anonymously';
      }
    } catch (err: any) {
      error = err.message || 'Failed to login anonymously';
    } finally {
      isLoading = false;
    }
  }

  async function loginWithPasskey() {
    isLoading = true;
    error = '';
    message = '';

    try {
      const result = await authClient.signIn.passkey();
      if (result?.error) {
        error = result.error.message || 'Failed to authenticate with passkey';
      } else {
        ($session as any).refetch();
        passkeys.get().refetch();
      }
    } catch (err: any) {
      error = err.message || 'Failed to authenticate with passkey';
    } finally {
      isLoading = false;
    }
  }

  async function registerPasskey(isSecurityKey = false) {
    isLoading = true;
    error = '';
    message = '';

    try {
      const data = await authClient.passkey.addPasskey({
        name: 'New Passkey',
        authenticatorAttachment: isSecurityKey ? 'cross-platform' : 'platform'
      });
      if (data?.error) {
        console.error(data);
        error = data.error.message || 'Failed to create passkey';
        return;
      }
      message = 'Passkey registered successfully!';
      passkeys.get().refetch();
    } catch (err: any) {
      error = err.message || 'Failed to register passkey';
    } finally {
      isLoading = false;
    }
  }

  async function removePasskey(passkey: any) {
    isLoading = true;
    error = '';
    message = '';

    try {
      await authClient.passkey.deletePasskey({ id: passkey.id });
      message = 'Passkey removed successfully!';
      passkeys.get().refetch();
    } catch (err: any) {
      error = err.message || 'Failed to remove passkey';
    } finally {
      isLoading = false;
    }
  }

  async function logout() {
    isLogoutLoading = true;
    error = '';
    message = '';

    try {
      await authClient.signOut();
    } catch (err: any) {
      error = err.message || 'Failed to logout';
      console.error('Failed to logout:', err);
    } finally {
      isLogoutLoading = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
  <div class="relative min-h-72 w-100 max-w-[calc(100vw-16px)] bg-white p-6 shadow-lg">
    <MessageHandler {error} {message} onCloseError={clearError} onCloseMessage={clearMessage} />

    {#if isSessionPending}
      <div class="h-72 w-full animate-pulse bg-gray-200"></div>
    {:else if !$session.data?.user}
      <!-- Login Form -->
      <div class="mx-auto max-w-md">
        <div class="text-center">
          <h1 class="text-3xl font-semibold text-gray-900">Login</h1>
          <p class="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div class="mt-8">
          <div class="mt-6 space-y-4">
            <button
              onclick={loginAnonymously}
              disabled={isLoading}
              class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              {#if isLoading}
                <div class="flex items-center justify-center">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  ></div>
                  <span class="ml-2">Loading...</span>
                </div>
              {:else}
                Login as Anonymous
              {/if}
            </button>

            <button
              onclick={loginWithPasskey}
              disabled={isLoading}
              class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            >
              {#if isLoading}
                <div class="flex items-center justify-center">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  ></div>
                  <span class="ml-2">Loading...</span>
                </div>
              {:else}
                Login with Passkey
              {/if}
            </button>
          </div>
        </div>
      </div>
    {:else}
      <!-- Authenticated View -->
      <div class="mx-auto max-w-md">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Welcome, {$session.data.user.name || 'User'}
          </h1>
          {#if $session.data.user.email}
            <div class="text-md mt-2 max-w-full font-mono break-all text-gray-600">
              {$session.data.user.email}
            </div>
          {/if}
        </div>

        <div class="mt-6">
          <h2 class="text-xl font-medium text-gray-900">Your Passkeys</h2>

          {#if $passkeys.data?.length === 0}
            <p class="mt-2 text-gray-600">You don't have any passkeys yet.</p>
          {:else}
            <ul class="mt-4 space-y-3">
              {#if $passkeys && $passkeys.data?.length}
                {#each $passkeys?.data as passkey (passkey.id)}
                  <li class="flex items-center justify-between rounded-md bg-gray-50 p-3">
                    <div>
                      <span class="font-medium">{passkey.name || 'Passkey'}</span>
                      <span class="block text-sm text-gray-500"
                        >Created: {new Date(passkey.createdAt).toLocaleDateString()}</span
                      >
                    </div>
                    <button
                      onclick={() => removePasskey(passkey)}
                      class="text-red-600 hover:text-red-800"
                      disabled={isLoading}
                    >
                      {#if isLoading}
                        <div
                          class="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"
                        ></div>
                      {:else}
                        Remove
                      {/if}
                    </button>
                  </li>
                {/each}
              {/if}
            </ul>
          {/if}

          <div class="mt-6 space-y-4">
            <button
              onclick={() => registerPasskey(true)}
              disabled={isLoading}
              class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            >
              {#if isLoading}
                <div class="flex items-center justify-center">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  ></div>
                  <span class="ml-2">Loading...</span>
                </div>
              {:else}
                Add Security Key
              {/if}
            </button>

            <button
              onclick={logout}
              class="flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              disabled={isLogoutLoading}
            >
              {#if isLogoutLoading}
                <div class="flex items-center justify-center">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  ></div>
                  <span class="ml-2">Logging out...</span>
                </div>
              {:else}
                Logout
              {/if}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
