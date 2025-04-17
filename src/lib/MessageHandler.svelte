<script lang="ts">
  export let error: string = '';
  export let message: string = '';
  export let onCloseError: () => void = () => {};
  export let onCloseMessage: () => void = () => {};
</script>

{#if error}
  <div
    class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 relative"
    role="alert"
  >
    <span class="block sm:inline">{error}</span>
    <button
      class="absolute top-0 right-0 mt-2 mr-2 text-red-700 hover:text-red-900"
      on:click={onCloseError}
      aria-label="Close error message"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </button>
  </div>
{/if}

{#if message}
  <div
    class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 relative"
    role="alert"
  >
    <span class="block sm:inline">{message}</span>
    <button
      class="absolute top-0 right-0 mt-2 mr-2 text-green-700 hover:text-green-900"
      on:click={onCloseMessage}
      aria-label="Close success message"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </button>
  </div>
{/if}
