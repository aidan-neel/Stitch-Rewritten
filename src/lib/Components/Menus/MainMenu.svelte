<script lang="ts">
    import { clickOutside } from "$lib/Modules/Utils";
    import { fade, fly } from "svelte/transition";

    export let title;
    export let width;
    export let clickOutsideFunction = () => {};
</script>

<div transition:fade="{{ delay: 0, duration: 250}}" class="h-screen sm:flex hidden w-screen z-[99] bg-black bg-opacity-50 backdrop-blur-sm pb-48 fixed top-0 left-0 flex items-center justify-center">
    <div use:clickOutside={() => {
        clickOutsideFunction();
    }} transition:fly="{{y: 25, duration: 400}}" class="w-[{width}rem] border relative dark:border-white/10 border-black/50 dark:bg-main bg-secondary-white rounded-2xl">
        <div class="border-b dark:border-white/10 border-black/20 pb-4 pt-4 relative">
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

<div transition:fade="{{ delay: 0, duration: 250 }}" class="h-screen flex sm:hidden w-screen z-[99] bg-black bg-opacity-50 backdrop-blur-sm fixed bottom-0 left-0 flex-col justify-end">
    <div on:click|stopPropagation transition:fly="{{y: 25, duration: 400}}" class="w-screen border-t h-[80vh] relative dark:border-white/10 border-black/50 rounded-t-xl dark:bg-main bg-secondary-white">
        <div class="border-b dark:border-white/10 border-black/20 pb-4 pt-4 relative">
            <button class="dark:text-white text-white font-mono absolute left-6 top-5" on:click={() => {
                clickOutsideFunction();
            }}>
                Cancel
            </button>
            <h1 class="font-bold select-none dark:text-white text-black text-xl">
                {title}
            </h1>
        </div>
        <div class="h-full">
            <slot></slot>
        </div>
    </div>
</div>
