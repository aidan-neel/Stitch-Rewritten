<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import { currentUser, pb } from "$lib/Pocketbase";
    import Icon from "@iconify/svelte";
    import { onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";

    let posts = []
    let loading = true;

    let disclaimer = true;
    let page = 1;
    let isFetching = false;
    let allPostsLoaded = false;
    let scrollableElement;
    let userData;
    const pageSize = 7;

    let lastScrollTop = 0; // To track the last scroll position

    async function fetchPosts() {
        if (isFetching || allPostsLoaded) return;

        isFetching = true;
        try {
            const records = await pb.collection('posts').getList(1, 50, {
                sort: '-created_at',
                expand: 'user',
                filter: 'content_type = "post"'
            });

            posts = [...posts, ...records.items];
        } catch (error) {
            console.error(error);
        } finally {
            isFetching = false;
            loading = false;
        }
    }
    onMount(async() => {
        await fetchPosts();
        pb.collection('posts').subscribe('*', async ({action, record}) => {
            if (action === 'create') {
                posts = [record, ...posts]
             }
            if (action === 'delete') {
                posts = posts.filter((post) => {
                    return post.id !== record.id
                })
            }
        })
    })

    onDestroy(() => {
        posts = [];
        pb.collection('posts').unsubscribe('*');
    })

    $: doneLoading = posts.length > 0

    let wantToJoinDivOpen = true;
</script>

<svelte:head>
    <title>
        Stitch
    </title>
</svelte:head>

<style>
    .posts-container {
        display: grid;
        justify-items: center; /* Centers children horizontally */
        align-items: start;    /* Aligns children to the top */
        max-height: 80vh;
        overflow-y: auto;
    }

    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .centerDiv {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

{#if loading === true}
    <Loading />
{/if}

{#if disclaimer}
    <div class="h-screen w-screen flex items-center justify-center  backdrop-blur-[6px] bg-black/20 absolute z-40">
        <div transition:fade="{{ delay: 0, duration: 250}}" class="w-[32rem] bg-main border border-white/10 rounded-xl flex items-start justify-start flex-col p-5">
            <p class="text-sm mb-1">
                Stitch <span class="font-mono text-xs text-white/70 font-normal">Beta</span>
            </p>
            <h1 class="text-3xl font-semibold">
                Warning!
            </h1>
            <p class="text-left text-white/90 mt-1">
                Stitch is in a beta phase, which means bugs and issues are guaranteed to be present.
                Please report any issues you find to the developer. Not all features are implemented, 
                and some are bugged and don't work as intended. I have slowly been working on this project
                and will continue to do so. Thank you for your patience.
            </p>
            <button on:click={() => {
                disclaimer = false
            }} class="bg-white w-32 duration-100 hover:bg-white/80 py-1 text-black/90 mt-4 rounded-md font-medium">
                Close
            </button>
        </div>
    </div>
{/if}

<div class="border-l border-l-white/10 h-screen w-[28rem] xl:flex hidden px-8 items-start justify-center pt-6">
    <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
        <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
        <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
    </div>
</div>

<div class="flex flex-col h-full items-center justify-start">
    <div class="w-full overflow-y-auto fadeUp fadeUpFast gap-6 grid overflow-x-hidden hide-scrollbar items-center justify-center">
        <PostInput user={$currentUser} />
        {#each posts as post}
            <Post PostData={post} additionalClasses="pb-6 w-screen md:w-[90vw] lg:w-[38.5rem] xl:w-[47.5rem]" />
        {/each}
    </div>
</div>