<script lang="ts">
    import type { Option } from '$lib/Modules/types';
    import { clickOutside } from '$lib/Modules/utils';
    import Icon from '@iconify/svelte';
    import { fly } from 'svelte/transition';

    export let open: boolean = false;
    export let options: Option[];
    export let closeFunction: () => void = () => {};
    export let minimized = false;
</script>

{#if minimized === true}
    <div use:clickOutside={() => {
        closeFunction();
    }} transition:fly="{{y: 20, duration: 400}}" class="w-[20rem] left-3 absolute bottom-16 bg-main rounded-lg border dark:border-white border-black border-opacity-10 dark:border-opacity-5 mb-4">
        {#each options as option, i (option)}
            <button on:click={option.action} class="w-full flex flex-row items-center dark:text-white text-black justify-start p-3.5 hover:bg-white {i === 0 ? 'rounded-t-lg' : ''} {i === options.length - 1 ? 'rounded-b-lg' : ''} hover:bg-opacity-5">
                <Icon class="h-6 w-6 mr-4" icon={option.icon} />{option.name}
            </button>
            {#if i < options.length - 1}
                <div class="border-t dark:border-white border-black border-opacity-10 dark:border-opacity-5"></div>
            {/if}
        {/each}
    </div>
{:else if minimized === false}
    <div use:clickOutside={() => {
        closeFunction();
    }}            class="w-full bg-secondary-white dark:bg-white dark:bg-opacity-[0.02] rounded-lg border dark:border-white border-black border-opacity-10 dark:border-opacity-5 mb-4">
        {#each options as option, i (option)}
            <button on:click={option.action} class="w-full flex flex-row items-center dark:text-white text-black justify-start p-3.5 hover:bg-white {i === 0 ? 'rounded-t-lg' : ''} {i === options.length - 1 ? 'rounded-b-lg' : ''} hover:bg-opacity-5">
                <Icon class="h-6 w-6 mr-4" icon={option.icon} />{option.name}
            </button>
            {#if i < options.length - 1}
                <div class="border-t dark:border-white border-black border-opacity-10 dark:border-opacity-5"></div>
            {/if}
        {/each}
    </div>
{/if}