<script lang="ts">
    import { page } from '$app/stores';
    import PostCreationMenu from '$lib/Components/Menus/PostCreationMenu.svelte';
    import Toast from '$lib/Components/Menus/Toast.svelte';
    import Navbar from '$lib/Components/Nav/Navbar.svelte';
    import { currentUser } from '$lib/Pocketbase';
    import { minimizedNav } from '$lib/stores';
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

<svelte:head>
    <title>
        Stitch
    </title>
    <meta name="author" content="Aidan Neel">
    <meta name="keywords" content="Aidan Neel Stitch Social Media Twitter Threads Tweet Post Echo Site Website Posts Register Sign Up">
    <meta name="description" content="Stitch is a social media platform that allows you to create threads of posts, and share them with your friends.">
    <meta name="theme-color" content="#1DA1F2">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@aidan_neel">
    <meta name="twitter:creator" content="@aidan_neel">
    <meta property="og:image" content="https://media.discordapp.net/attachments/1139174900590968862/1181876201464270848/Untitled-1.png?ex=6582a6fc&is=657031fc&hm=ccb629597430c6ad0491ee75551c3f6ddcffc9bb5f393dc501e86d25a89df42f&=&format=webp&quality=lossless&width=1400&height=700" />
</svelte:head>

<html lang="en-us" class="flex flex-row items-center justify-center dark h-screen w-screen text-white bg-main">
    <body class="bg-main flex items-center justify-center flex-row">
        <main class="h-[100vh] hide-scrollbar flex z-0 top-0 duration-200 w-screen items-center flex-row-reverse md:justify-center text-white text-center bg-main overflow-x-hidden overflow-y-auto">
            <slot></slot>
            {#if pageIsntAuthentication}
                <Navbar />
            {/if}
        </main>
    </body>
    <!-- Mobile is not supported yet block
    <main class="visible md:hidden h-full w-full flex items-center justify-center bg-main  flex-col">
        <div class="flex items-start justify-center px-6 flex-col">
            <Title>
                Mobile is not supported yet.
            </Title>
            <SubTitle additionalClass="mt-2">
                Visit Stitch on a desktop browser to use the app.
            </SubTitle>
            <p class="text-white w-full mt-4 text-xl">
                Stitch is a desktop app. I do not plan on supporting mobile devices until the app is fully functional. Afterwards, I will work on a mobile app, and the web app will be a secondary option. Mobile support for the website will be rewritten almost from scratch.
            </p>
            <button class="bg-white font-medium p-2.5 rounded-lg mt-5 px-5">
                Back to aidan-neel.com
            </button>
        </div>
    </main>
    -->
</html>