<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Option } from "$lib/Modules/types";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { darkMode, minimizedNav, postCreation } from "$lib/stores";
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
            name: 'Switch Appearance',
            icon: 'akar-icons:moon-fill',
            action: () => {
                darkMode.set(!$darkMode);
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
    <section class="flex flex-col {minimized ? 'items-center justify-center' : 'items-start justify-start'} gap-2 w-full mt-3">
            <h1 class="fadeUp fadeUpFast dark:text-white text-black text-3xl font-bold mb-7 ml-3">
                Stitch
            </h1>
        <NavButton href="/" minimized={minimized} icon="iconamoon:home-fill" alt_icon="" text="Home" />
        <NavButton callbackActive={true} callback={() => {
            postCreation.set(true);
        }} minimized={minimized}  icon="iconamoon:sign-plus-circle-fill" alt_icon="" text="Create" />
        {#if $currentUser}
            <NavButton href="/@{$currentUser?.handle}" minimized={minimized}  icon="iconamoon:profile-fill" alt_icon="" text="View Profile" />
        {/if}
    </section>
    <section class="w-full {minimized ? 'items-center justify-center flex' : ''}">      
        {#if optionsOpen}
            <OptionMenu options={options} />
        {/if}
        <NavButton callbackActive={true} callback={() => { optionsOpen = !optionsOpen }} icon="tabler:dots" alt_icon="" text="More" />
    </section>
</nav>