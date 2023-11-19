<script lang="ts">
    import { page } from '$app/stores';
    import PostCreationMenu from '$lib/Components/Menus/PostCreationMenu.svelte';
    import Toast from '$lib/Components/Menus/Toast.svelte';
    import Navbar from '$lib/Components/Nav/Navbar.svelte';
    import { currentUser } from '$lib/Pocketbase';
    import { minimizedNav } from '$lib/Stores';
    import './app.css';
    
    const minimized = $minimizedNav
    $: pageIsntAuthentication = $page.url.pathname !== '/login' && $page.url.pathname !== '/register' && $page.url.pathname !== '/login-beta' && $page.url.pathname !== '/register-beta'
</script>

<PostCreationMenu user={$currentUser} />
<Toast /> 

<style>
    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

<html lang="en-us" class="flex flex-row items-center justify-center dark">
    <body class="h-[100vh] hide-scrollbar z-0  top-0 duration-200 w-screen flex items-center flex-row-reverse justify-center text-white text-center bg-main overflow-x-hidden overflow-y-auto">
        <slot></slot>
        {#if pageIsntAuthentication}
            <Navbar />
        {/if}
    </body>
</html>