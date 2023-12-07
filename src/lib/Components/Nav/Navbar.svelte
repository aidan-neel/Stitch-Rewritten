<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { Option } from "$lib/Modules/Types";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { minimizedNav, postCreation } from "$lib/Stores";
	import { onMount } from "svelte";
	import OptionMenu from "../Menus/OptionMenu.svelte";
	import NavButton from "./NavButton.svelte";

    const minimized = $minimizedNav;

    let optionsOpen = false;

    onMount(() => {
        console.log($page.url.pathname.split('/'))
    })

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
                goto('/profile/edit');
                optionsOpen = false;
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

<!-- Mobile Navbar(bottom) -->
<nav class="w-full flex px-2 md:hidden lg:hidden fixed gap-6 flex items-center justify-center bottom-0 h-14  bg-main bg-opacity-70 backdrop-blur-lg border-t border-t-white/10">
    <NavButton href="/" minimized={true} icon="ph:house-fill" alt_icon="" text="Home" />
    <NavButton callbackActive={true} callback={() => {
        if($currentUser) {
            postCreation.set(true);
        } else {
            goto('/login');
        }
    }} minimized={true}  icon="ph:plus-circle-fill" alt_icon="" text="Create" />
    {#if $currentUser}
        <NavButton href="/profile/edit" minimized={true} icon="ph:gear-fill" alt_icon="" text="Settings" />
        <NavButton href="/@{$currentUser?.handle}" minimized={true}  icon="ph:user-circle-fill" alt_icon="" text="View Profile" />
    {:else}
        <NavButton href="/login" minimized={true}  icon="ph:user-circle-fill" alt_icon="" text="Log In" /> 
    {/if}
</nav>
<!-- Mobile Navbar(bottom) -->

<!-- Mobile Navbar(left) -->
<nav class='h-full fadeUpFast z-20 lg:hidden hidden md:flex justify-between relative flex-col flex border-r border-r-white/10 px-2 w-[6rem] md:w-[8.5rem] bg-main'>
    <!--Logo-->
    <section class="w-full">
        <p class="text-white font-semibold flex-col flex mt-3 border-b w-full border-b-white/10 h-[3.6rem]">
            Stitch <span class="text-base font-mono font-normal text-sm text-white/70">Beta</span>
        </p>
        <section class="flex flex-col w-full items-center justify-center gap-2 mt-4">
            <NavButton href="/" minimized={true} icon="ph:house-fill" alt_icon="" text="Home" />
            <NavButton callbackActive={true} callback={() => {
                if($currentUser) {
                    postCreation.set(true);
                } else {
                    goto('/login');
                }
            }} minimized={true}  icon="ph:plus-circle-fill" alt_icon="" text="Create" />
            {#if $currentUser}
                <NavButton href="/@{$currentUser?.handle}" minimized={true}  icon="ph:user-circle-fill" alt_icon="" text="View Profile" />
            {:else}
                <NavButton href="/login" minimized={true}  icon="ph:user-circle-fill" alt_icon="" text="Log In" />
            {/if}    
        </section> 
    </section>
    <section class="w-full flex items-center justify-center mb-4">
        <section class="w-full items-center justify-center flex">      
            {#if optionsOpen}
                <OptionMenu minimized={true} closeFunction={() => {optionsOpen = false}} options={options} />
            {/if}
            <NavButton callbackActive={true} callback={() => { optionsOpen = !optionsOpen }} minimized={true} icon="tabler:dots" alt_icon="" text="More" />
        </section>
    </section>
</nav>
<!-- Mobile Navbar(left) -->

<!-- Navbar -->
<nav class="h-full fadeUpFast z-20 hidden lg:flex border-r border-r-white/10 bg-main-white dark:bg-main duration-200 relative w-[16rem] md:w-[14rem] lg:w-[20rem] flex-shrink-0 xl:w-[17.5%] flex-col justify-between border-opacity-[0.075] items-start p-5">
    <p class="text-white text-3xl left-8 mt-2 z-20 text-left font-semibold flex items-center justify-center gap-2 absolute">
        Stitch <span class="text-base font-mono font-normal text-white/70">Beta</span>
    </p>    
    <section class="flex flex-col {minimized ? 'items-center justify-center' : 'items-start justify-start'} gap-2 w-full mt-24">
        <NavButton href="/" minimized={minimized} icon="ph:house-fill" alt_icon="" text="Home" />
        <NavButton callbackActive={true} callback={() => {
            if($currentUser) {
                postCreation.set(true);
            } else {
                goto('/login');
            }
        }} minimized={minimized}  icon="ph:plus-circle-fill" alt_icon="" text="Create" />
        {#if $currentUser}
            <NavButton href="/@{$currentUser?.handle}" minimized={minimized}  icon="ph:user-circle-fill" alt_icon="" text="View Profile" />
        {:else}
            <NavButton href="/login" minimized={minimized}  icon="ph:user-circle-fill" alt_icon="" text="Log In" />
        {/if}
    </section>
    <section class="w-full {minimized ? 'items-center justify-center flex' : ''}">      
        {#if optionsOpen}
            <OptionMenu closeFunction={() => {optionsOpen = false}} options={options} />
        {/if}
        <NavButton callbackActive={true} callback={() => { optionsOpen = !optionsOpen }} icon="tabler:dots" alt_icon="" text="More" />
    </section>
</nav>
<!-- Navbar -->