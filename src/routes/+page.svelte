<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import { currentUser, pb } from "$lib/Pocketbase";
    import Icon from "@iconify/svelte";
    import { onDestroy, onMount } from "svelte";

    let posts = []
    let loading = true;

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
                expand: 'user'
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
            <Post PostData={post} additionalClasses="pb-6 w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem]" />
        {/each}
    </div>
</div>