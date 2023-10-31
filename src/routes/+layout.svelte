<script lang="ts">
    import { page } from '$app/stores';
    import Navbar from '$lib/Components/Nav/Navbar.svelte';
    import { minimizedNav } from '$lib/stores';
    import './app.css';
    
    const minimized = $minimizedNav
    $: pageIsntAuthentication = $page.url.pathname !== '/login' && $page.url.pathname !== '/signup'
</script>

<html lang="en-us" class="dark flex flex-row bg-[#121213]">
    {#if pageIsntAuthentication}
        <Navbar />
    {/if}
        <body class="h-screen {pageIsntAuthentication ? 'w-[84%] ml-[16%]' : ''} fixed right-0 z-0 top-0 duration-200 w-screen flex items-center justify-center text-center bg-[#121213] text-white/90 flex-col">
        <slot></slot>
    </body>
</html>