<script lang="ts">
    export let type = "text";
    export let placeholder = "";
    export let additionalClass = "";
    export let value = "";
</script>

{#if type === 'email'}
    <input bind:value={value} type="email" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-2xl fadeUp border border-white/20 bg-[#050505] placeholder:text-white/40 text-white focus:outline-none focus:border-white/30">
{:else if type === 'password'}
    <input bind:value={value} type="password" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-2xl fadeUp border border-white/20 bg-[#050505] placeholder:text-white/40 text-white focus:outline-none focus:border-white/30">
{:else if type === 'text'}
    <input bind:value={value} type="text" placeholder={placeholder} class="{additionalClass} 
    w-full p-3 px-4 rounded-2xl fadeUp border border-white/20 bg-[#050505] placeholder:text-white/40 text-white focus:outline-none focus:border-white/30">
{/if}