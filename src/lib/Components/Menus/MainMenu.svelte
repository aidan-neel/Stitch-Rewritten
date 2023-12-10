<script lang="ts">
    import { clickOutside } from "$lib/Modules/utils";
    import { fade, fly } from "svelte/transition";

    export let title;
    export let width;
    export let clickOutsideFunction = () => {};
</script>

<div transition:fade="{{ delay: 0, duration: 250}}" class="h-screen w-screen z-[99] bg-black bg-opacity-50 backdrop-blur-sm pb-48 fixed top-0 left-0 flex items-center justify-center">
    <div use:clickOutside={() => {
        clickOutsideFunction();
    }} transition:fly="{{y: 25, duration: 400}}" class="sm:w-[43rem] w-full border relative dark:border-white/10 border-black/50 dark:bg-main bg-secondary-white rounded-2xl">
        <div class="border-b dark:border-white/10 border-black/20 pb-4 pt-4 relative w-full flex items-center justify-center">
            <button class="dark:text-white font-mono text-white absolute left-6 top-5" on:click={() => {
                clickOutsideFunction();
            }} >
                Cancel
            </button>
            <h1 class="font-bold select-none dark:text-white text-black text-xl">
                {title}
            </h1>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</div>