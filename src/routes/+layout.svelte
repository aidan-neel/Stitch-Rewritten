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

<html lang="en-us" class="flex flex-row items-end justify-end dark">
    <body class="h-screen {pageIsntAuthentication ? 'w-[84%] ml-[16%]' : ''} fixed right-0 z-0 top-0 duration-200 w-screen flex items-end justify-center text-center bg-main-white dark:bg-main text-white/90 flex-col">
        <slot></slot>
        {#if pageIsntAuthentication}
            <Navbar />
        {/if}
    </body>
</html>