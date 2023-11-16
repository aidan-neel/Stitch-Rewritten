<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Option } from "$lib/Modules/types";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { minimizedNav, postCreation } from "$lib/stores";
	import OptionMenu from "../Menus/OptionMenu.svelte";
	import NavButton from "./NavButton.svelte";

    const minimized = $minimizedNav;

    let optionsOpen = false;

    const signOutOption = {
        name: 'Sign Out',
        icon: 'iconamoon:exit',
        action: () => {
            pb.authStore.clear();
            goto('/');
            optionsOpen = false;
        }
    }

    const logInOption = {
        name: 'Log In',
        icon: 'iconamoon:enter',
        action: () => {
            goto('/login');
            optionsOpen = false;
        }
    }

    let options: Option[] = [
        {
            name: 'Settings',
            icon: 'ph:gear-fill',
            action: () => {
                goto('/settings');
            }
        }
    ]

    $: {
        if ($currentUser !== null || undefined) {
            options.push(signOutOption);
            options.filter((option) => {
                return option.name !== 'Log In';
            })
        } else {
            options.push(logInOption);
            options.filter((option) => {
                return option.name !== 'Sign Out';
            })
        }
    }
</script>

<nav class="h-screen fadeUpFast z-20  bg-main-white dark:bg-main duration-200 max-2xl:w-[24%] w-[14%] flex-col justify-between border-opacity-[0.075] flex items-start p-5 absolute left-0 top-0">
    <p class="text-white text-3xl absolute top-10 left-8 z-20 text-left font-semibold flex items-center justify-center gap-2">
        Stitch <span class="text-base font-mono font-normal text-white/70">Beta</span>
    </p>    
    <section class="flex flex-col {minimized ? 'items-center justify-center' : 'items-start justify-start'} gap-2 w-full mt-24">
        <NavButton href="/" minimized={minimized} icon="ph:house-fill" alt_icon="" text="Home" />
        <NavButton callbackActive={true} callback={() => {
            postCreation.set(true);
        }} minimized={minimized}  icon="ph:plus-circle-fill" alt_icon="" text="Create" />
        {#if $currentUser}
            <NavButton href="/@{$currentUser?.handle}" minimized={minimized}  icon="ph:user-circle-fill" alt_icon="" text="View Profile" />
        {/if}
    </section>
    <section class="w-full {minimized ? 'items-center justify-center flex' : ''}">      
        {#if optionsOpen}
            <OptionMenu closeFunction={() => {optionsOpen = false}} options={options} />
        {/if}
        <NavButton callbackActive={true} callback={() => { optionsOpen = !optionsOpen }} icon="tabler:dots" alt_icon="" text="More" />
    </section>
</nav>