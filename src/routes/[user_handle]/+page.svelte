<script lang='ts'>
	import { goto } from '$app/navigation';
	import Spinner from '$lib/Assets/spinner.svg';
	import Post from '$lib/Components/Home/Post.svelte';
	import Loading from '$lib/Components/Menus/Loading.svelte';
	import SearchBar from '$lib/Components/Menus/SearchBar.svelte';
	import { Media } from '$lib/Modules/FileManager.js';
	import { currentUser, pb } from '$lib/Pocketbase';
	import { postCreation, postCreationContent } from '$lib/stores.js';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

    export let data;

    let url;
    let banner;
    let loading;
    let user_data = null;

    let user_posts = [];

    $: user_handle = data.handle;
    $: currentUserOwnsProfile = user_data && $currentUser?.id === user_data.id;

    let noPosts = false;

    $: noPosts = false, data.handle;

    onMount(() => {
        noPosts = false;
    })

    async function fetchData() {
        if(user_handle) {
            try {
                loading = false;
                const user = await pb.collection('users').getList(1, 2, {
                    filter: `handle = "${user_handle}"`,
                    expand: 'avatar, banner'
                });

                const MediaHandler = new Media(user.items[0]);
                url = await MediaHandler.fetch_avatar();
                banner = await MediaHandler.fetch_banner();
                
                user_data = user.items[0];

                const posts = await pb.collection('posts').getList(1, 20, {
                    filter: `user.id = "${user.items[0].id}"`,
                    sort: '-created_at',
                    expand: 'user'
                });

                if (posts.items.length === 0) {
                    noPosts = true;
                } else {
                    posts.items.forEach((post) => {
                        user_posts = [...user_posts, post];
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                loading = false;
            }
        }
    }

    async function mentionUser() {
        if (loading === false && user_data !== null && currentUserOwnsProfile === false) {
            postCreationContent.set(`@${user_data.handle} `);
            postCreation.set(true);
        }
    }

    $: if (user_handle) {
        loading = true;
        fetchData();
        loading = false;
    }

    onMount(() => {
        fetchData();
    })
</script>

<style>
    .pfp {
        height: 7.5rem;
        width: 7.5rem;
    }

    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

<div class="fixed top-0">

</div>

<svelte:head>
    <title>
        Stitch &middot; {user_data?.handle !== undefined ? user_data?.handle : 'Loading...'}
    </title>
</svelte:head>

{#if loading === false && user_data !== null}
    <SearchBar />
    <div class="flex xl:w-[47.5rem] w-full overflow-x-hidden overflow-y-auto hide-scrollbar flex-col h-full items-center justify-start relative">
        <div class="border-b border-b-white/10 h-1/6 flex-shrink-0 flex items-center justify-center w-full relative">
            <img src={banner} alt="Profile Banner" class="w-full h-full object-cover">
        </div>
        <div class="w-full flex items-start justify-start mt-4 flex-col">
            <section class="flex flex-row items-start justify-between w-full">
                <section class="flex items-start justify-start flex-col pl-4 sm:pl-8">  
                    <img src={url} class="h-[8rem] w-[8rem] border-[5px] border-main rounded-full object-cover">
                    <h1 class="font-bold text-2xl">
                        {user_data.username}
                    </h1>
                    <p class="text-white/50 text-left flex flex-col md:flex-row md:gap-1">
                        @{user_data.handle}{#if user_data.job_title},
                            <span>{user_data.job_title}</span>
                        {/if}
                    </p>
                    <p class="mt-1 w-2/3 whitespace-pre-wrap text-left break-words">
                        {user_data.bio ? user_data.bio : 'No bio yet'}
                    </p>
    
                    <div class="flex flex-row items-center justify-center gap-4 text-white/50 mt-2">
                        <p>
                            <span class="text-white font-semibold">{user_data.followers.length}</span> Follower{user_data.followers.length === 1 ? '' : 's'}
                        </p>
                        <p>
                            <span class="text-white font-semibold">{user_data.following.length}</span> Following
                        </p>
                    </div>
                </section>
                <aside class="mr-6 mt-3">
                    {#if $currentUser?.id === user_data.id}
                        <button on:click={() => {goto('/profile/edit')}} class="bg-main border border-white/20 p-3 md:p-1.5 md:px-5 rounded-full font-medium hover:bg-white hover:bg-opacity-[0.04] duration-50">
                            <span on:click={() => {goto('/profile/edit')}} class="md:flex hidden">Edit Profile</span>
                            <span on:click={() => {goto('/profile/edit')}} class="flex md:hidden"><Icon icon="ph:pen-fill" class="w-5 h-5" /></span>
                        </button>
                    {:else}
                        <button class="bg-white text-black border border-white/20 p-1.5 px-5 rounded-full font-medium hover:bg-opacity-[0.8] duration-50">
                            Follow
                        </button>
                    {/if}
                </aside>
            </section>

            <div class="w-full border-b border-b-white/10 mt-8 flex flex-row items-center justify-center">
                <button class="font-semibold text-white pb-4 border-b border-b-white w-full">
                    Posts
                </button>
                <button class="text-white/50 pb-4 w-full">
                    Replies
                </button>
                <button class="text-white/50 pb-4 w-full">
                    Quotes
                </button>
            </div>
        </div>

        <div class="flex flex-col pt-4 gap-4 mb-16 md:mb-0">
            {#if loading}
                <img src={Spinner} class="h-14 w-14 mt-24" />
            {:else if noPosts}
                <p class="mt-12 font-medium">
                    This user has no posts.
                </p>
            {:else}
                {#each user_posts as post}
                    <Post PostData={post} additionalClasses="pt-2 pb-6 w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem]" />
                {/each}
            {/if}
        </div>
    </div>
{:else}
    <Loading />
{/if}