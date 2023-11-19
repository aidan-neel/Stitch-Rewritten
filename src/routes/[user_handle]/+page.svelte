<script lang='ts'>
	import Post from '$lib/Components/Home/Post.svelte';
	import Loading from '$lib/Components/Menus/Loading.svelte';
	import { currentUser, pb } from '$lib/Pocketbase';
	import { postCreation, postCreationContent } from '$lib/Stores.js';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

    export let data;

    let url;
    let banner;
    let loading;
    let user_data = null;

    let user_posts = [];

    $: user_handle = data.handle; // Assuming 'handle' is the route parameter
    $: currentUserOwnsProfile = user_data && $currentUser?.id === user_data.id;

    async function fetchData() {
        if(user_handle) {
            try {
                loading = true;
                const user = await pb.collection('users').getList(1, 3, {
                    filter: `handle = "${user_handle}"`
                });

                const data = user.items[0];
                const record = data.avatar;

                user_data = data;

                url = pb.files.getUrl(data, record, {'thumb': '32x32'});
                if(url === '') {
                    url = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user_handle;
                }

                const banner_ = data.banner;

                banner = pb.files.getUrl(data, banner_, {'thumb': '1500x450'});
                if(banner === '') {
                    banner = null;
                }

                const posts = await pb.collection('posts').getList(1, 3, {
                    filter: `user = "${data.id}"`,
                    sort: '-created_at',
                    expand: 'user'
                });

                posts.items.forEach((post) => {
                    user_posts = [...user_posts, post];
                })

                console.log(user_posts);
            } catch (error) {
                console.error(error);
            } finally {
                loading = false;
            }
        }
    }

    async function mentionUser() {
        if (loading === false && user_data !== null && currentUserOwnsProfile === false) {
            console.log(user_data.handle);
            postCreationContent.set(`@${user_data.handle} `);
            console.log($postCreationContent);
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

{#if loading === false && user_data !== null}
    <div class="border-l border-l-white/10 h-screen w-[17.5%] pl-8 flex items-start justify-center pt-6">
        <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
            <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
            <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
        </div>
    </div>

    <div class="flex w-[47.5rem] overflow-x-hidden overflow-y-auto hide-scrollbar flex-col h-full items-center justify-start relative">
        {#if banner === null}
            <div class="bg-white/70 border-b border-b-white/10 h-1/6 flex-shrink-0 w-full relative flex items-end justify-center">
                <img src={url} class="h-44 w-44 border-[5px] border-main rounded-full object-cover absolute top-28">
                {#if $currentUser?.id === user_data.id}
                    <button class="absolute right-6 top-60 bg-main border border-white/20 rounded-lg p-1 px-4">
                        Edit Profile
                    </button>
                {/if}
            </div>
        {:else}
            <div class="bg-white/70 border-b border-b-white/10 h-1/6 flex-shrink-0 flex items-center justify-center w-full relative">
                <img src={banner} alt="Profile Banner" class="w-full h-full object-cover">
                <img src={url} class="h-44 w-44 border-[5px] border-main rounded-full object-cover absolute top-28">
                {#if $currentUser?.id === user_data.id}
                    <button class="absolute right-6 top-60 bg-main border border-white/20 rounded-lg p-1 px-4">
                        Edit Profile
                    </button>
                {/if}
            </div>
        {/if}
        <div class="w-full flex items-center justify-start mt-24 flex-col">
            <h1 class="font-bold text-2xl">
                {user_data.username}
            </h1>
            <p class="text-white/50">
                @{user_data.handle} {#if user_data.title} 
                    &middot; {user_data.title}
                {/if}
            </p>
            <p class="mt-1 w-2/3 whitespace-pre-wrap break-words">
                {user_data.bio}
            </p>

            <div class="flex flex-row items-center justify-center gap-4 text-white/50 mt-2">
                <p>
                    <span class="text-white font-semibold">{user_data.followers.length}</span> Follower{user_data.followers.length === 1 ? '' : 's'}
                </p>
                <p>
                    <span class="text-white font-semibold">{user_data.following.length}</span> Following
                </p>
            </div>

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

        <div class="flex flex-col pt-4 gap-4 h-full overflow-y-auto">
            {#each user_posts as post}
                <Post PostData={post} additionalClasses="pt-3.5" />
            {/each}
        </div>
    </div>
{:else}
    <Loading />
{/if}