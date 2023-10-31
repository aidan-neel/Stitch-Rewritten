<script lang="ts">
    import { page } from '$app/stores';
    import Icon from '@iconify/svelte';
</script>

<div class="flex flex-col gap-2 items-center justify-center w-screen h-screen fixed pb-24">
    <p class="font-bold text-4xl">
        Error: {$page.error.message}
    </p>
    <button class="px-3 p-1 rounded-lg flex flex-row text-lg hover:bg-[#050505] duration-100 items-center justify-center border text-white/80 border-white/20" on:click={() => {
        window.history.back();
    }}>
        <Icon icon="formkit:arrowleft" class="text-white/80 h-5 w-5" /> Back
    </button>
</div>