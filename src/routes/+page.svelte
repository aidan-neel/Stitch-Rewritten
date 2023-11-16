<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import { currentUser, pb } from "$lib/Pocketbase";
    import Icon from "@iconify/svelte";
    import { onDestroy, onMount } from "svelte";

    let posts = []
    let currentNumber = 1;
    let loading = true;

    let menu = true;

    async function fetchPosts() {
        loading = true;
        try {
            const records = await pb.collection('posts').getList(currentNumber, currentNumber + 15, {
                sort: '-created_at',
                expand: 'user'
            })

            const itemsToPush = [];
            for (let i = 0; i < records.items.length; i++) {
                itemsToPush.push(records.items[i])
            }

            itemsToPush.forEach((item) => {
                posts = [...posts, item]
            })
        } catch (error) {
            console.error(error);
        } finally {
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

    $: {
        console.log(posts);
    }
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


</style>

{#if loading === true && posts.length < 0}
    <Loading />
{/if}

<main class="flex items-start flex-row pl-64 justify-center w-[88%] max-2xl:w-[80%] h-screen">
    <div class="flex flex-col h-full">
        <div class="w-[47.5rem] overflow-y-auto fadeUp fadeUpFast gap-6 grid overflow-x-hidden hide-scrollbar  items-center justify-start">
            <PostInput user={$currentUser} />
            {#if posts.length > 0 && loading === false}
                {#each posts as post}
                    <Post PostData={post} />
                {/each}
            {/if}
        </div>
    </div>
    <div class="h-screen w-[22%] mt-8 ml-64 justify-start flex flex-col fadeUp fadeUpFast">
        <div class="w-full rounded-full dark:bg-white bg-black bg-opacity-5 dark:bg-opacity-[0] border dark:border-white border-black dark:border-opacity-[0.15] border-opacity-[0.15] p-0.5 px-2 mt-4 flex flex-row">
            <Icon icon="iconamoon:search" class="w-5 h-5 dark:text-white/40 text-black/50 m-3" />
            <input type="text" placeholder="Search" class="bg-transparent dark:text-white/70 text-black/80 placeholder:text-black/60 dark:placeholder:text-white/40 w-full outline-none" />
        </div>
        <div class="flex items-start justify-between flex-row mt-8">
            <p class="dark:text-white/40 text-black/50 font-mono">
                Suggested for you
            </p>    
            <button class="dark:text-white/70 text-black/90 font-medium mr-1">
                See All
            </button>
        </div>
    </div>
</main>