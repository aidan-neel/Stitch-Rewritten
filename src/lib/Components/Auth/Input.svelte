<script lang="ts">
    export let type = "text";
    export let placeholder = "";
    export let additionalClass = "";
    export let value = "";
</script>

{#if type === 'email'}
    <input bind:value={value} type="email" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-lg border border-black/10 dark:border-white/10  bg-transparent placeholder:text-black/60 font-mono dark:placeholder:text-white/40 text-black dark:text-white focus:outline-none focus:border-black/30 dark:focus:border-white/30">
{:else if type === 'password'}
    <input bind:value={value} type="password" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-lg border border-black/10 dark:border-white/10  bg-transparent placeholder:text-black/60 font-mono dark:placeholder:text-white/40 text-black dark:text-white focus:outline-none focus:border-black/30 dark:focus:border-white/30">
{:else if type === 'text'}
    <input bind:value={value} type="text" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-lg border border-black/10 dark:border-white/10  bg-transparent placeholder:text-black/60 font-mono dark:placeholder:text-white/40 text-black dark:text-white focus:outline-none focus:border-black/30 dark:focus:border-white/30">
{/if}