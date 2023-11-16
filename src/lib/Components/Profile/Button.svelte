<script lang="ts">
    export let type;
    export let additionalClass;
    export let callback = () => {};
</script>

{#if type === 'secondary'}
    <button on:click={callback} class="{additionalClass} w-full p-2 border hover:bg-white hover:bg-opacity-5 border-white/20 font-medium rounded-xl text-white">
        <slot></slot>
    </button>
{:else if type === 'primary'}
    <button on:click={callback} class="{additionalClass} w-full p-2 bg-white font-semibold hover:bg-white/80 rounded-xl text-black">
        <slot></slot>
    </button>
{/if}